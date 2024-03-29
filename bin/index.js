#!/usr/bin/env node
// const chalk = require("chalk");
// const glob = require("glob");
// const { getVideoDurationInSeconds } = require("get-video-duration");

import chalk from "chalk";
import glob from "glob";
import { getVideoDuration } from "./getVideoDuration.js";
import path from 'path'

function toAbsolutePath(files) {
  return files.map((file) => {
    console.log(file);

    return path.resolve(process.cwd(), file);
  });
}

async function calculateVideoTime(files) {
  let totalTime = 0;
  for (const file of files) {
    try {
      const duration = await getVideoDuration(file);
      totalTime += duration;

      console.log(
        chalk
          .hex("#DEADED")
          .bold(`${file}:\r\n`, formatDate(secondToHour(duration)))
      );
    } catch (e) {
      console.log(e);
      console.log(chalk.red(`这个 file: ${file} 不支持计算时长`));
    }
  }

  return totalTime;
}

function secondToHour(second) {
  let s = 0;
  let m = parseInt(second / 60);
  s = Math.ceil(second % 60);

  let h = parseInt(m / 60);
  m = Math.ceil(m % 60);

  return {
    s,
    m,
    h,
  };
}

function formatDate(date) {
  const { s, m, h } = date;
  const sStr = s < 10 ? "0" + s : s;
  const mStr = m < 10 ? "0" + m : m;
  const hStr = h < 10 ? "0" + h : h;

  return `${hStr}:${mStr}:${sStr}`;
}

(async function main() {
  const pattern = process.argv.slice(2)[0];
  const files = toAbsolutePath(glob.sync(pattern));
  const totalTime = await calculateVideoTime(files);

  console.log(
    chalk
      .hex("#ffff00")
      .bold("总时长：\r\n", formatDate(secondToHour(totalTime)))
  );
})();
