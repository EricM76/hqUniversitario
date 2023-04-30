const fs = require('fs');
const path = require('path');
const db = require('../database/models');

/* AWS S3 */
const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const {bucketName, bucketRegion, publicKey, secretKey} =require('../config/configAWS');

const client = new S3Client({
  region : bucketRegion,
  credentials : {
    accessKeyId : publicKey,
    secretAccessKey : secretKey
  }
});

async function uploadFile(file) {
  const stream = file && fs.createReadStream(file.path);
  const uploadParams = {
    Bucket : bucketName,
    Key : file.filename,
    Body : stream,
  }
  const command = new PutObjectCommand(uploadParams);
  const result = await client.send(command);
  
  console.log(result)
}

async function donwloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket : bucketName,
    Key : filename
  });
  const result = await client.send(command);
  //console.log(result)
  result.Body.pipe(fs.createWriteStream(`./src/assets/videos/${filename}`))
}

async function getFileURL(filename){
  const command = new GetObjectCommand({
    Bucket : bucketName,
    Key : filename
  });
  return await getSignedUrl(client, command, {
    expiresIn : 3600
  })
}

module.exports = {
    add :  (req,res) => {
        let categories =  db.Category.findAll();
        let units =  db.Unit.findAll();
        let countVideos =  db.Video.count({where:{courseId:req.params.idCourse}});
        let course =  db.Course.findByPk(req.params.idCourse, {
          include : [
              {
                  association : 'university',
                  attributes : ['id','name','acronym']
              },
              {
                  association : 'faculty',
                  attributes : ['id','name','acronym'],
                  include :
                  {
                      association : 'categories',
                      attributes : ['id','name'],
                      order : ['id'],
                      /* include : ['videos'] */
                  }
              },
              {
                  association : 'careers',
                  attributes : ['id','name']
              },
              {
                  association : 'features',
                  attributes : ['id','content']
              },
              {
                  association : 'notes',
                  attributes : ['id','title','file']
              },
              {
                  association : 'units',
                  attributes : ['id','number','name'],
              },
              {
                association : 'turns',
                attributes : ['id','month'],
            },
            /*   {
                  association : 'videos',
                  attributes : ['id','title'],
              }, */
          ]
        })

      Promise.all([categories, units, countVideos,course])
        .then(([categories, units, countVideos, course]) => {
          return res.render('admin/videoAdd',{
            categories,
            units,
            course,
            countVideos
          })
        }) 
   
    },
    store : async (req,res) => {
      const {length, title, description, locked, categoryId, year, turnId, unitId, order }= req.body;

      try {

        await db.Video.create({
          resource : req.file && req.file.filename,
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
        });

        req.file && await uploadFile(req.file);
        fs.existsSync(`./src/assets/videos/${req.file.filename}`) && fs.unlinkSync(`./src/assets/videos/${req.file.filename}`)

        return res.redirect(`/courses/edit/videos/${req.query.course}`)

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
    show : async (req,res) => {
        const range = req.headers.range;
        if (!range) {
          return res.status(400).send("Requires Range header");
        }

        try {
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
        } catch (error) {
          console.log(error)
        }
      
       
    },
    detail : (req,res) => {

    },
    edit : async (req,res) => {
      const {videoId,courseId} = req.params;
      try {
        let categories = await db.Category.findAll({
          attributes : ['id','name']
        })
        let video = await db.Video.findByPk(videoId);
        let course = await db.Course.findByPk(courseId,{
          include : [{
            association : 'faculty',
            include : ['categories']
          }]
        })
        return res.render('admin/videoEdit',{
          video,
          id : courseId,
          course,
          categories
        })
      } catch (error) {
        console.log(error)
      }
    },
    update : async (req,res) => {
      const {length, title, description, locked, categoryId, year, turnId, unitId, order }= req.body;

      try {
        let video = await db.Video.findOne({
          where : {id : req.params.id}
        });

        req.file && await uploadFile(req.file);
        if(req.file){
          fs.existsSync(`./src/assets/videos/${req.file.filename}`) && fs.unlinkSync(`./src/assets/videos/${req.file.filename}`)
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

        return res.redirect(`/courses/edit/videos/${req.query.course}`)

      } catch (error) {
        console.log(error)
      }
    },
    remove : async (req,res) => {
      try {
        //let video = await db.Video.findByPk(req.params.id);
        await db.Video.destroy({
          where : {
            id : req.params.id
          }
        });
        /* await client.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: video.resource })
        ); */
        return res.redirect(`/courses/edit/videos/${req.query.course}`)
      } catch (error) {
        console.log(error)
      }
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
    },
    getVideoUrl : async (req,res) => {
      try {
        let {resource} = await db.Video.findByPk(req.params.id);
        console.log('====================================');
        console.log(process.env.CLOUDFONT_URL + resource);
        console.log('====================================');
        return res.status(200).json({
          ok : true,
          url : process.env.CLOUDFONT_URL + resource
      })
      } catch (error) {
        console.log(error);
        return res.status(error.status).json({
          ok: false,
          msg : 'ups... error'
      })
      }
    },
    transfer : async (req,res) => {
      
      try {
        if(!fs.existsSync(path.resolve(__dirname, '..','assets','videos',req.query.resource))){
          await donwloadFile(req.query.resource);
          return res.status(200).json({
            ok : true,
            msg: 'video transferido!'
          })        
        }else {
          return res.status(200).json({
            ok : true,
            msg: 'video en stock!'
          })    
        }
      
      } catch (error) {
        console.log(error)
        return res.status(error.status).json({
          ok: false,
          msg: 'ups... error'
        })
      }
      
    },
    seenByUser : async (req,res) => {
      try {
        await db.UserVideos.findOrCreate({
          where : {
            userId : req.params.userId,
            videoId : req.params.videoId
          },
          defaults : {
            userId : req.params.userId,
            videoId : req.params.videoId
          }
        });
        return res.status(200).json({
          ok : true,
          msg: 'seen by User'
        })    
      } catch (error) {
        console.log(error)
        return res.status(error.status).json({
          ok: false,
          msg: 'ups... error'
        })
      }
    },
    notSeenByUser : async (req,res) => {
      console.log('>>>>>>>>>>>',req.params)
      try {
        await db.UserVideos.destroy({
          where : {
            userId : req.params.userId,
            videoId : req.params.videoId
          }
        });
        return res.status(200).json({
          ok : true,
          msg: 'deleted seen by User'
        })    
      } catch (error) {
        console.log(error)
        return res.status(error.status).json({
          ok: false,
          msg: 'ups... error'
        })
      }
    },
    getViewedByUser : async (req,res) => {
      try {
        if(!req.session.user ){
          throw new Error('No hay usuario logueado')
        }
        let user = await db.User.findByPk(req.session.user.id,{
          attributes : ['id'],
          include : [
              {
                  association : 'videos',
                  attributes : ['id','courseId']
              }
          ]
        });
        let {videos} = await db.Course.findByPk(req.params.courseId,{
          include : [
            {
              association : 'videos',
              attributes : ['id'],
              include : ['course']
            }
          ]
        })
        let videosViewedFilter = user.videos.filter(video => video.courseId == req.params.courseId);

        let videosViewed = videosViewedFilter.map(video => video.id)

        return res.status(200).json({
          ok : true,
          data: {
            total : videos.length,
            videosViewed,
          }
        })    

      } catch (error) {
        console.log(error)
        return res.status(error.status || 500).json({
          ok: false,
          msg: 'ups... error'
        })
      }
    },
    info : async (req,res) => {
      const {videoId, courseId} = req.query;
      try {
        if(!videoId || !courseId){
          throw new Error('upss, faltan parámetros')
        }
        let course = await db.Course.findByPk(courseId,{
          attributes : ['id'],
          include :[
            {
            association : 'turns',
            attributes : ['id','month'],
        },
        {
          association : 'units',
          attributes : ['id','name','number']
        },
      ],
        })
        let video =   await db.Video.findByPk(videoId);
        return res.status(200).json({
          ok: true,
          video,
          course,
          urlCloudfont : process.env.CLOUDFONT_URL,
        })
      } catch (error) {
        console.log(error)
        return res.status(error.status || 500).json({
          ok : false,
          msg : error.message || "Comuníquese con el administrdor"
        })
      }
      
    }
}