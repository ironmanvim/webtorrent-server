const WebTorrent = require("webtorrent");

let torrents = [];
const client = new WebTorrent();

let server = null;

module.exports = { torrents, client, server };
