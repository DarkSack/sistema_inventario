const ytdl = require("ytdl-core");

async function handler(req, res) {
  //   const { videoUrl } = req.query;
  try {
    const info = await ytdl.getInfo(
      "https://www.youtube.com/watch?v=EpWunIBoxRc"
    );
    res.json(info?.videoDetails.thumbnails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export default handler;
