const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");
const { movierulzURL } = require("../config");

router
    .get("/:id*", (req, res) => {
        axios.get(`${movierulzURL}/${req.url}`).then((response) => {
            const html = response.data.replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
            );
            const dom = new JSDOM(html);

            const anchors = dom.window.document.getElementsByTagName("a");
            for (let i = 0; i < anchors.length; i++) {
                const anchor = anchors[i];
                const href = anchor.href;
                if (href.startsWith(`${movierulzURL}`)) {
                    anchor.setAttribute(
                        "href",
                        href.replace(
                            `${movierulzURL}`,
                            "/movierulz"
                        )
                    );
                } else if (href.startsWith("magnet")) {
                    anchor.setAttribute(
                        "href",
                        `/uploadTorrent/magnet?magnet=${href}`
                    );
                }
            }

            const images = dom.window.document.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const src = image.src;
                if (src.startsWith(`${movierulzURL}`)) {
                    image.setAttribute(
                        "src",
                        "/proxy/movierulz/" +
                            src.replace(`${movierulzURL}/`, "")
                    );
                }
            }

            res.send(dom.serialize());
        });
    })
    .get("/", (req, res) => {
        const { id } = req.params;
        axios.get(`${movierulzURL}`).then((response) => {
            const html = response.data.replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
            );
            const dom = new JSDOM(html);

            const anchors = dom.window.document.getElementsByTagName("a");
            for (let i = 0; i < anchors.length; i++) {
                const anchor = anchors[i];
                const href = anchor.href;
                if (href.startsWith(`${movierulzURL}`)) {
                    anchor.setAttribute(
                        "href",
                        href.replace(
                            `${movierulzURL}`,
                            "/movierulz"
                        )
                    );
                }
            }

            const images = dom.window.document.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const src = image.src;
                if (src.startsWith(`${movierulzURL}`)) {
                    image.setAttribute(
                        "src",
                        "/proxy/movierulz/" +
                            src.replace(`${movierulzURL}/`, "")
                    );
                }
            }

            res.send(dom.serialize());
        });
    });

module.exports = router;
