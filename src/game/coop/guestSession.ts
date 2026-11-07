import { CHARACTERS } from "../../constants/characters";
import { HOST_AWAY_MS, PING_MS, QUIET_LIMIT_MS, WAITING_FILL } from "../../constants/coop";
import { STAND } from "../../constants/hero";
import { VOLUME_STEPS } from "../../constants/settings";
import { GAME_VERSION } from "../../constants/sitePages";
import { MAX_FRAME } from "../../constants/stage";
import { type GuestLink, joinRoom } from "../../services/coop/guestLink";
import { loadHeroChoice } from "../../services/heroChoice";
import { recordFeat } from "../../store/achievements";
import { postNote, resetRoom, roomView, updateRoom } from "../../store/coop";
import { addCoins, heroUnlocked, onMetaChange, ownedItems } from "../../store/meta";
import { settings } from "../../store/settings";
import type { GuestHud, HostMessage } from "../../types/coop";
import type { Enemy } from "../../types/enemy";
import { setChestSource, syncChestDialog } from "../../ui/chest/chestDialog";
import { syncCoopStatus } from "../../ui/coop/coopStatus";
import { drawDangerGlow } from "../../ui/dangerGlow";
import { paintFill, paintImage } from "../../ui/gameCanvas";
import { updateHud } from "../../ui/hud";
import { leaveMenu } from "../../ui/menu/menuActions";
import { isMenuOpen, openMenu } from "../../ui/menu/menuState";
import { setPickSource, syncPickDialog } from "../../ui/skills/pickDialog";
import { syncTouch } from "../../ui/touch/bindTouch";
import { leftNote } from "../../utils/roomNotes";
import { fromWire } from "../../utils/wire";
import { setFrameDriver } from "../frameDriver";
import { releaseAll, watchInput } from "../input";
import { updateDanger } from "../lowHealth";
import { answerPick } from "../progress";
import { resetRun } from "../run";
import { reportRun } from "../runEnd";
import { seatMemories } from "../seatMemory";
import { character, game, hero, progress, setCharacter } from "../state";
import { writeAnswer } from "./readPick";

const HOST_LEFT = "The host left, so the room has closed.";
/** added to the reason a room closed when it closed during a run, whose coins this player keeps */
const COINS_KEPT = "Coins you picked up are in your bank.";

/** A seat in a room hosted elsewhere: keys go to the host, the host's picture and HUD come back. */
export class GuestSession {
  private link: GuestLink | null = null;
  private hud: GuestHud | null = null;
  /** when the last HUD came */
  private hudAt = 0;
  /** a card was sent and the host has not yet answered with fewer picks */
  private sentPicks = -1;
  /** "chest seen" was sent and the host has not yet put the chest away */
  private sentChest = false;
  private video: HTMLVideoElement | null = null;
  private pinger = 0;
  private lastHeard = 0;
  /** when the last display frame ran, for the low health glow's fade */
  private lastFrame = 0;
  private playing = false;
  private closed = false;
  /** stops telling the host about purchases */
  private unwatchShop: () => void = () => undefined;

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
    addEventListener("pagehide", this.onPageHide);
    // the shop is open between runs too, and the next run should wear what this player buys there
    this.unwatchShop = onMetaChange(() => this.link?.send({ t: "shop", owned: ownedItems() }));
  }

  private readonly onPageHide = (): void => this.close();

  private ping(): void {
    this.link?.send({ t: "ping" });
    if (performance.now() - this.lastHeard > QUIET_LIMIT_MS) this.close("Lost the connection to the host.");
  }

  /** this player's hero for the next run */
  chooseHero(id: string): void {
    this.link?.send({ t: "hero", hero: id });
  }

  private receive(msg: HostMessage): void {
    // the link lingers a moment after leaving so the goodbye can go out; what arrives then is for a room that is gone
    if (this.closed) return;
    this.lastHeard = performance.now();
    switch (msg.t) {
      case "welcome":
        updateRoom({ phase: "lobby", you: msg.slot });
        break;
      case "refuse":
        this.close(msg.reason);
        break;
      case "lobby":
        // someone joining makes a note about someone leaving old news
        if (msg.seats.length > roomView().seats.length) updateRoom({ seats: msg.seats, note: "" });
        else updateRoom({ seats: msg.seats });
        break;
      case "left":
        postNote(leftNote(msg.slot));
        break;
      case "start":
        this.startRun();
        break;
      case "hud":
        this.hud = msg.hud;
        this.hudAt = performance.now();
        break;
      case "end":
        this.endRun(msg.coins);
        // the host left mid-run: the room is gone, so there is no room to go back to
        if (msg.outcome === "left") return this.close(HOST_LEFT, true);
        reportRun({ outcome: msg.outcome, wave: msg.wave, coins: msg.coins });
        updateRoom({ phase: "lobby" });
        break;
      case "closed":
        this.close(HOST_LEFT);
        break;
    }
  }

  private startRun(): void {
    this.playing = true;
    this.hud = null;
    this.hudAt = performance.now();
    this.sentPicks = -1;
    this.sentChest = false;
    watchInput((a, d) => this.link?.send({ t: "key", a, d }));
    setPickSource({
      // the cards step aside while the pause menu is open, since the room plays on under it
      waiting: () => game.mode === "pick" && progress.picks > 0 && this.sentPicks < 0 && !isMenuOpen(),
      answer: (answer) => {
        // a take or a skip waits for the host to spend the point; a reroll or banish is spent here too, so the cards
        // are dealt again at once with the right counts until the host's next HUD agrees
        if (answer.t === "take" || answer.t === "skip") this.sentPicks = progress.picks;
        else answerPick(answer);
        this.link?.send({ t: "pick", answer: writeAnswer(answer) });
      },
    });
    setChestSource({
      waiting: () => game.mode === "chest" && progress.build.chest.length > 0 && !this.sentChest && !isMenuOpen(),
      seen: () => {
        this.sentChest = true;
        this.link?.send({ t: "chestSeen" });
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
    const pictured = video !== null && video.readyState >= 2;
    if (pictured) {
      paintImage(video);
      if (!video.muted || !settings.sound) video.muted = !settings.sound;
      video.volume = settings.volume / VOLUME_STEPS;
    }
    // until the host's picture arrives the canvas would still hold this browser's own solo scene, with one hero in it
    else paintFill(WAITING_FILL);
    if (this.hud) this.applyHud(this.hud);
    const hostAway = !pictured || now - this.hudAt > HOST_AWAY_MS;
    if (roomView().hostAway !== hostAway) updateRoom({ hostAway });
    updateDanger(dt);
    drawDangerGlow(true);
    updateHud();
    syncPickDialog();
    syncChestDialog();
    syncTouch(!isMenuOpen() && game.mode === "play" && !this.hud?.down);
    // the line sits where the pause menu opens, so it waits under the menu
    syncCoopStatus(!isMenuOpen());
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
    if (this.sentChest && (!progress.build.chest.length || game.mode !== "chest")) this.sentChest = false;
    const room = roomView();
    if (room.downed !== hud.down || room.choosing.join() !== hud.choosing.join())
      updateRoom({ downed: hud.down, choosing: hud.choosing });
  }

  /** the run is over: bank what this player picked up and put the scene back as solo play has it */
  private endRun(coins: number): void {
    if (!this.playing) return;
    this.playing = false;
    addCoins(coins);
    recordFeat({ kind: "banked", coins });
    setFrameDriver(null);
    syncCoopStatus(false);
    updateRoom({ downed: false, choosing: [], hostAway: false });
    setPickSource(null);
    setChestSource(null);
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
    setCharacter(CHARACTERS.find((c) => c.id === loadHeroChoice() && heroUnlocked(c.id)) ?? character);
    resetRun("");
    hero.inv = 0;
    game.mode = "play";
  }

  /** leave, or be told the room is gone: coins picked up so far are kept, and the reason says so */
  close(reason = "", banked = this.playing): void {
    if (this.closed) return;
    this.closed = true;
    const result = { outcome: "left" as const, wave: game.wave, coins: game.coins };
    const playing = this.playing;
    this.endRun(result.coins);
    window.clearInterval(this.pinger);
    removeEventListener("pagehide", this.onPageHide);
    this.unwatchShop();
    const link = this.link;
    // say goodbye so the host lets this place go at once, and give it a moment to leave before the link closes
    link?.send({ t: "bye" });
    window.setTimeout(() => link?.close(), 300);
    resetRoom(reason && banked ? `${reason} ${COINS_KEPT}` : reason);
    if (reason) openMenu("title", "coop");
    // leaving mid-run from the pause menu shows what the run earned, as it does for a host who leaves
    else if (playing) reportRun(result);
  }
}
