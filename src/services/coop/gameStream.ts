import { STREAM } from "../../constants/coop";
import { FH, FW } from "../../constants/stage";

export interface GameStream {
  media: MediaStream;
  paint(draw: (out: Uint8ClampedArray) => void): void;
  stop(): void;
}

export function captureGame(sound: MediaStream | null): GameStream {
  const canvas = document.createElement("canvas");
  canvas.width = FW;
  canvas.height = FH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot stream the game.");
  const image = ctx.createImageData(FW, FH);
  const media = canvas.captureStream(STREAM.fps);
  for (const track of media.getVideoTracks()) track.contentHint = "detail";
  for (const track of sound?.getAudioTracks() ?? []) media.addTrack(track);
  return {
    media,
    paint(draw) {
      draw(image.data);
      ctx.putImageData(image, 0, 0);
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
