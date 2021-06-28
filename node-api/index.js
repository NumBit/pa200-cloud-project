const express = require("express");
require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());

const azure = require("azure-storage");
const mcache = require("memory-cache");
var dayjs = require("dayjs");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const table = "vignettes";
const container = "camera-photos";

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
tableService.createTableIfNotExists(
    table,
    function (error, result, response) {}
);

const blobService = azure.createBlobService();
blobService.createContainerIfNotExists(
    table,
    function (error, result, response) {}
);
var sharedAccessPolicyWrite = {
    AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
        Start: dayjs(),
        Expiry: dayjs().add(5, "minute"),
    },
};

var sharedAccessPolicyRead = {
    AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: dayjs(),
        Expiry: dayjs().add(1, "hour"),
    },
};

app.get("/", cache(10), async function (req, res, next) {
    res.json("API endpoint");
});

app.get("/upload/:ecv", async (req, res) => {
    const ecv = req.params.ecv;
    const blob = `ecv${dayjs().toISOString()}.jpg`;
    const sasToken = blobService.generateSharedAccessSignature(
        container,
        blob,
        sharedAccessPolicyWrite
    );
    const url = blobService.getUrl(container, blob, sasToken);
    res.json(url);
});

app.get("/getPhotos", async (req, res) => {
    blobService.listBlobsSegmented(
        container,
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

app.get("/photo/:filename", async (req, res) => {
    const filename = req.params.filename;
    const blob = filename;
    const sasToken = blobService.generateSharedAccessSignature(
        container,
        blob,
        sharedAccessPolicyRead
    );
    const url = blobService.getUrl(container, blob, sasToken);
    res.json(url);
});

app.get("/allvignettes", cache(10), async (req, res) => {
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

app.get("/vignettes/:ecv", cache(10), async (req, res) => {
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

app.get("/check/:ecv", cache(10), async (req, res) => {
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

app.put("/vignette", async (req, res, next) => {
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
            if (!error && result.entries.length > 0) {
                const maxrow =
                    Math.max(
                        ...result.entries.map((e) => {
                            return +e.RowKey._;
                        })
                    ) + 1;
                rowKey = maxrow.toString();
            }
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

app.get("/vignette/:row", cache(10), async (req, res) => {
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

app.use(async (req, res, next) => {
    res.status(404).json("Sorry");
});

app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);
