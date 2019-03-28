//initalize an express app and set it up 
const express = require('express');
const app = express();
const io = require('socket.io')();

const port = process.env.PORT || 3000;

//tell our app ti ujse the public folder tfor static files
app.use(express.static('public'));

//instantate the only route we need
app.get('/', (req,res,next)=> {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
});

//next up socket.io to set up chat app

io.attach(server); //io.attach not a function

io.on('connection', function(socket){
    console.log('a user has connected', socket);
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'} );

    //listen for incoming messages, and then send them
    socket.on('chat message', function(msg){
        //check the message contents
        console.log('message: ', msg, 'socket id: ', socket.id);

        //send the message to 
        io.emit('chat message', {id: `${socket.id}`, message: msg});
    })

    socket.on('disconnect', function(){
        console.log('a user has disconnected');
    });
});