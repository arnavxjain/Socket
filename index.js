const express = require("express");
const path = require("path");
const http = require('http');

const app = express();
const server = http.Server(app);

const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static('public'));

let wordpairs = ['room1', 'room2', 'room3']; 

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
    });

    socket.on('message', data => {
        console.log(data);
        io.to(roomID).emit('group-message', data);
    })

});

server.listen(3000, () => console.log("[connected]"));