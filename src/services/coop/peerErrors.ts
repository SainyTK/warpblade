/** what a player reads when the PeerJS broker or a WebRTC link fails, by PeerJS error type */
export function peerErrorText(type: string): string {
  switch (type) {
    case "peer-unavailable":
      return "No room has that code. Check it with the host.";
    case "browser-incompatible":
      return "This browser cannot play online.";
    case "network":
    case "server-error":
    case "socket-error":
    case "socket-closed":
      return "Could not reach the room server. Check your connection and try again.";
    case "webrtc":
      return "The connection to the room failed. Try again, or try another network.";
    default:
      return "Something went wrong with the room. Try again.";
  }
}
