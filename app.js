const parse = require('csv-parse');
const express = require('express');

const fs = require('fs');
const app = express();

const port = 3000;
const questions = {};

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

app.listen(port, () => console.log('Listening at port', port));
