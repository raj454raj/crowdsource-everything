const parse = require('csv-parse');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();

const port = 3000;
const questions = {};

app.use(morgan('combined'));

fs.createReadStream('questions.csv')
  .pipe(parse())
  .on('data', (row) => {
    questions[row[0]] = row[1];
  })
  .on('end', () => {
    console.log(questions);
  });

app.get('/', function(req, res) {
  res.send('Welcome to Crowdsourcing!');
});

app.get('/crowdsource', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.listen(port, () => console.log('Listening at port', port));
