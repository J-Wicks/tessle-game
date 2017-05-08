const express = require('express');
const app = express();
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const socket = require('socket.io')();
const bodyparser = require('body-parser')
const PORT = 3000;
let time;
let userfirst = "Tex",userlast = "McShooter";

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

app.use(express.static("views"))

app.get('/', function (req,res,next) {
	res.render('homepage')
})

app.get('/fire', function (req,res,next) {
	time = new Date();
	socket.emit('fire');
	res.send("received")
})

app.use(function (err,req,res,next) {
	console.log(err)
})

app.get('/information', function (req, res,next) {
	res.render('infoPage')
	
})

app.post('/information', function (req,res,next) {
	userfirst = req.body.userfirst;
	userlast = req.body.userlast;
	res.redirect('/')
})
app.post('/results', function(req, res,next){
	socket.emit('result', {
		time: (new Date() - time) / 1000,
		userfirst:userfirst,
		userlast:userlast
	});
	res.send("post received");
})


const server = app.listen(PORT, function (req,res) {
	console.log(`On ${PORT}`)
})
socket.listen(server)

