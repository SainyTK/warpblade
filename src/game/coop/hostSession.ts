import { CHARACTERS } from "../../constants/characters";
import { HUD_RATE, MAX_PLAYERS, PING_MS, QUIET_LIMIT_MS } from "../../constants/coop";
import { GAME_VERSION } from "../../constants/sitePages";
import { MAX_FRAME, STEP } from "../../constants/stage";
import { sfx } from "../../services/audio";
import { captureGame, type GameStream, tuneVideoSender } from "../../services/coop/gameStream";
import { type HostLink, openRoom, RoomTaken } from "../../services/coop/hostLink";
import { postNote, resetRoom, roomView, updateRoom } from "../../store/coop";
import type { GuestMessage, SeatInfo } from "../../types/coop";
import type { RunOutcome } from "../../types/run";
import { syncCoopStatus } from "../../ui/coop/coopStatus";
import { drawDangerGlow } from "../../ui/dangerGlow";
import { gameCanvas, paintScene } from "../../ui/gameCanvas";
import { updateHud } from "../../ui/hud";
import { leaveMenu } from "../../ui/menu/menuActions";
import { isMenuOpen, openMenu } from "../../ui/menu/menuState";
import { setPickSource, syncPickDialog } from "../../ui/skills/pickDialog";
import { syncTouch } from "../../ui/touch/bindTouch";
import { makeRoomCode } from "../../utils/roomCode";
import { leftNote } from "../../utils/roomNotes";
import { setFrameDriver } from "../frameDriver";
import { press, release } from "../input";
import { reportRun } from "../runEnd";
import { character, game, hero, progress } from "../state";
import { stepGame } from "../step";
import { HostRun, type SeatStart } from "./hostRun";
import { readPick } from "./readPick";
import type { Seat } from "./seat";

/** codes tried before giving up, should the broker say each one is taken */
const CODE_TRIES = 4;

interface Guest {
  slot: number;
  hero: string;
  owned: Record<string, number>;
  lastSeen: number;
}

const heroById = (id: string) => CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];

/** A room hosted in this browser: the lobby, the guests' links, and the co-op run with its stream. */
export class HostSession {
  private link: HostLink | null = null;
  private readonly guests = new Map<string, Guest>();
  private run: HostRun | null = null;
  private stream: GameStream | null = null;
  private pinger = 0;
  private lastHud = 0;
  private last = 0;
  private acc = 0;
  private closed = false;

  /** open a room under a fresh code and wait in the lobby */
  async open(): Promise<void> {
    updateRoom({ phase: "connecting", role: "host", error: "", note: "" });
    let code = "";
    for (let i = 0; i < CODE_TRIES && !this.link && !this.closed; i++) {
      code = makeRoomCode(Math.random);
      try {
        this.link = await openRoom(code, {
          join: () => undefined,
          message: (peer, msg) => this.receive(peer, msg),
          leave: (peer) => this.drop(peer),
          lost: (reason) => this.close(reason),
        });
      } catch (err) {
        if (err instanceof RoomTaken) continue;
        throw err;
      }
    }
    // a room cancelled while it opened writes nothing: the room shown by now may be another one
    if (this.closed) {
      this.link?.close();
      return;
    }
    if (!this.link) throw new Error("Could not find a free room code. Try again.");
    updateRoom({ phase: "lobby", code, you: 0 });
    this.publishLobby();
    this.pinger = window.setInterval(() => this.ping(), PING_MS);
    addEventListener("pagehide", this.onPageHide);
  }

  private readonly onPageHide = (): void => this.close();

  private seats(): SeatInfo[] {
    const seats: SeatInfo[] = [{ slot: 0, hero: character.id }];
    for (const g of this.guests.values()) seats.push({ slot: g.slot, hero: g.hero });
    return seats.sort((a, b) => a.slot - b.slot);
  }

  /** the lobby's player list, to this browser's menu and to every guest */
  private publishLobby(): void {
    const seats = this.seats();
    updateRoom({ seats });
    for (const peer of this.guests.keys()) this.link?.send(peer, { t: "lobby", seats });
  }

  /**
   * The lobby list doubles as a heartbeat, during a run too: a host whose tab is hidden draws no frames and sends no
   * HUD, and the guests should wait for it rather than count it gone. Guests gone quiet are let go.
   */
  private ping(): void {
    const now = performance.now();
    for (const [peer, g] of this.guests) if (now - g.lastSeen > QUIET_LIMIT_MS) this.link?.drop(peer);
    this.publishLobby();
  }

  /** the host changed hero in the lobby */
  heroChanged(): void {
    if (!this.run) this.publishLobby();
  }

  private freeSlot(): number {
    const taken = new Set([0, ...[...this.guests.values()].map((g) => g.slot)]);
    for (let slot = 1; slot < MAX_PLAYERS; slot++) if (!taken.has(slot)) return slot;
    return -1;
  }

  private refuse(peer: string, reason: string): void {
    this.link?.send(peer, { t: "refuse", reason });
    window.setTimeout(() => this.link?.drop(peer), 500);
  }

  private receive(peer: string, msg: GuestMessage): void {
    // the links linger a moment after the room closes so the goodbyes can go out; what arrives then is for a room that is gone
    if (this.closed) return;
    const guest = this.guests.get(peer);
    if (guest) guest.lastSeen = performance.now();
    if (msg.t === "hello") return this.welcome(peer, msg.hero, msg.owned, msg.version);
    if (!guest) return;
    if (msg.t === "bye") return this.link?.drop(peer);
    if (msg.t === "hero" && !this.run) {
      guest.hero = heroById(msg.hero).id;
      this.publishLobby();
      return;
    }
    // the next run wears what was bought; a run under way keeps what it started with
    if (msg.t === "shop" && !this.run) {
      guest.owned = msg.owned;
      return;
    }
    const seat = this.run?.seatOf(peer);
    if (!this.run || !seat) return;
    if (msg.t === "key") this.run.applyKey(seat, () => (msg.d ? press(msg.a) : release(msg.a)));
    else if (msg.t === "pick") this.run.chooseFor(seat, msg.pick, readPick);
  }

  private welcome(peer: string, hero: string, owned: Record<string, number>, version: string): void {
    if (this.guests.has(peer)) return;
    if (version !== GAME_VERSION)
      return this.refuse(peer, "The host plays another version. Reload the page and try again.");
    if (this.run) return this.refuse(peer, "That room is already playing. Join when the run ends.");
    const slot = this.freeSlot();
    if (slot < 0) return this.refuse(peer, `That room is full: ${MAX_PLAYERS} players already.`);
    this.guests.set(peer, { slot, hero: heroById(hero).id, owned, lastSeen: performance.now() });
    this.link?.send(peer, { t: "welcome", slot });
    // someone joining makes a note about someone leaving old news
    updateRoom({ note: "" });
    this.publishLobby();
  }

  /** a guest left or dropped */
  private drop(peer: string): void {
    const guest = this.guests.get(peer);
    if (!guest || this.closed) return;
    this.guests.delete(peer);
    postNote(leftNote(guest.slot));
    for (const other of this.guests.keys()) this.link?.send(other, { t: "left", slot: guest.slot });
    const seat = this.run?.seatOf(peer);
    if (this.run && seat) this.run.removeSeat(seat);
    this.publishLobby();
  }

  /** everyone in the lobby starts the run together */
  start(): void {
    if (this.run || !this.link) return;
    const link = this.link;
    const starts: SeatStart[] = [{ slot: 0, peer: null, character, owned: null }];
    for (const [peer, g] of this.guests)
      starts.push({ slot: g.slot, peer, character: heroById(g.hero), owned: g.owned });
    starts.sort((a, b) => a.slot - b.slot);
    this.run = new HostRun(starts, { ended: (outcome, wave, coins) => this.ended(outcome, wave, coins) });
    this.stream = captureGame(sfx.outputStream());
    for (const peer of this.guests.keys()) {
      link.send(peer, { t: "start" });
      const call = link.stream(peer, this.stream.media);
      if (call) tuneVideoSender(call.peerConnection);
    }
    setPickSource({
      // the cards step aside while the pause menu is open, since the room plays on under it
      waiting: () => game.mode === "pick" && progress.picks > 0 && !isMenuOpen(),
      choose: (option) => this.run?.chooseHome(option),
    });
    this.last = performance.now();
    this.acc = 0;
    setFrameDriver((now) => this.frame(now));
    updateRoom({ phase: "playing", note: "" });
    leaveMenu();
  }

  /** one display frame of the run: steps, the picture, the stream, the HUD, and the guests' HUDs a few times a second */
  private frame(now: number): void {
    const run = this.run;
    if (!run) return;
    // a room plays on under the pause menu: the others are still fighting
    this.acc += Math.min(MAX_FRAME, (now - this.last) / 1000);
    this.last = now;
    while (this.acc >= STEP && this.run) {
      this.acc -= STEP;
      stepGame();
    }
    if (!this.run) return;
    paintScene();
    this.stream?.mirror(gameCanvas);
    drawDangerGlow(true);
    updateHud();
    syncPickDialog();
    syncTouch(!isMenuOpen() && game.mode === "play" && hero.state !== "dead");
    // the line sits where the pause menu opens, so it waits under the menu
    syncCoopStatus(!isMenuOpen());
    if (now - this.lastHud < 1000 / HUD_RATE) return;
    this.lastHud = now;
    for (const seat of run.seats) this.sendHud(run, seat);
    this.publishOwnStatus(run);
  }

  /** the host's own line: down, or waiting on others' cards */
  private publishOwnStatus(run: HostRun): void {
    const downed = hero.state === "dead";
    const choosing = game.mode === "pick" ? run.choosing() : [];
    const room = roomView();
    if (room.downed !== downed || room.choosing.join() !== choosing.join()) updateRoom({ downed, choosing });
  }

  private sendHud(run: HostRun, seat: Seat): void {
    if (seat.peer) this.link?.send(seat.peer, { t: "hud", hud: run.hudFor(seat) });
  }

  /** the run is over: each guest banks their own coins, and everyone goes back to the lobby */
  private ended(outcome: RunOutcome, wave: number, coins: Map<Seat, number>): void {
    const run = this.run;
    this.run = null;
    this.stopRun();
    for (const [seat, earned] of coins)
      if (seat.peer) this.link?.send(seat.peer, { t: "end", outcome, wave, coins: earned });
    const home = run?.seats.find((s) => !s.peer);
    reportRun({ outcome, wave, coins: (home && coins.get(home)) ?? 0 });
    if (!this.closed) {
      updateRoom({ phase: "lobby" });
      this.publishLobby();
    }
  }

  private stopRun(): void {
    setFrameDriver(null);
    syncCoopStatus(false);
    updateRoom({ downed: false, choosing: [] });
    setPickSource(null);
    this.stream?.stop();
    this.stream = null;
  }

  /** leave the room: a run in play ends with everyone's coins banked, and the guests are told it closed */
  close(reason = ""): void {
    if (this.closed) return;
    this.closed = true;
    resetRoom(reason);
    this.run?.finish("left");
    window.clearInterval(this.pinger);
    removeEventListener("pagehide", this.onPageHide);
    for (const peer of this.guests.keys()) this.link?.send(peer, { t: "closed" });
    const link = this.link;
    // give the goodbyes a moment to leave before the connections close
    window.setTimeout(() => link?.close(), 300);
    if (reason) openMenu("title", "coop");
  }

  get playing(): boolean {
    return this.run !== null;
  }
}
