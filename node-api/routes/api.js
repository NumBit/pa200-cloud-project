var express = require("express");
var azure = require("azure-storage");
var mcache = require("memory-cache");

var router = express.Router();

const table = "vignettes";

var cache = (duration) => {
    return (req, res, next) => {
        let key = "__express__" + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

var tableService = azure.createTableService();
tableService.createTableIfNotExists(table, function (error, result, response) {
    if (!error) {
        console.log(result.created);
    }
});

router.get("/", cache(10), function (req, res, next) {
    res.json("API endpoint");
});

router.get("/allvignettes", cache(10), function (req, res, next) {
    var query = new azure.TableQuery();
    console.log("HERE");

    tableService.queryEntities(
        table,
        query,
        null,
        function (error, result, response) {
            if (!error) {
                console.log(result);
                res.json(result);
            } else {
                console.log(error);
                res.sendStatus(404);
            }
        }
    );
});

router.get("/vignette/:row", cache(10), function (req, res) {
    const row = req.params.row;
    tableService.retrieveEntity(
        table,
        "SL123AB",
        row,
        function (error, result, response) {
            if (!error) {
                console.log(result);
                res.json(result);
            } else {
                console.log(error);
                res.sendStatus(404);
            }
        }
    );
});

module.exports = router;
