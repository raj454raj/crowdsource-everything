const parse = require('csv-parse');
const fs = require('fs');
const questions = {};

fs.createReadStream('questions.csv')
  .pipe(parse())
  .on('data', (row) => {
    questions[row[0]] = row[1];
  })
  .on('end', () => {
    console.log(questions);
  });

