/** video codecs a browser may pick for the game stream; their repair streams (rtx, red, ulpfec) are left alone */
const VIDEO_CODECS = new Set(["vp8", "vp9", "h264", "av1"]);

/**
 * Ask Chrome to open the video at this many kbit/s, so a guest's first seconds are sharp; WebRTC otherwise starts
 * near 300 kbit/s and ramps up. Other browsers ignore the parameter.
 */
export function withStartBitrate(sdp: string, kbps: number): string {
  const lines = sdp.split("\r\n");
  const payloads = new Set<string>();
  for (const line of lines) {
    const rtpmap = /^a=rtpmap:(\d+) ([^/]+)\//.exec(line);
    if (rtpmap && VIDEO_CODECS.has(rtpmap[2].toLowerCase())) payloads.add(rtpmap[1]);
  }
  const param = `x-google-start-bitrate=${kbps}`;
  const withFmtp = new Set<string>();
  const out = lines.map((line) => {
    const fmtp = /^a=fmtp:(\d+) /.exec(line);
    if (!fmtp || !payloads.has(fmtp[1]) || line.includes("x-google-start-bitrate")) return line;
    withFmtp.add(fmtp[1]);
    return `${line};${param}`;
  });
  return out
    .flatMap((line) => {
      const rtpmap = /^a=rtpmap:(\d+) /.exec(line);
      if (!rtpmap || !payloads.has(rtpmap[1]) || withFmtp.has(rtpmap[1])) return [line];
      return [line, `a=fmtp:${rtpmap[1]} ${param}`];
    })
    .join("\r\n");
}
