const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const path = require('path');


app.use(cors());
app.use(bodyParser.json());

let projectDetailsController = require('./controller/ProjectDetails');

/*Start Front-End Route*/
app.get('/',function(req,res) {
   res.sendFile(path.join(__dirname, '/view/project.html'));
});
/*End Front-End Route*/

/*Start Back-End Route*/
app.get('/api/project-detail', projectDetailsController.xmlTojson);
app.post('/api/project-detail', projectDetailsController.jsonToxml);
/*Start Back-End Route*/

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
})
