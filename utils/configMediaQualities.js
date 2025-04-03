// config.js

const imageconfig = {
  width: 640,
  height: 360,
  format: 'jpeg',
  quality: 80,
};

const videoConfig = {
  transcode: {
    baseQualities: [
      { h: 480, vbr: 1400, abr: 128 }, // 480p
      { h: 720, vbr: 2800, abr: 160 }, // 720p
      { h: 1080, vbr: 5000, abr: 192 }, // 1080p
      { h: 1440, vbr: 8000, abr: 256 }, // 2K (1440p)
      { h: 2160, vbr: 12000, abr: 320 }, // 4K (2160p)
    ],
    crf: {
      high: 18,
      standard: 24,
    },
    profile: {
      high: 'high',
      standard: 'main',
    },
  },
};

module.exports = { videoConfig, imageconfig };
