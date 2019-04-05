// initialize an express app and set it up 
const express = require('express');
const app = express();
const io = require('socket.io')();

// some config stuff
const port = process.env.PORT || 3000;

// tell our app to use the public folder for static files
app.use(express.static('public'));

// instantiate the route
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/loggedout', (req, res, next) => {
    res.sendFile(__dirname + '/views/loggedout.html');
});

// create server variable for socket.io to use
const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

var users = [];

// plug in the chat app package
io.attach(server);

io.on('connection', function(socket) {
    console.log('a user has connected', socket.server.sockets.adapter.sids);
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'} );

    //listen for incomming connection, send them to everyone
    socket.on('userConnect', function(name){
        users.push(name);
        console.log(users);
        io.emit('userConnect', {message: name, userList: users});
    });

    // listen for incoming messages, and then send them to everyone
    socket.on('chat message', function(msg) {
        // check the message contents
        console.log('message', msg, 'socket', socket.id);

        // send a message to every connected client
        io.emit('chat message', { id: `${socket.id}`, message: msg });
    });

    //listen for user dis connect
    socket.on('force disconnect', function(name){
        let index = users.map(function(e) { return e.name; }).indexOf(name.name);
        console.log('index: ' + index, name.name );
        if (index > -1) {
            users.splice(index, 1);
         }
        io.emit('userDisconnect', {message: name, userList: users});
    });
});