const{Router}=require('express');
const multer=require('multer');
const path=require('path');
const Blog=require("../models/blog");
const Comment=require("../models/comments");

const route=Router();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const fileName=`${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    },
  })
const upload = multer({ storage: storage,limits: { fieldSize: 10 * 1024 * 1024 } })
route.get('/add-new',(req,res)=>{
   res.render('addblog',{
    user:req.user,
   })
})
route.get('/:id',async(req,res)=>{
    const blog= await Blog.findById(req.params.id).populate('createdBy');
    const comments=await Comment.find({blogId:req.params.id}).populate('createdBy');
    res.render("blog",{
        user:req.user,
        blog,
        comments,
       
    })
})
route.post('/comment/:blogId',async(req,res)=>{
     await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })
    return res.redirect(`/blog/${req.params.id}`);
});

route.post('/upload',upload.single("coverImg"),async (req,res)=>{
    const{ title,body}=req.body;
  const blog= await Blog.create({
    body,
    title,
    createdBy:req.user._id,
    coverPhtUrl:`/uploads/${req.file.filename}`,
  });
   return res.redirect(`/blog/${blog._id}`);
});

module.exports=route;
