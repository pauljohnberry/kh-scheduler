#!/usr/bin/env node

// Chmod 777 kh-scheduler.js
const program = require('commander');

const { 
  addWorkerUsingTerminal, 
  addWorkerRoleUsingTerminal, 
  addRoleUsingTerminal, 
  addTimeOffUsingTerminal, 
  newScheduleUsingTerminal, 
  listWorkersUsingTerminal, 
  findWorkersUsingTerminal, 
  listRoles, 
  getCurrentScheduleUsingTerminal 
} = require('./services/terminal');

program
  .version('1.0.0')
  .description('Schedule Generator');

program
  .command('add-role')
  .alias('ar')
  .description('add a role')
  .action(() => {
    addRoleUsingTerminal();
  });

program
  .command('list-roles')
  .alias('lr')
  .description('get the full list of roles')
  .action(() => {
    listRolesUsingTerminal();
  });

program
  .command('add-worker')
  .alias('aw')
  .description('add a worker')
  .action(() => {
    addWorkerUsingTerminal();
  });

program
  .command('find-worker <name>')
  .alias('fw')
  .description('get worker by name')
  .action((name) => {
    findWorkersUsingTerminal(name);
   });

program
  .command('list-workers')
  .alias('lw')
  .description('get the full worker list')
  .action(() => {
     listWorkersUsingTerminal();
    });

program
  .command('new-schedule')
  .alias('ns')
  .description('create a new schedule')
  .action(() => {
    newScheduleUsingTerminal();
  });

program
  .command('current-schedule')
  .alias('gcs')
  .description('get the current schedule')
  .action(() => {
    getCurrentScheduleUsingTerminal();
  });

  program
  .command('export-schedules <month>')
  .alias('es')
  .description('export the schedules for a given month')
  .action((month) => {
    exportSchedulesUsingTerminal(month);
  });

program
  .command('set-worker-roles <workerid>')
  .alias('swr')
  .description('set the workers roles')
  .action(id => addWorkerRoleUsingTerminal(id));

program
  .command('create-schedule <month>')
  .alias('cs')
  .description('create a new schedule for the given month')
  .action(month => newScheduleUsingTerminal(month));

program
  .command('add-worker-timeoff <workerid>')
  .alias('awt')
  .description('set the workers time off')
  .action((id) => {
    addTimeOffUsingTerminal(id);
  });

// // Assert that a VALID command is provided 
// if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
//   program.outputHelp();
//   process.exit();
// }

program.parse(process.argv);