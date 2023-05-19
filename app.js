const mongoose = require('mongoose');
const express = require('express');
const morgan = require("morgan");
const app = express();
const Blog = require('./models/blog');
const { urlencoded } = require("express");
require('dotenv').config()

//MongoDB
const dbURI = process.env.MONG_URI
mongoose.connect(dbURI)
    .then((result)=>{
        const server = app.listen(process.env.PORT, ()=>{
            console.log("Connected!")
        });
    })
    .catch((err)=>{console.log(err)});

//Express
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(urlencoded({extended: true}));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.redirect('/blogs')
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { heading: 'Home', blogs: result});
        })
        .catch((err) => {console.log(err)});
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {console.log(err)});
})

app.delete('/blogs', (req, res) => {
    Blog.findByIdAndDelete(id)
})

app.get('/about', (req, res) => {
    res.render('about' , { heading: 'About'});
});

app.get('/blogs/create', (req, res) => {
    res.render('create' , { heading: 'Create Blog'});
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then((result) => {
            res.render('details', {heading: 'Blog Details', blog: result})
        })
        .catch((err)=>{console.log(err)});
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' })
        })
        .catch((err)=>{console.log(err)});
})

app.use((req, res)=>{
    res.status(404).render('404' , { heading: 'Page Not Found'});
});