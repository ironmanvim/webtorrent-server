const express = require("express");
const multer = require("multer");
const fs = require("fs");

const { torrents } = require("../store");
const { client } = require("../store");

const upload = multer({
    dest: "/tmp/webtorrent-server-uploads",
});

const router = express.Router();

router
    .get("/torrent", (req, res) => {
        res.render("uploadTorrent-torrent", { error: undefined });
    })
    .post("/torrent", upload.single("torrent"), (req, res) => {
        console.log(req.file);
        if (req.file.mimetype === "application/x-bittorrent") {
            fs.renameSync(req.file.path, `./torrents/${req.file.originalname}`);
            const torrentId = fs.readFileSync(
                `./torrents/${req.file.originalname}`
            );

            const torrent = client.add(torrentId, {
                path: "./downloads",
            });

            torrent.on("error", (error) => {
                res.render("uploadTorrent-torrent", {
                    error,
                });
            });

            torrents.push({
                key: req.file.originalname,
                torrent,
            });

            res.redirect("/");
        } else {
            res.render("uploadTorrent-torrent", {
                error: "File not supported",
            });
        }
    })
    .get("/magnet", (req, res) => {
        const magnetId = req.query["magnet"];

        if (magnetId) {
            const torrent = client.add(
                magnetId,
                {
                    path: "./downloads",
                },
                (torrent) => {
                    fs.writeFileSync(
                        `./torrents/${torrent.name}.magnet`,
                        magnetId
                    );
                    torrents.push({
                        key: torrent.name + ".magnet",
                        torrent,
                    });
                    res.redirect("/");
                }
            );

            torrent.on("error", (error) => {
                res.render("uploadTorrent-magnet", {
                    error,
                });
            });
        } else {
            res.render("uploadTorrent-magnet", { error: undefined });
        }
    })
    .post("/magnet", (req, res) => {
        const magnetId = req.body["magnet"];

        const torrent = client.add(
            magnetId,
            {
                path: "./downloads",
            },
            (torrent) => {
                fs.writeFileSync(`./torrents/${torrent.name}.magnet`, magnetId);
                torrents.push({
                    key: torrent.name + ".magnet",
                    torrent,
                });
                res.redirect("/");
            }
        );

        torrent.on("error", (error) => {
            res.render("uploadTorrent-magnet", {
                error,
            });
        });
    })
    .get("/", (req, res) => {
        res.render("uploadTorrent");
    });

module.exports = router;
