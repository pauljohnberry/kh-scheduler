const { prompt } = require('inquirer');
const { workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions, addRoleQuestions } = require('../services/questions'); 
const { setWorkerRoles, getWorkerRoles, addWorker, setWorkerTimeOff, listWorkers, getWorkersByName } = require('../services/worker'); 
const { listRoles, addRole } = require('../services/role'); 
const { newSchedule, getCurrentSchedule  } = require('../services/scheduler'); 
const sf = require('../helpers/string-functions');

/**
 * @function  [addWorkerRoleUsingTerminal]
 */
addWorkerRoleUsingTerminal = function (workerId) {

    var gwr = function (allRoles) {
      wid = workerId;
      return new Promise((resolve, reject) => {
          getWorkerRoles(wid).then((workerRoles) => {
            workerRoleIds = []
            workerRoles.forEach(wr => {
              workerRoleIds.push(wr.id);
            });
            allRoles.forEach(r => {
              if(workerRoleIds.includes(r.id)) {
                r.checked = true;
              }
            });
            resolve(allRoles);
          })
      });
    };

    var qs = function (response) {
        roles = response;

        pfq = function (roles) {
            rs = []
            roles.forEach(r => {
                rs.push({ name: sf.toLower(r.role), value: sf.toLower(r.role), checked: r.checked });
            });
            return new Promise((resolve, reject) => {
                resolve(prompt(roleQuestions(rs)))
            })
        };

        ans = function (answers) {
            return new Promise((resolve, reject) => {
                roles = answers.roles;
                resolve(roles);
            })
        };

        return pfq(roles).then(ans);
    }

    var add = function (roles) {
        var rs = roles
        return new Promise((resolve, reject) => {
            setWorkerRoles(workerId, rs).then((response) => {
                resolve(response);
            });
        });
    };

    listRoles().then(gwr).then(qs).then(add).then((response) => {
        console.info(response);
    });
}

/**
 * @function  [addWorkerUsingTerminal]
 */
addWorkerUsingTerminal = function () {
    var getRoles = function () {
        return new Promise((resolve, reject) => {
            resolve(listRoles());
        });
    };

    var qs = function (roles) {
        pfq = function (roles) {
            rs = []
            roles.forEach(r => {
                rs.push(sf.toLower(r.role));
            });
            return new Promise((resolve, reject) => {
                resolve(prompt(workerQuestions(rs)))
            })
        };

        ans = function (answers) {
            return new Promise((resolve, reject) => {
                roles = answers.roles;
                delete answers.roles;
                resolve([answers, roles]);
            })
        };

        return pfq(roles).then(ans);
    }

    var add = function (params) {
        var r = params[1]
        var w = params[0]
        return new Promise((resolve, reject) => {
            addWorker(w, r).then((response) => {
                resolve(response);
            });
        })
    };

    getRoles().then(qs).then(add).then((response) => {
        console.info(response);
    })
}

addRoleUsingTerminal = function () {
    prompt(addRoleQuestions).then(answers => {
        addRole(answers).then((response) => {
            console.log(response);
        });
    });
}

addTimeOffUsingTerminal = function (id) {
    prompt(timeoffQuestions).then((answers) => {
        setWorkerTimeOff(id, answers).then((response) => {
            console.log(response);
        });
    });
}

newScheduleUsingTerminal = function () {
    newSchedule().then((response) => {
        console.info(response);
    });
}

listWorkersUsingTerminal = function () {
    listWorkers().then((response) => {
        console.info(response);
    });
}

findWorkersUsingTerminal = function (name) {
    getWorkersByName(name).then((response) => {
        console.info(response);
    });
}

listRolesUsingTerminal = function () {
    listRoles().then((response) => {
        console.info(response);
    });
}

getCurrentScheduleUsingTerminal = function () {
    getCurrentSchedule().then((response) => {
        if (response === false)
        {
            console.info("No schedule found")
        }
        else {
            // TODO add schedule formatting in here ... or provide PDF output
            console.info(JSON.stringify(response, null, 2));
        }
    });
}

// Export all methods
module.exports = { 
    addWorkerUsingTerminal, 
    addWorkerRoleUsingTerminal, 
    addRoleUsingTerminal, 
    addTimeOffUsingTerminal, 
    newScheduleUsingTerminal, 
    listWorkersUsingTerminal, 
    findWorkersUsingTerminal, 
    listRoles, 
    getCurrentScheduleUsingTerminal 
};