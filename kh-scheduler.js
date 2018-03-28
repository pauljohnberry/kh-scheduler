#!/usr/bin/env node

// Chmod 777 kh-scheduler.js
const program = require('commander');
const db = require('./helpers/db');
const { prompt } = require('inquirer'); 

// Require worker.js file and extract controller functions using JS destructuring assignment
const { addWorkerUsingCommander } = require('./controllers/commander');
const { addWorker, getWorkersByName, listWorkers, setWorkerRole, setWorkerTimeOff } = require('./controllers/worker');
const { newSchedule, getCurrentSchedule } = require('./controllers/scheduler');
const { addRole, listRoles } = require('./controllers/role');
const { workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions } = require('./controllers/questions'); 

const sf = require('./helpers/string-functions');

program
  .version('1.0.0')
  .description('Schedule Generator');

program
  .command('add-role')
  .alias('ar')
  .description('add a role')
  .action(() => {
    prompt(roleQuestions).then(answers => addRole(answers));
  });

program
  .command('list-roles')
  .alias('lr')
  .description('get the full list of roles')
  .action(() => listRoles().then((response) => {
      console.info(response);
    }));

program
  .command('add-worker')
  .alias('aw')
  .description('add a worker')
  .action(() => {
    addWorkerUsingCommander();
  });

program
  .command('find-worker <name>')
  .alias('fw')
  .description('get worker by name')
  .action((name) => getWorkersByName(name).then((response) => {
    console.info(response);
  }));

program
  .command('list-workers')
  .alias('lw')
  .description('get the full worker list')
  .action(() => listWorkers().then((response) => {
    console.info(response);
  }));

program
  .command('new-schedule')
  .alias('ns')
  .description('create a new schedule')
  .action(() => {
    newSchedule();
  });

program
  .command('current-schedule')
  .alias('cs')
  .description('get the current schedule')
  .action(name => getCurrentSchedule().then((response) => {
    console.info(response);
  }));

program
  .command('set-worker-roles <workerid>')
  .alias('swr')
  .description('set the workers roles')
  .action(id => console.info(addWorkerRoleUsingCommander(id)));

program
  .command('add-worker-timeoff <workerid>')
  .alias('awt')
  .description('set the workers time off')
  .action((id) => {
    prompt(timeoffQuestions).then((answers) => setWorkerTimeOff(id, answers));
  });

// // Assert that a VALID command is provided 
// if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
//   program.outputHelp();
//   process.exit();
// }

program.parse(process.argv);