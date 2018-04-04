
const scheduler = require('./services/scheduler');
const { addRole, listRoles } = require('./services/role');
const { addRoleUsingTerminal, addWorkerUsingTerminal, addWorkerRoleUsingTerminal, addTimeOffUsingTerminal, newScheduleUsingTerminal } = require('./services/terminal');
const { workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions } = require('./services/questions'); 
const { addWorker, getWorkersByName, listWorkers, setWorkerRole, setWorkerTimeOff } = require('./services/worker');

//scheduler.newSchedule();

// var w = new Object();
// w.firstname = "r"
// w.lastname = "r"
// w.phone = "r"
// w.email = "R"
// roles = ['sound']
// addWorker(w, roles);

 var i = "5ab85befb458f3b61d0a92e1"
// var t = new Object();
// t.datestart = "2018-03-20";
// t.dateend = "2018-03-21";
// setWorkerTimeOff(i, t);

// scheduler.getCurrentSchedule().then((response) => {
//     console.log(response);
// });
// addRoleUsingTerminal();

//newScheduleUsingTerminal(3);
newScheduleUsingTerminal();
//addWorkerUsingTerminal();
// addWorkerRoleUsingTerminal(i);

// var getRoles = function() {
//     return new Promise((resolve, reject) => { 
//         resolve(listRoles()); 
//     });
// };

// var qs = function(roles) {
//     //return new Promise((resolve, reject) => {
//         pfq = function (roles) { 
//             rs = []
//             roles.forEach(r => {
//                 rs.push(sf.toLower(r.role));
//             });
//             return new Promise((resolve, reject) => { 
//                 resolve(prompt(workerQuestions(rs)))
//             })
//         };

//         ans = function (answers) { 
//             return new Promise((resolve, reject) => { 
//                 roles = answers.roles;
//                 delete answers.roles;
//                 resolve([answers, roles]);
//             })
//         };

//         return pfq(roles).then(ans);
//     //});
// }

// var add = function(params) { 
//     var r = params[1]
//     var w = params[0]
//     return new Promise((resolve, reject) => {
//         resolve(addWorker(w, r));
//     })
// };

// getRoles().then(qs).then(add).then((response) => {
//     console.info(response);
// })
