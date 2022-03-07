var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var { default: axios } = require("axios");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var uploadTorrentRouter = require("./routes/uploadTorrent");
var torrentRoutes = require("./routes/torrent");
var deleteTorrentRoutes = require("./routes/deleteTorrent");
var movierulzRouter = require("./routes/movierulz");
const { query } = require("express");
const request = require("request");

require("./init");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/proxy/movierulz/:id*", async (req, res, next) => {
    console.log(req.url);
    console.log(
        "https://7movierulz.es/" + req.params.id + "/uploads" + req.url
    );
    request.get(
        "https://7movierulz.es/" + req.params.id + "/uploads" + req.url,
    ).pipe(res);
    // next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/uploadTorrent", uploadTorrentRouter);
app.use("/torrent", torrentRoutes);
app.use("/deleteTorrent", deleteTorrentRoutes);
app.use("/movierulz", movierulzRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
