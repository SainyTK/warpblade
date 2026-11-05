/** Co-op rooms: up to four players in one run, hosted in one player's browser. */
export const MAX_PLAYERS = 4;

/** a room's code is the host's PeerJS id after this prefix */
export const ROOM_PREFIX = "warpblade-room-";
/** codes leave out letters and digits that read alike: 0 and O, 1 and I */
export const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const ROOM_CODE_LENGTH = 5;
/** the address parameter an invite link carries */
export const ROOM_PARAM = "room";

/** each player's colour, by place in the room: the tag over the hero, the lobby row and the HUD chip */
export const SEAT_COLORS = ["#ffd75e", "#6fe3ff", "#ff7ad9", "#9dff6a"] as const;
/** the same colours, darkened for the outline of the tag over a hero */
export const SEAT_SHADES = ["#4a3410", "#0e3a4a", "#4a1240", "#1e4a10"] as const;

/** how often the host sends each guest what their HUD shows */
export const HUD_RATE = 15;
/** how long joining may take before the guest gives up */
export const JOIN_TIMEOUT_MS = 12000;
/** each side says it is still there this often, and counts the other gone after the quiet limit */
export const PING_MS = 1500;
export const QUIET_LIMIT_MS = 6000;
/** a guest with no HUD from the host for this long tells its player the host is away */
export const HOST_AWAY_MS = 1000;
/** what a guest's game canvas shows until the host's picture arrives: the interface's night colour */
export const WAITING_FILL = "#0c0a18";

/** the picture the host streams: twice the art size, so the video's half-size colour samples land on whole art pixels */
export const STREAM = { width: 640, height: 360, fps: 30, maxBitrate: 2_500_000 } as const;

/** more players meet more foes, and tougher ones: each player past the first adds these shares */
export const COOP_SCALING = {
  count: 0.4,
  hp: { minion: 0.25, mini: 0.5, boss: 0.6 },
} as const;

/** a downed hero rises with this share of HP when the wave is cleared */
export const RISE_HP = 0.5;
/** seconds a fallen hero lies before the room counts them down */
export const DOWN_DELAY = 2.4;
