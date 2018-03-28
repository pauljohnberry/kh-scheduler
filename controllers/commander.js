
const { prompt } = require('inquirer');
const { workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions } = require('../controllers/questions'); 
const { setWorkerRoles, getWorkerRoles } = require('../controllers/worker'); 
const { listRoles } = require('../controllers/role'); 
const sf = require('../helpers/string-functions');

/**
 * @function  [addWorkerRoleUsingCommander]
 */
addWorkerRoleUsingCommander = function (workerId) {

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
        };5

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
 * @function  [addWorkerUsingCommander]
 */
addWorkerUsingCommander = function () {
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
            resolve(addWorker(w, r));
        })
    };

    getRoles().then(qs).then(add).then((response) => {
        console.info(response);
    })
}

// Export all methods
module.exports = { addWorkerUsingCommander, addWorkerRoleUsingCommander };