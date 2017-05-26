const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const extractVat = require('./service/extract_vat');

const app = express();

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Authorize CORS (bad practice)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware
app.use(fileUpload());

// Routes
app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const fileName = Object.keys(req.files)[0]
  const excludedVat = req.body.excluded_vat;

  let pdfFile = req.files[fileName];
  let filePath = './tmp/filename.pdf';


  pdfFile.mv(filePath, (err) => {
    if (err)
      return res.status(500).send(err);

    extractVat(filePath)
      .then(function(data) {

        data = data.filter(function(vat) { return vat != excludedVat });

        return res.json({
          filename: fileName,
          vats: data
        });
      })
      .catch(function(error) {
        return res.status(500).send(error);
      });
  })
})

// Handle 404 Error
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Handle Uncaught Errors
app.use((err, req, res) => {
  const status = err.status || 500
  res.status(status)
  res.json({
    status,
    message: err.message,
    error: err,
  })
})

module.exports = app;
