const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");

router
    .get("/:id*", (req, res) => {
        axios.get(`https://7movierulz.es/${req.url}`).then((response) => {
            const html = response.data.replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
            );
            const dom = new JSDOM(html);

            const anchors = dom.window.document.getElementsByTagName("a");
            for (let i = 0; i < anchors.length; i++) {
                const anchor = anchors[i];
                const href = anchor.href;
                if (href.startsWith("https://7movierulz.es")) {
                    anchor.setAttribute(
                        "href",
                        href.replace(
                            "https://7movierulz.es",
                            "http://192.168.1.13:3000/movierulz"
                        )
                    );
                } else if (href.startsWith("magnet")) {
                    anchor.setAttribute(
                        "href",
                        `http://192.168.1.13:3000/uploadTorrent/magnet?magnet=${href}`
                    );
                }
            }

            const images = dom.window.document.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const src = image.src;
                if (src.startsWith("https://7movierulz.es")) {
                    image.setAttribute(
                        "src",
                        "http://192.168.1.13:3000/proxy/movierulz/" +
                            src.replace("https://7movierulz.es/", "")
                    );
                }
            }

            res.send(dom.serialize());
        });
    })
    .get("/", (req, res) => {
        const { id } = req.params;
        axios.get(`https://7movierulz.es`).then((response) => {
            const html = response.data.replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
            );
            const dom = new JSDOM(html);

            const anchors = dom.window.document.getElementsByTagName("a");
            for (let i = 0; i < anchors.length; i++) {
                const anchor = anchors[i];
                const href = anchor.href;
                if (href.startsWith("https://7movierulz.es")) {
                    anchor.setAttribute(
                        "href",
                        href.replace(
                            "https://7movierulz.es",
                            "http://192.168.1.13:3000/movierulz"
                        )
                    );
                }
            }

            const images = dom.window.document.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const src = image.src;
                if (src.startsWith("https://7movierulz.es")) {
                    image.setAttribute(
                        "src",
                        "http://192.168.1.13:3000/proxy/movierulz/" +
                            src.replace("https://7movierulz.es/", "")
                    );
                }
            }

            res.send(dom.serialize());
        });
    });

module.exports = router;
