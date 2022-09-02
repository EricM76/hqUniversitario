const fs = require('fs');
const path = require('path');
const db = require('../database/models');

module.exports = {
    add : async (req,res) => {
      try {
        let categories = await db.Category.findAll();
        let units = await db.Unit.findAll();
        let years = await db.Year.findAll();
        let turns = await db.Turn.findAll();
        let courses = await db.Course.findAll();
        return res.render('admin/videoAdd',{
          categories,
          units,
          years,
          turns,
          courses
        })
      } catch (error) {
        console.log(error)
      }
    },
    store : async (req,res) => {
      const {length, title, description, locked, categoryId, year, turnId, unitId, order }= req.body;

      try {
        await db.Video.create({
          resource : req.file.filename,
          title : title.trim(),
          description : description.trim(),
          locked : locked ? 1 : 0,
          year : year ? year : null,
          turnId : turnId ? turnId : null,
          categoryId : categoryId ? categoryId : null,
          unitId : unitId ? unitId : null,
          courseId : req.query.course,
          order,
          length
        })
        return res.redirect('/courses/edit/' + req.query.course)

      } catch (error) {
        console.log(error)
      }
    },
    list : async (req,res) => {
        try {
          let videos = await db.Video.findAll({
            include : [
              {
                association : 'category',
                attributes : ['id','name']
              },
              {
                association : 'unit',
                attributes : ['id','name']
              },
              {
                association : 'turn',
                attributes : ['id','month']
              },
            ]
          })
          return res.render('admin/videos',{
            videos
          })

        } catch (error) {
          console.log(error)
        }
    },
    show : (req,res) => {
        const range = req.headers.range;
        if (!range) {
          return res.status(400).send("Requires Range header");
        }
      
        // get video stats (about 61MB)
        const videoPath = path.resolve(__dirname, "..","assets","videos",req.query.video);
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
    update : async (req,res) => {
      const {length, title, description, locked, categoryId, year, turnId, unitId, order }= req.body;

      try {
        let video = await db.Video.findOne({
          where : {id : req.params.id}
        });

        if(req.file){
          if(fs.existsSync(path.resolve(__dirname, '..','assets','videos',video.resource))){
            fs.unlinkSync(path.resolve(__dirname, '..','assets','videos',video.resource))
          }
        }

        await db.Video.update(
          {
            length,
            title : title.trim(),
            description : description.trim(),
            locked : locked ? 1 : 0,
            year : year ? year : null,
            turnId : turnId ? turnId : null,
            categoryId : categoryId ? categoryId : null,
            unitId : unitId ? unitId : null,
            order,
            resource : req.file ? req.file.filename : video.resource
          },
          {
            where : {
              id : req.params.id
            }
          }
        )

        return res.redirect(`/courses/edit/${req.query.course}?next=videos`)

      } catch (error) {
        console.log(error)
      }
    },
    remove : (req,res) => {

    },
    search : (req,res) => {

    },
    filter : (req,res) => {
        
    },
    /* apis */
    changeLocked : async (req,res) => {
     
      try {
        await db.Video.update(
          {
            locked : req.body.locked == 'true' ? 1 : 0
          },
          {
            where : {
                id : req.query.id
            }
          }
        )
        return res.status(200).json({
            ok : true,
            msg : 'cambio exitoso'
        })
    } catch (error) {
        console.log(error);
        return res.status(error.status).json({
            ok: false,
            msg : 'ups... error'
        })
    }
    }
}