const express = require("express");
const { client } = require("../store");
const router = express.Router();
const fs = require("fs");
let { torrents } = require("../store");

router.get("/:torrentName", (req, res) => {
    const { torrentName } = req.params;
    const { files } = req.query;
    let torrentId = fs.readFileSync(`./torrents/${torrentName}`);
    if (torrentName.endsWith(".magnet")) {
        torrentId = String(torrentId);
    }
    client.remove(
        torrentId,
        {
            destroyStore: !!files,
        },
        (err) => {
            fs.rmSync(`./torrents/${torrentName}`);
            res.redirect("/");
        }
    );
});

module.exports = router;
