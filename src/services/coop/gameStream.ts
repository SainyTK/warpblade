import { STREAM } from "../../constants/coop";

/** the host's game as a video and sound stream for guests */
export interface GameStream {
  media: MediaStream;
  /** copy the newest frame of the game canvas into the stream */
  mirror(source: HTMLCanvasElement): void;
  stop(): void;
}

/** a stream of the game drawn at twice the art size with no smoothing, plus the game's sound when there is any */
export function captureGame(sound: MediaStream | null): GameStream {
  const canvas = document.createElement("canvas");
  canvas.width = STREAM.width;
  canvas.height = STREAM.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot stream the game.");
  ctx.imageSmoothingEnabled = false;
  const media = canvas.captureStream(STREAM.fps);
  for (const track of media.getVideoTracks()) track.contentHint = "detail";
  for (const track of sound?.getAudioTracks() ?? []) media.addTrack(track);
  return {
    media,
    mirror(source) {
      ctx.drawImage(source, 0, 0, STREAM.width, STREAM.height);
    },
    stop() {
      for (const track of media.getVideoTracks()) track.stop();
    },
  };
}

/** let the video use more bits than WebRTC's default and keep its size, dropping frames first when the link is slow */
export function tuneVideoSender(pc: RTCPeerConnection): void {
  const apply = (): void => {
    for (const sender of pc.getSenders()) {
      if (sender.track?.kind !== "video") continue;
      const params = sender.getParameters();
      if (!params.encodings?.length) continue;
      params.encodings[0].maxBitrate = STREAM.maxBitrate;
      params.encodings[0].maxFramerate = STREAM.fps;
      const plain = { ...params };
      params.degradationPreference = "maintain-resolution";
      // some browsers refuse the preference; the bitrate alone still helps
      sender.setParameters(params).catch(() => sender.setParameters(plain).catch(() => undefined));
    }
  };
  pc.addEventListener("connectionstatechange", () => {
    if (pc.connectionState === "connected") apply();
  });
  apply();
}
