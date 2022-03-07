var express = require("express");
var router = express.Router();
var fs = require("fs");

const { server } = require("../store");

/* GET home page. */
router.get("/", function (req, res, next) {
    if (server) {
        server.close();
        server = null;
    }
    let torrents;
    try {
        torrents = fs.readdirSync("./torrents");
    } catch (e) {
        fs.mkdirSync("./torrents");
        torrents = [];
    }
    res.render("index", { torrents: torrents });
});

module.exports = router;
