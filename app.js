const parse = require('csv-parse');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;
const questions = {};
const answers = {};

const getFileName = function(fileName) {
  return path.join(__dirname + '/' + fileName);
};

const getNextProblem = function(handle) {
  return {question_id: 6, question_content: "hello world?" + Math.random().toString()};
};

app.use(bodyParser.json());
app.use(express.static('static'));

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', function(req, res) {
  res.send('Welcome to Crowdsourcing!');
});

app.get('/crowdsource', function(req, res) {
  fs.createReadStream(getFileName('data/questions.csv'))
    .pipe(parse())
    .on('data', (row) => {
      questions[row[0]] = row[1];
    })
    .on('end', () => {
    });

  res.sendFile(getFileName('views/index.html'));
});

app.get('/get_answers_list', function(req, res) {
  var promise = new Promise((resolve, reject) => {
    fs.createReadStream(getFileName('data/answers.csv'))
      .pipe(parse())
      .on('data', (row) => {
        answers[row[0]] = row[1];
      })
      .on('end', () => {
        resolve(answers);
      });
  });

  promise.then(function(result) {
    res.json(answers);
  });
});

app.get('/get_next_problem', function(req, res) {
  console.log("get_next_problem", req.query.handle);
  res.json(getNextProblem("abcd"));
});

app.post('/submit_vote', function(req, res) {
  console.log(req.body);
  console.log(req.body.handle);
  if (req.body.handle === '') res.json({});
  console.log("submit_vote", req.body.handle);
  // Redis set operations
  res.json(getNextProblem("abcd"));
});

app.listen(port, () => console.log('Listening at port', port));
