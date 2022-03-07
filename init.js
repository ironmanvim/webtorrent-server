const fs = require("fs");
const io = require("./socket");
const { torrents, client, server } = require("./store");

let torrentFiles;
try {
    torrentFiles = fs.readdirSync("./torrents");
} catch (e) {
    fs.mkdirSync("./torrents");
    torrentFiles = [];
}

torrentFiles.forEach((torrentFile) => {
    let torrentId = fs.readFileSync(`./torrents/${torrentFile}`);

    if (torrentFile.endsWith(".magnet")) {
        torrentId = torrentId.toString();
    }

    const torrent = client.add(torrentId, {
        path: "./downloads",
    });

    torrents.push({
        key: torrentFile,
        torrent,
    });
});

setInterval(() => {
    io.to("room").emit(
        "torrentsProgress",
        torrents.map((t) => {
            return {
                id: t.key,
                progress: (t.torrent.progress * 100).toFixed(2),
                paused: t.torrent.paused,
            };
        })
    );
}, 1000);