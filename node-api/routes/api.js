const express = require("express");
const azure = require("azure-storage");
const mcache = require("memory-cache");
var dayjs = require("dayjs");

const router = express.Router();

const table = "vignettes";

const cache = (duration) => {
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

const tableService = azure.createTableService();
tableService.createTableIfNotExists(table, function (error, result, response) {
    if (!error) {
        console.log(result.created);
    }
});

router.get("/", cache(10), function (req, res, next) {
    res.json("API endpoint");
});

router.get("/allvignettes", cache(10), function (req, res) {
    const query = new azure.TableQuery();

    tableService.queryEntities(
        table,
        query,
        null,
        function (error, result, response) {
            if (!error) {
                res.json(result);
            } else {
                res.sendStatus(404);
            }
        }
    );
});

router.get("/vignettes/:ecv", cache(10), function (req, res) {
    const ecv = req.params.ecv;
    const query = new azure.TableQuery().where("PartitionKey eq ?", ecv);

    tableService.queryEntities(
        table,
        query,
        null,
        function (error, result, response) {
            if (!error) {
                res.json(result);
            } else {
                res.sendStatus(404);
            }
        }
    );
});

router.get("/check/:ecv", cache(10), function (req, res) {
    const ecv = req.params.ecv;
    const query = new azure.TableQuery().where("PartitionKey eq ?", ecv);

    tableService.queryEntities(
        table,
        query,
        null,
        function (error, result, response) {
            if (!error) {
                const validVignettes = result.entries.map((element) => {
                    const validTo = dayjs(element.ValidFrom._).add(
                        element.ValidDays._,
                        "day"
                    );
                    console.log(dayjs(element.ValidFrom._));
                    console.log(dayjs());
                    console.log(validTo);
                    return (
                        dayjs(element.ValidFrom._).isBefore(dayjs()) &&
                        dayjs().isBefore(validTo)
                    );
                });
                const isAnyValid = validVignettes.some((x) => x);
                res.json(isAnyValid);
            } else {
                res.sendStatus(404);
            }
        }
    );
});

router.put("/vignette", function (req, res, next) {
    const entGen = azure.TableUtilities.entityGenerator;
    if (!req.body.PartitionKey || !req.body.ValidFrom || !req.body.ValidDays) {
        return res.status(400).json({ error: "params missing!" });
    }
    const query = new azure.TableQuery().where(
        "PartitionKey eq ?",
        req.body.PartitionKey
    );

    let rowKey = "1";
    tableService.queryEntities(
        table,
        query,
        null,
        function (error, result, response) {
            if (!error) {
                const maxrow =
                    Math.max(
                        ...result.entries.map((e) => {
                            console.log(+e.RowKey._);
                            return +e.RowKey._;
                        })
                    ) + 1;
                rowKey = maxrow.toString();
            }
            console.log(rowKey);
            const vignette = {
                PartitionKey: entGen.String(req.body.PartitionKey),
                RowKey: entGen.String(rowKey),
                ValidFrom: entGen.DateTime(dayjs(req.body.ValidFrom)),
                ValidDays: entGen.Int32(req.body.ValidDays),
            };

            tableService.insertEntity(
                table,
                vignette,
                function (error, result, response) {
                    if (!error) {
                        res.json(result);
                    } else {
                        res.sendStatus(404);
                    }
                }
            );
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
                res.json(result);
            } else {
                res.sendStatus(404);
            }
        }
    );
});

module.exports = router;
