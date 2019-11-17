const parse = require('csv-parse');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();

const port = 3000;
const questions = {};

const getFileName = function(fileName) {
  return path.join(__dirname + '/' + fileName);
};

app.use(express.static('static'));
app.use(morgan('combined'));

fs.createReadStream(getFileName('data/questions.csv'))
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
  res.sendFile(getFileName('views/index.html'));
});

app.post('/submit_vote', function(req, res) {
  res.end();
});

app.listen(port, () => console.log('Listening at port', port));
