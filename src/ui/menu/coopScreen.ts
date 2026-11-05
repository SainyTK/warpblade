import "./coopScreen.css";
import { CHARACTERS } from "../../constants/characters";
import { MAX_PLAYERS, SEAT_COLORS } from "../../constants/coop";
import { character, setCharacter } from "../../game/state";
import { copyText } from "../../services/clipboard";
import { saveHeroChoice } from "../../services/heroChoice";
import { roomView } from "../../store/coop";
import type { MenuView } from "../../types/menu";
import { readRoomCode } from "../../utils/roomCode";
import { backItem } from "./backItem";
import { hostRoom, inviteLink, joinRoom, leaveRoom, roomHeroChanged, startRoomRun } from "./coopActions";
import { menuItem } from "./menuItem";
import { onAdjust } from "./menuNav";
import { showScreen } from "./menuState";

const heroName = (id: string): string => CHARACTERS.find((c) => c.id === id)?.name ?? id;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

/** the code box and its Join button; Enter in the box joins too */
function joinRow(): HTMLElement {
  const row = el("div", "coop-join");
  const input = el("input", "coop-code");
  input.dataset.nav = "";
  input.placeholder = "Room code";
  input.maxLength = 5;
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("autocapitalize", "characters");
  input.setAttribute("aria-label", "Room code");
  const error = el("p", "coop-error");
  const join = (): void => {
    const code = readRoomCode(input.value);
    if (code) joinRoom(code);
    else {
      error.textContent = "A room code has 5 letters and digits.";
      input.focus();
    }
  };
  input.addEventListener("keydown", (ev) => {
    if (ev.code !== "Enter") return;
    ev.preventDefault();
    join();
  });
  const button = menuItem("Join", join);
  row.append(input, button);
  const box = el("div", "menu-list");
  box.append(row, error);
  return box;
}

/** host a room or join one with a code */
function doorScreen(): MenuView {
  const room = roomView();
  const content = el("div", "menu-main");
  if (room.error) content.append(el("p", "coop-error", room.error));
  const list = el("nav", "menu-list");
  list.setAttribute("aria-label", "Co-op");
  list.append(menuItem("Host a room", hostRoom));
  content.append(list, joinRow(), backItem());
  return { title: "Co-op", subtitle: `Up to ${MAX_PLAYERS} players in one run`, content };
}

function connectingScreen(): MenuView {
  const room = roomView();
  const content = el("div", "menu-main");
  const list = el("nav", "menu-list");
  list.append(menuItem("Cancel", leaveRoom));
  content.append(list);
  const doing = room.role === "host" ? "Opening a room" : `Joining room ${room.code}`;
  return { title: "Co-op", subtitle: `${doing}...`, content };
}

/** every place in the room: the players in it with their heroes, and the places still open */
function playerList(): HTMLElement {
  const room = roomView();
  const list = el("ul", "coop-players");
  list.setAttribute("aria-label", "Players");
  for (let slot = 0; slot < MAX_PLAYERS; slot++) {
    const seat = room.seats.find((s) => s.slot === slot);
    const row = el("li", seat ? "coop-player" : "coop-player empty");
    row.style.setProperty("--seat", SEAT_COLORS[slot]);
    const tags = [slot === 0 ? "host" : "", slot === room.you ? "you" : ""].filter(Boolean).join(", ");
    row.append(el("b", "", `P${slot + 1}`), seat ? heroName(seat.hero) : "Open", el("small", "", seat ? tags : ""));
    list.append(row);
  }
  return list;
}

/** this player's hero for the run: Left and Right or a press step through the heroes */
function heroRow(): HTMLButtonElement {
  const row = el("button", "menu-item option");
  row.type = "button";
  row.dataset.nav = "";
  const value = el("span", "option-value", `< ${character.name} >`);
  row.append(el("span", "option-name", "Hero"), value);
  const step = (by: number): void => {
    const i = CHARACTERS.indexOf(character);
    const next = CHARACTERS[(i + by + CHARACTERS.length) % CHARACTERS.length];
    setCharacter(next);
    saveHeroChoice(next.id);
    roomHeroChanged(next.id);
    showScreen("coop");
  };
  row.addEventListener("click", () => step(1));
  onAdjust(row, step);
  return row;
}

function inviteItem(code: string): HTMLButtonElement {
  const item = menuItem("Copy invite link", () => {
    void copyText(inviteLink(code)).then((ok) => {
      item.textContent = ok ? "Link copied" : `Code ${code}`;
    });
  });
  return item;
}

/** the room before a run: who is in, each hero, and Start for the host */
function lobbyScreen(): MenuView {
  const room = roomView();
  const host = room.role === "host";
  const content = el("div", "menu-main coop-lobby");
  const actions = el("nav", "menu-list");
  actions.setAttribute("aria-label", "Room");
  actions.append(heroRow());
  if (host) actions.append(menuItem("Start run", startRoomRun));
  actions.append(inviteItem(room.code), menuItem("Leave room", leaveRoom, "Leave? Press again"));
  const side = el("div", "menu-main");
  side.append(playerList());
  if (!host) side.append(el("p", "coop-wait", "The host starts the run."));
  if (room.note) side.append(el("p", "coop-wait", room.note));
  content.append(side, actions);
  const players = room.seats.length;
  return {
    title: `Room ${room.code}`,
    subtitle: `${players} of ${MAX_PLAYERS} players`,
    content,
    focus: host && players > 1 ? (actions.children[1] as HTMLElement) : undefined,
  };
}

/** Co-op from the start menu: the door to a room, then its lobby */
export function coopScreen(): MenuView {
  const phase = roomView().phase;
  if (phase === "connecting") return connectingScreen();
  if (phase === "lobby" || phase === "playing") return lobbyScreen();
  return doorScreen();
}
