import { CHARACTERS } from "../../constants/characters";
import { PING_MS, QUIET_LIMIT_MS } from "../../constants/coop";
import { STAND } from "../../constants/hero";
import { VOLUME_STEPS } from "../../constants/settings";
import { GAME_VERSION } from "../../constants/sitePages";
import { MAX_FRAME } from "../../constants/stage";
import { type GuestLink, joinRoom } from "../../services/coop/guestLink";
import { loadHeroChoice } from "../../services/heroChoice";
import { resetRoom, roomView, updateRoom } from "../../store/coop";
import { addCoins, ownedItems } from "../../store/meta";
import { settings } from "../../store/settings";
import type { GuestHud, HostMessage } from "../../types/coop";
import type { Enemy } from "../../types/enemy";
import { syncCoopStatus } from "../../ui/coop/coopStatus";
import { drawDangerGlow } from "../../ui/dangerGlow";
import { paintImage } from "../../ui/gameCanvas";
import { updateHud } from "../../ui/hud";
import { leaveMenu } from "../../ui/menu/menuActions";
import { isMenuOpen, openMenu } from "../../ui/menu/menuState";
import { setPickSource, syncPickDialog } from "../../ui/skills/pickDialog";
import { syncTouch } from "../../ui/touch/bindTouch";
import { fromWire } from "../../utils/wire";
import { setFrameDriver } from "../frameDriver";
import { releaseAll, watchInput } from "../input";
import { updateDanger } from "../lowHealth";
import { resetRun } from "../run";
import { reportRun } from "../runEnd";
import { seatMemories } from "../seatMemory";
import { character, game, hero, progress, setCharacter } from "../state";
import { writePick } from "./readPick";

/** A seat in a room hosted elsewhere: keys go to the host, the host's picture and HUD come back. */
export class GuestSession {
  private link: GuestLink | null = null;
  private hud: GuestHud | null = null;
  /** a card was sent and the host has not yet answered with fewer picks */
  private sentPicks = -1;
  private video: HTMLVideoElement | null = null;
  private pinger = 0;
  private lastHeard = 0;
  /** when the last display frame ran, for the low health glow's fade */
  private lastFrame = 0;
  private playing = false;
  private closed = false;

  /** join the room with this code; rejects with a reason a player can read */
  async join(code: string): Promise<void> {
    updateRoom({ phase: "connecting", role: "guest", code, error: "", note: "" });
    this.link = await joinRoom(code, {
      message: (msg) => this.receive(msg),
      stream: (media) => this.show(media),
      lost: (reason) => this.close(reason),
    });
    if (this.closed) {
      this.link.close();
      return;
    }
    this.lastHeard = performance.now();
    this.link.send({ t: "hello", hero: character.id, owned: ownedItems(), version: GAME_VERSION });
    this.pinger = window.setInterval(() => this.ping(), PING_MS);
  }

  private ping(): void {
    this.link?.send({ t: "ping" });
    if (performance.now() - this.lastHeard > QUIET_LIMIT_MS) this.close("Lost the connection to the host.");
  }

  /** this player's hero for the next run */
  chooseHero(id: string): void {
    this.link?.send({ t: "hero", hero: id });
  }

  private receive(msg: HostMessage): void {
    this.lastHeard = performance.now();
    switch (msg.t) {
      case "welcome":
        updateRoom({ phase: "lobby", you: msg.slot });
        break;
      case "refuse":
        this.close(msg.reason);
        break;
      case "lobby":
        updateRoom({ seats: msg.seats });
        break;
      case "start":
        this.startRun();
        break;
      case "hud":
        this.hud = msg.hud;
        break;
      case "end":
        this.endRun(msg.coins);
        reportRun({ outcome: msg.outcome, wave: msg.wave, coins: msg.coins });
        updateRoom({ phase: "lobby" });
        break;
      case "closed":
        this.close("The host left, so the room has closed. Coins you picked up are in your bank.");
        break;
    }
  }

  private startRun(): void {
    this.playing = true;
    this.hud = null;
    this.sentPicks = -1;
    watchInput((a, d) => this.link?.send({ t: "key", a, d }));
    setPickSource({
      waiting: () => game.mode === "pick" && progress.picks > 0 && this.sentPicks < 0,
      choose: (option) => {
        this.sentPicks = progress.picks;
        this.link?.send({ t: "pick", pick: writePick(option) });
      },
    });
    this.lastFrame = performance.now();
    setFrameDriver((now) => this.frame(now));
    updateRoom({ phase: "playing", note: "" });
    leaveMenu();
  }

  /** the host's stream plays in a hidden video; each frame copies it onto the game canvas */
  private show(media: MediaStream): void {
    this.video?.remove();
    const video = document.createElement("video");
    video.className = "coop-stream";
    video.playsInline = true;
    video.autoplay = true;
    video.srcObject = media;
    document.body.append(video);
    // browsers that refuse sound without a fresh tap play the picture muted until the next key or tap
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => undefined);
      const unmute = (): void => {
        video.muted = !settings.sound;
      };
      addEventListener("pointerdown", unmute, { once: true });
      addEventListener("keydown", unmute, { once: true });
    });
    this.video = video;
  }

  private frame(now: number): void {
    const dt = Math.min(MAX_FRAME, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const video = this.video;
    if (video && video.readyState >= 2) {
      paintImage(video);
      if (!video.muted || !settings.sound) video.muted = !settings.sound;
      video.volume = settings.volume / VOLUME_STEPS;
    }
    if (this.hud) this.applyHud(this.hud);
    updateDanger(dt);
    drawDangerGlow(true);
    updateHud();
    syncPickDialog();
    syncTouch(!isMenuOpen() && game.mode === "play" && !this.hud?.down);
    syncCoopStatus(true);
  }

  /** this player's hero and the shared game as the host last told it, for the HUD and the cards */
  private applyHud(hud: GuestHud): void {
    seatMemories().forEach((m, i) => {
      const bag = hud.bags[i];
      if (bag !== null && bag !== undefined) m.load(fromWire(bag));
    });
    game.mode = hud.mode;
    game.wave = hud.wave;
    game.kills = hud.kills;
    game.banner = hud.banner;
    game.enemies = hud.leader ? [hud.leader as Enemy] : [];
    if (this.sentPicks >= 0 && (progress.picks !== this.sentPicks || game.mode !== "pick")) this.sentPicks = -1;
    const room = roomView();
    if (room.downed !== hud.down || room.choosing.join() !== hud.choosing.join())
      updateRoom({ downed: hud.down, choosing: hud.choosing });
  }

  /** the run is over: bank what this player picked up and put the scene back as solo play has it */
  private endRun(coins: number): void {
    if (!this.playing) return;
    this.playing = false;
    addCoins(coins);
    setFrameDriver(null);
    syncCoopStatus(false);
    updateRoom({ downed: false, choosing: [] });
    setPickSource(null);
    watchInput(null);
    releaseAll();
    this.video?.remove();
    this.video = null;
    this.hud = null;
    game.coins = 0;
    game.coinDrops = [];
    game.enemies = [];
    hero.state = "idle";
    hero.pose = STAND;
    setCharacter(CHARACTERS.find((c) => c.id === loadHeroChoice()) ?? character);
    resetRun("");
    hero.inv = 0;
    game.mode = "play";
  }

  /** leave, or be told the room is gone: coins picked up so far are kept */
  close(reason = ""): void {
    if (this.closed) return;
    this.closed = true;
    this.endRun(game.coins);
    window.clearInterval(this.pinger);
    this.link?.close();
    resetRoom(reason);
    if (reason) openMenu("title", "coop");
  }
}
