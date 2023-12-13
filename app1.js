const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: '13', 
    resave: false,
    saveUninitialized: true,
  }));
  
  const userName = process.env.USER_NAME;
  const pass = process.env.PASSWORD;
  // Authentication middleware
  const authenticate = (req, res, next) => {
    const { username, password } = req.session;
    const isAuthenticated = username === userName && password === pass;
    if (isAuthenticated) {
      next();
    } else {
      res.status(401).send('Unauthorized. Please log in.');
      //alert('You entered wrong password, it is notified to the developer');
      //process.exit(2);
    }
  };

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/home.html');
})

app.post('/login', (req, res) => {
    res.render('login');
});

app.get('/landing',authenticate, (req, res) => {
    res.sendFile(__dirname + '/public/landing.html');
});

app.post('/landing',(req, res) => {
    const { username, password } = req.body;
  
    if (username === userName && password === pass) {
      req.session.username = username;
      req.session.password = password;
      res.redirect('/landing');
    } else {
      let a5 = fs.readFileSync("/public/invalid.html");
      res.status(401).send(a5.toString())
    }
  });

app.get('/contact',(req,res)=>{
  res.sendFile(__dirname+'/public/contact.html')
})

app.listen(port,()=>{
    console.log(`server runnig at ${port}`)
})