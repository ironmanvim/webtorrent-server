const fs = require("fs");
const { Server } = require("socket.io");
const io = new Server();
let { torrents, client } = require("./store");

io.on("connection", (socket) => {
    console.log("socket connected");
    socket.join("room");
    // socket.on("pauseTorrent", (torrentName) => {
    //     const torrentId = fs.readFileSync(`./torrents/${torrentName}`);
    //     torrents = torrents.filter((t) => t.key !== torrentName);
    //     client.remove(torrentId);
    // });
    // socket.on("resumeTorrent", (torrentName) => {
    //     const torrentId = fs.readFileSync(`./torrents/${torrentName}`);
    //     torrents.push(client.add(torrentId, { path: "./downloads" }));
    // });

    socket.on("deleteTorrent", (torrentName) => {});
    socket.on("deleteTorrentWithFiles", (torrentName) => {});
});

module.exports = io;
