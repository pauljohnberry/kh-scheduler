#!/usr/bin/env node

// Chmod 777 kh-scheduler.js
const program = require('commander');
const db = require('./db');
const { prompt } = require('inquirer'); 

// Require worker.js file and extract controller functions using JS destructuring assignment
const { addWorker, getWorker, listWorkers, setWorkerRole, setWorkerTimeOff } = require('./worker');
const { newSchedule, getCurrentSchedule } = require('./scheduler');
const { addRole, listRoles } = require('./role');
const { workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions } = require('./questions'); 

program
  .version('1.0.0')
  .description('Schedule Generator');

program
  .command('role-add')
  .alias('ra')
  .description('add a role')
  .action(() => {
    prompt(roleQuestions).then(answers => addRole(answers));
  });

program
  .command('role-list')
  .alias('rl')
  .description('get the full list of roles')
  .action(() => {
    listRoles();
  });

program
  .command('worker-add')
  .alias('wa')
  .description('add a worker')
  .action(() => {
    prompt(workerQuestions).then(answers => addWorker(answers));
  });

program
  .command('worker-find <name>')
  .alias('wf')
  .description('get worker by name')
  .action((name) => getWorker(name));

program
  .command('worker-list')
  .alias('wl')
  .description('get the full worker list')
  .action(() => listWorkers());

program
  .command('schedule-new')
  .alias('sn')
  .description('create a new schedule')
  .action(() => {
    newSchedule();
  });

program
  .command('schedule-current')
  .alias('sc')
  .description('get the current schedule')
  .action(name => getCurrentSchedule());

program
  .command('worker-addrole <workerid>')
  .alias('war')
  .description('set the workers roles')
  .action((id) => {
    prompt(roleQuestions).then((answers) => setWorkerRole(id, answers));
  });

program
  .command('worker-timeoff <workerid>')
  .alias('wto')
  .description('set the workers time off')
  .action((id) => {
    prompt(roleQuestions).then((answers) => setWorkerTimeOff(id, answers));
  });

// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
  program.outputHelp();
  process.exit();
}

program.parse(process.argv);