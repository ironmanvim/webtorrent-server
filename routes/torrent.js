const express = require("express");
const router = express.Router();
let { server } = require("../store");
let { torrents } = require("../store");
const io = require("../socket");

let progressInterval = null;

router
    .get("/:torrentName", (req, res) => {
        const { torrentName } = req.params;

        try {
            const { torrent } = torrents.find(
                (torrent) => torrent.key === torrentName
            );
            const interval = setInterval(() => {
                if (torrent.ready) {
                    clearTimeout(interval);
                    const { files } = torrent;
                    if (server) {
                        server.close();
                        server = null;
                        clearTimeout(progressInterval);
                    }
                    server = torrent.createServer();
                    server.listen(5000);
                    server.on("error", (err) => {
                        console.log(err);
                    })
                    res.render("torrent", { files, error: undefined });
                    progressInterval = setInterval(() => {
                        const torrentFilesProgress = [];
                        files.forEach((file) => {
                            torrentFilesProgress.push({
                                id: file.name,
                                progress: (file.progress * 100).toFixed(2),
                            });
                        });
                        io.to("room").emit("torrentFilesProgress", {
                            torrent: {
                                progress: (torrent.progress * 100).toFixed(2),
                            },
                            files: torrentFilesProgress,
                        });
                    }, 1000);
                }
            }, 1000);

            torrent.on("error", (err) => {
                res.render("torrent", { error: err, files: [] });
            });
        } catch (e) {
            res.send("torrent not found");
        }
    })
    .get("/", (req, res) => {
        res.send("torrent not provided");
    });

module.exports = router;
