const http = require("http");
const express = require("express");
const path = require("path")
const socketio = require("socket.io");
const { Socket } = require("net");
const users = require("./utils/users")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public")

app.use(express.static(publicPath));

io.on("connection", (socket) => {

    socket.emit("Msg", {
        msg: "Welcome to the chat app",
        username: "Admin",
    })
    socket.on("Message", (msg) => {
        const user = users.getUser(socket.id);
        console.log(user);
        if(user!=undefined)
        {
            io.to(user.room).emit("Msg", {
                msg,
                username: user.username
            });
        }
    })

    socket.on("join", (query_String, callback) => {
        const user = users.addUser(socket.id, query_String.username, query_String.room)
        if (user.error) {
            // console.log(user.error)
            return callback(user.error)
        }
        socket.join(query_String.room)
        socket.broadcast.to(user.room).emit("Msg", {
            msg: `${user.username} has joined`,
            username: "Admin",
        })
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: users.getUsersInRoom(user.room)
        })

    })
    socket.on("sendLocation", (location) => {
        const user = users.getUser(socket.id);
        console.log("locaiton", user)
        io.to(user.room).emit("Msg", {
            msg: `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
            username: user.username,
        })
    })

    socket.on("disconnect", () => {
        const user = users.removeUser(socket.id)
        if (user != undefined) {
            io.to(user.room).emit("Msg", {
                msg: `${user.username} has left the chat`,
                username: "Admin"
            })
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: users.getUsersInRoom(user.room),
            })
        }
    })
})

app.get("", (req, res) => {
    -
        res.render("index");
})

server.listen(port, () => {
    console.log(`running at port ${port}`);
})