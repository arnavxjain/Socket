const express = require("express");
const path = require("path");
const http = require('http');

const app = express();
const server = http.Server(app);

const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static('public'));

let wordpairs = ['room1', 'room2', 'room3', 'room4', 'room5'];
let participants = []; 

app.get("/", (req, res) => {
    res.redirect(`/${wordpairs[Math.floor(Math.random() * wordpairs.length)]}`);
});

app.get("/:room", (req, res) => {
    res.render('index', { roomId: req.params.room });
});

io.on("connection", function(socket) {
    let roomID;
    socket.on('join-room', (roomId, username) => {
        // console.log(roomId, username);
        socket.join(roomId);
        io.to(roomId).emit("user-connected", username); // bug 1: couldn't send to room, fixed with this
        roomID = roomId;
        participants.push(username)
        io.to(roomId).emit("participants", participants);
    });

    socket.on('message', async data => {
        console.log(data);
        io.to(roomID).emit('group-message', data);
        let existing = await io.in(roomID).fetchSockets();
        // console.log(existing);
    });

    socket.on('typing-out', sender => {
        console.log(`${sender} is typing...`)
        io.to(roomID).emit('typing-in', sender);
    });

    socket.on('typing-stopped', () => {
        console.log('tpying stopped!');
        io.to(roomID).emit('hide-typing');
    });

});

server.listen(3000, () => console.log("[connected]"));