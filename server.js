const blog=require('./models/blog.model')
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const hbs = require('hbs')
const path = require('path')
const cors=require('cors')
const PORT = process.env.PORT || 8000;
// const userModel = require('./model/user.model')
app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    })
  );

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb+srv://root:root@cluster0.qfxl9hl.mongodb.net/BlogApp?retryWrites=true&w=majority').then(() => {
    console.log("Databases connected");
})

app.set('views', path.join(__dirname, '/templates/views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/templates/partials'))
hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});
app.get('/',async (req, res) => {
    const data=await blog.find();
    res.render('index',{"data":data})
    
});

app.get('/blog',(req,res)=>{
    res.render('blog')

})

app.get('/update/:id',async (req,res)=>{
    const id = mongoose.Types.ObjectId(req.params['id']);
    const data=await blog.findById(id)
    res.render('update',{"data":data})
})

app.post('/update/:id',async (req,res)=>{

    const id = mongoose.Types.ObjectId(req.params['id']);
    await blog.updateOne({_id:id},{
        $set:{
            title:req.body.uptitle,
            posted_by:req.body.upposted_by,
            discription:req.body.updiscription,
            picture:req.body.uppicture
        }
    })
    res.redirect('/')
})

app.get('/delete/:id',async (req,res)=>{
    const id = mongoose.Types.ObjectId(req.params['id']);
  await blog.deleteOne({_id:id})
  res.redirect('/')
 
})

app.post('/blog', (req, res) => {
   blog(req.body).save();
   res.render('blog')
    
})

//app.use('/api', require('./routes/index'));
app.listen(PORT, () => {
    console.log("server listening in port " + PORT);
})
