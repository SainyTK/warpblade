import Peer, { type DataConnection } from "peerjs";
import { JOIN_TIMEOUT_MS, ROOM_PREFIX } from "../../constants/coop";
import type { GuestMessage, HostMessage } from "../../types/coop";
import { peerErrorText } from "./peerErrors";

export interface GuestEvents {
  message(msg: HostMessage): void;
  /** the host's game picture and sound */
  stream(media: MediaStream): void;
  /** the link to the host is gone */
  lost(reason: string): void;
}

/** a guest's side of a room: one data connection to the host, and the stream the host calls with */
export interface GuestLink {
  send(msg: GuestMessage): void;
  close(): void;
}

/** connect to the room with this code; rejects with an Error whose message a player can read */
export function joinRoom(code: string, events: GuestEvents): Promise<GuestLink> {
  return new Promise((resolve, reject) => {
    const peer = new Peer();
    let conn: DataConnection | null = null;
    let joined = false;
    let closed = false;

    const fail = (reason: string): void => {
      if (closed) return;
      closed = true;
      peer.destroy();
      if (joined) events.lost(reason);
      else reject(new Error(reason));
    };
    const timer = setTimeout(() => fail("The room did not answer. Check the code and try again."), JOIN_TIMEOUT_MS);

    const link: GuestLink = {
      send(msg) {
        if (conn?.open) conn.send(msg);
      },
      close() {
        closed = true;
        clearTimeout(timer);
        peer.destroy();
      },
    };

    peer.on("open", () => {
      const c = peer.connect(ROOM_PREFIX + code, { reliable: true, serialization: "json" });
      conn = c;
      c.on("open", () => {
        joined = true;
        clearTimeout(timer);
        resolve(link);
      });
      c.on("data", (data) => events.message(data as HostMessage));
      c.on("close", () => fail("The host left, so the room has closed."));
      c.on("error", () => fail("The connection to the host was lost."));
    });
    peer.on("call", (call) => {
      call.on("stream", (media) => events.stream(media));
      call.answer();
    });
    peer.on("error", (err) => {
      if (joined && err.type !== "webrtc" && err.type !== "peer-unavailable") return;
      fail(peerErrorText(err.type));
    });
  });
}
