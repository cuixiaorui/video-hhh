import { execa } from "execa";

export async function getVideoDuration(videoPath) {
  try {
    await execa("ffmpeg", ["-i", videoPath]);
  } catch (e) {
    const stdout = e.message;
    const matched = stdout.match(/Duration:\s(\d*):(\d*):(\d*)/);
    if (matched && matched[0]) {
      const hour = matched[1];
      const minutes = matched[2];
      const second = matched[3];
      return toSecond(parseInt(hour), parseInt(minutes), parseInt(second));
    }
  }
}

function toSecond(hour, minute, second) {
  return hour * 60 * 60 + minute * 60 + second;
}

