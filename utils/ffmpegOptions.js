// utils/ffmpegOptions.js
const { videoConfig } = require('./configMediaQualities');

/**
 * Genera las opciones de FFmpeg para la parte de video.
 */
const generateVideoOptions = (q, index, maxQuality, primaryVideoIndex) => {
  let opts = [];
  opts.push('-c:v', 'h264');
  opts.push(
    '-profile:v',
    index === maxQuality - 1
      ? videoConfig.transcode.profile.high
      : videoConfig.transcode.profile.standard
  );
  opts.push('-map', `0:v:${primaryVideoIndex}`);
  opts.push('-vf', `scale=${q.w}:${q.h}`);
  opts.push('-pix_fmt', 'yuv420p');
  opts.push(
    '-crf',
    index === maxQuality - 1
      ? videoConfig.transcode.crf.high
      : videoConfig.transcode.crf.standard
  );
  opts.push('-maxrate', `${q.vbr}k`);
  opts.push('-bufsize', `${q.vbr}k`);
  return opts;
};

/**
 * Genera las opciones de FFmpeg para la parte de audio.
 */
const generateAudioOptions = (audioStreams, q) => {
  let opts = [];
  if (audioStreams.length > 0) {
    opts.push('-map', '0:a');
    opts.push('-c:a', 'aac', '-ac', '2', '-b:a', `${q.abr}k`);
  }
  return opts;
};

/**
 * Genera las opciones de FFmpeg para la parte de subtítulos.
 */
const generateSubtitleOptions = (subtitleStreams) => {
  let opts = [];
  if (subtitleStreams.length > 0) {
    opts.push('-map', '0:s');
    opts.push('-c:s', 'mov_text');
  } else {
    opts.push('-sn');
  }
  return opts;
};

/**
 * Combina las opciones de video, audio y subtítulos.
 */
const generateOutputOptions = (
  q,
  index,
  maxQuality,
  primaryVideoIndex,
  audioStreams,
  subtitleStreams
) => {
  const videoOpts = generateVideoOptions(
    q,
    index,
    maxQuality,
    primaryVideoIndex
  );
  const audioOpts = generateAudioOptions(audioStreams, q);
  const subtitleOpts = generateSubtitleOptions(subtitleStreams);
  return [...videoOpts, ...audioOpts, ...subtitleOpts];
};

module.exports = {
  generateOutputOptions,
};
