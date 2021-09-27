var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var parser = require('xml2json');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

let projectDetailsController = require('./controller/ProjectDetails');

app.get('/api/project-detail', projectDetailsController.xmlTojson);
app.post('/api/project-detail', projectDetailsController.jsonToxml);

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
})
