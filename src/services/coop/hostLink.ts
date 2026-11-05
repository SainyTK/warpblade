import Peer, { type DataConnection, type MediaConnection } from "peerjs";
import { ROOM_PREFIX } from "../../constants/coop";
import type { GuestMessage, HostMessage } from "../../types/coop";
import { peerErrorText } from "./peerErrors";

export interface HostEvents {
  join(peer: string): void;
  message(peer: string, msg: GuestMessage): void;
  leave(peer: string): void;
  /** the room can no longer be reached */
  lost(reason: string): void;
}

/** the host's side of a room: a PeerJS peer under the room's id that guests connect to */
export interface HostLink {
  send(peer: string, msg: HostMessage): void;
  /** stream the game picture and sound to a guest */
  stream(peer: string, media: MediaStream): MediaConnection | null;
  drop(peer: string): void;
  close(): void;
}

/** a room code someone else holds; the caller tries another */
export class RoomTaken extends Error {}

/** open a room under this code; rejects with RoomTaken or an Error whose message a player can read */
export function openRoom(code: string, events: HostEvents): Promise<HostLink> {
  return new Promise((resolve, reject) => {
    const peer = new Peer(ROOM_PREFIX + code);
    const guests = new Map<string, DataConnection>();
    const calls = new Map<string, MediaConnection>();
    let open = false;
    let closed = false;

    const forget = (id: string): void => {
      calls.get(id)?.close();
      calls.delete(id);
      if (!guests.delete(id)) return;
      if (!closed) events.leave(id);
    };

    const link: HostLink = {
      send(id, msg) {
        const conn = guests.get(id);
        if (conn?.open) conn.send(msg);
      },
      stream(id, media) {
        calls.get(id)?.close();
        const call = peer.call(id, media);
        if (!call) return null;
        calls.set(id, call);
        return call;
      },
      drop(id) {
        guests.get(id)?.close();
        forget(id);
      },
      close() {
        closed = true;
        for (const conn of guests.values()) conn.close();
        peer.destroy();
      },
    };

    peer.on("open", () => {
      open = true;
      resolve(link);
    });
    peer.on("connection", (conn) => {
      conn.on("open", () => {
        guests.set(conn.peer, conn);
        events.join(conn.peer);
      });
      conn.on("data", (data) => events.message(conn.peer, data as GuestMessage));
      conn.on("close", () => forget(conn.peer));
      conn.on("error", () => forget(conn.peer));
    });
    peer.on("error", (err) => {
      if (closed) return;
      if (!open) {
        peer.destroy();
        reject(err.type === "unavailable-id" ? new RoomTaken() : new Error(peerErrorText(err.type)));
        return;
      }
      // a guest that vanished mid-handshake is not the room's fault
      if (err.type === "peer-unavailable" || err.type === "webrtc") return;
      if (err.type === "network" || err.type === "server-error" || err.type === "socket-closed") return;
      events.lost(peerErrorText(err.type));
    });
    // losing the broker only stops new guests from joining; ask again so the code keeps working
    peer.on("disconnected", () => {
      if (!closed && !peer.destroyed) peer.reconnect();
    });
  });
}
