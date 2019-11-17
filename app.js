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
  let questionId = Math.floor(Math.random() * Object.keys(questions).length) + 1;
  return {question_id: questionId, question_content: questions[questionId]};
};

app.use(bodyParser.json());

app.use((req, res, next) => {
  var returnedAlready = false;
  if(['/', '/get_answers_list', '/crowdsource', '/get_next_problem', '/submit_vote'].indexOf(req.path) > -1) {
    if(!req.headers["user-agent"].match(/Macintosh.*Mac OS X.*AppleWebKit/)) {
      res.json({err: "Rehne de bhai idhar se nahi!"});
      returnedAlready = true;
    }
  }

  if(['/get_next_problem', 'submit_vote'].indexOf(req.path) > -1) {
    let handle = req.query.handle || req.body.handle;
    if(!handle || handle === "" || !handle.match(/^[a-z0-9]+$/i)) {
      res.json({err: "Request params are wrong!"});
      returnedAlready = true;
    }
  }
  if(!returnedAlready) next();
});

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
  let handle = req.query.handle;
  res.json(getNextProblem(handle));
});

app.post('/submit_vote', function(req, res) {
  let handle = req.body.handle;
  // Redis set operations
  res.json(getNextProblem(handle));
});

app.listen(port, () => console.log('Listening at port', port));
