#!/usr/bin/env node

// Chmod 777 kh-scheduler.js
const program = require('commander');
const db = require('./db');
const { prompt } = require('inquirer'); 

// Require worker.js file and extract controller functions using JS destructuring assignment
const { addWorker, getWorker } = require('./worker');
const { addTimeOff, getTimeOff } = require('./time-off');
const { addRole, getRole } = require('./role');
const { addSchedule, getSchedule } = require('./scheduler');

const { workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions } = require('./questions'); 

program
  .version('1.0.0')
  .description('Schedule Generator');

program
  .command('addWorker')
  .alias('aw')
  .description('Add a worker')
  .action(() => {
    prompt(workerQuestions).then(answers => addWorker(answers));
  });

program
  .command('getWorker <name>')
  .alias('gw')
  .description('Get worker')
  .action(name => getWorker(name));

program
  .command('addTimeOff')
  .alias('at')
  .description('Add time off')
  .action(() => {
    prompt(timeoffQuestions).then(answers => addTimeOff(answers));
  });

program
  .command('getTimeOff <name>')
  .alias('gt')
  .description('Get time off')
  .action(name => getTimeOff(name));

program
.command('addSchedule')
.alias('as')
.description('Add schedule')
.action(() => {
  prompt(scheduleQuestions).then(answers => addSchedule(answers));
});

program
.command('getSchedule <name>')
.alias('gs')
.description('Get schedule')
.action(name => getSchedule(name));

program
.command('addRole')
.alias('ar')
.description('Add role')
.action(() => {
  prompt(roleQuestions).then(answers => addRole(answers));
});

program
.command('getRole <name>')
.alias('gr')
.description('Get role')
.action(name => getRole(name));

// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
  program.outputHelp();
  process.exit();
}

program.parse(process.argv);