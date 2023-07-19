require("dotenv").config();
const express=require('express');
const path=require('path');
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser');
const Blog=require("./models/blog");



const app=express();
const userRoute=require('./routes/user_route');
const blogRoute=require('./routes/blog_route')
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const PORT=process.env.PORT||8001;

mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("Mongodb connected"));
app.set("view engine",'ejs');
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")));

app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    });
})
app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.listen(PORT,()=>{
    console.log(`server started at :${PORT}`);
})