const express = require('express')
const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/blogDB');

const postSchema= new mongoose.Schema({
    title:{ type: String, required:[ true, 'Title is Required']},
    imageurl:{ type: String, required:[ true, 'image url is Required']},
overview: {type:String, minlength:[ 200, 'Minimum 200 characters required']},
postDate: {type:Date, default: Date.now },
    });

const Post=mongoose.model('Post', postSchema)

app.get('/', (req, res) => {
    Post.find((err,data)=>{
        if(err)
        console.log(err)
        else
        res.render("home", {posts:data});
    })
    
})

app.get('/viewpost/:postid', (req, res) => {
    let pid=req.params.postid;
    Post.findById(pid,(err,data)=>{
        if(err)
        console.log(err)
        else
        res.render("viewpost", {post:data});
    })
});

app.get('/editpost/:postid', (req, res) => {
    let pid=req.params.postid;
    Post.findById(pid,(err,data)=>{
        if(err)
        console.log(err)
        else
        res.render("editpost", {post:data, result:''});
    })
});

app.post('/delpost', (req, res) => {
    let pid=req.body.pid;
    Post.findByIdAndDelete(pid,(err)=>{
        if(!err)
         res.render("newpost",{result:''});

    })
   }) 

app.get('/about', (req, res) => {
    res.render("about");
   })   

   app.get('/newpost', (req, res) => {
    res.render("newpost",{result:''});
   }) 

app.post('/new', (req,res) => {
   console.log(req.body);
   const formdata= new Post({title:req.body.title,imageurl:req.body.image,content:req.body.content })
   formdata.save((err)=>{
       if(!err)
       res.render("newpost",{result:'Record Saved'});
       else 
       console.log('Error in code')
   });

})

app.post('/edit', (req,res) => {

    let pid=req.body.pid;
    const formdata= {title:req.body.title,imageurl:req.body.image,content:req.body.content };
    
    Post.findByIdAndUpdate(pid,formdata,(err)=>{
        if(!err)
        Post.findById(pid,(err,data)=>{
            if(!err)
            res.render("editpost", {post:data, result:'Record Updated'});
        })
        else
        console.log('error in code'+err)
    });
});

app.listen(port, () => {
  console.log(`Blog site listening at http://localhost:${port}`)
})
