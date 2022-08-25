const fs = require('fs');
const path = require('path');

module.exports = {
    add : (req,res) => {

    },
    store : (req,res) => {

    },
    list :(req,res) => {
        return res.render('admin/videos')
    },
    show : (req,res) => {
        const range = req.headers.range;
        if (!range) {
          return res.status(400).send("Requires Range header");
        }
      
        // get video stats (about 61MB)
        const videoPath = path.resolve(__dirname, "..","assets","videos",req.query.video + '.mp4');
        const videoSize = fs.statSync(videoPath).size;
      
        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      
        // Create headers
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };
      
        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);
      
        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });
      
        // Stream the video chunk to the client
        videoStream.pipe(res);
    },
    detail : (req,res) => {

    },
    edit : (req,res) => {

    },
    update : (req,res) => {

    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    }
}