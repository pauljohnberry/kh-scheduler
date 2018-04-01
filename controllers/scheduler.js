const db = require('../helpers/db'); 
const assert = require('assert'); 
const m = require('moment-weekdaysin');
const intersect = require('intersect');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(m);
// Public
/**
 * @function  [addSchedule]
 * @returns {String} Status
 */
const newSchedule = () => {
  var ifScheduleDoesntExist = function () {
    return new Promise((resolve, reject) => {
        getCurrentSchedule().then((schedule) => {
          if (schedule === false) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        })
    });
  }

  // db.sm.schedule.find({month: month}, "items.workers._id" ).exec().then((ss) => {
  //   workersInSchedule = [];
  //   ss.forEach(s => {
  //     s.items.forEach(i => {
  //       i.workers.forEach(w => {
  //         workersInSchedule.push(w.id);
  //       })
  //     })
  //   });
  //   resolve(workersInSchedule);
  // });

  var createNewSchedule = function (noScheduleExists) {
    if (!noScheduleExists) {
      return new Promise((resolve, reject) => {
        resolve('Schedules have already been generated for this month');
      });
    }
    return db.execute(() => {
      return new Promise((resolve, reject) => { 

        var scheduleDate = moment();
        var schedule = new db.sm.schedule();
        schedule.month = scheduleDate.month();

        // TODO - refactor below to promise chain
        
        // find all workers
        getWorkersIdsIncludedInSchedule(schedule.month - 1).then(getWorkersForSchedule).then((workers) => {
          // select roles
          var schedules = [];
          var excludedIds = [];
          db.rm.role.find().exec().then((roles) => {
            var weekdays = moment().month(schedule.month).weekdaysInMonth('Monday');
            // process week by week
            weekdays.forEach(wd => {
              weekStart = wd;
              weekEnd = wd.add(6, 'd');
              // loop roles
              roles.forEach(r => {
                if (schedule.type == null) {
                  schedule.type = r.role;
                }

                if (schedule.type != r.role) {
                  // find the current pre-stored schedule
                  cs = findSchedule(schedule.type, schedules);
                  if (cs == null) {
                    // save the current schedule to an array for saving later
                    schedules.push(JSON.parse(JSON.stringify(schedule)));
                  }
                  // find the next pre-stroed schedule
                  s = findSchedule(r.role, schedules);
                  if (s == null) {
                    schedule = new db.sm.schedule();
                    schedule.type = r.role;
                  }
                  else {
                    // use the found schedule
                    schedule = s;
                  }
                }

                // give priority to any one who was not included on last months schedule
                var sortedWorkers = workers.sort(function compare(a,b) {
                  if (a.usedOnLastSchedule < b.usedOnLastSchedule)
                    return -1;
                  if (a.usedOnLastSchedule > b.usedOnLastSchedule)
                    return 1;
                  return 0;
                });

                // find workers assigned to the role 
                var workersInRole = searchForWorkersInThisRole(schedule.type, sortedWorkers, excludedIds);

                // if no more workers are available then start from the top
                if (workersInRole.length < 1) {
                  excludedIds = [];
                  workersInRole = searchForWorkersInThisRole(schedule.type, workers, excludedIds);
                }

                if (workersInRole.length > 0) {
                  i = 0
                  // take first
                  var worker = workersInRole[i];

                  // skip if on holiday
                  while (isOnHoliday(worker, weekStart, weekEnd)) {
                    excludedIds.push(worker.id);
                    i++;
                    worker = workersInRole[i];
                  }

                  // order by appear on last schedule or not

                  var scheduleItem = new db.sim.scheduleItem();
                  scheduleItem.datestart = weekStart;
                  scheduleItem.dateend = weekEnd;
                  scheduleItem.workers.push(worker);
                  schedule.items.push(scheduleItem);

                  // make sure this user is excluded
                  excludedIds.push(worker.id);
                }
                //}
              });
            });

            var funcs = [];
            schedules.forEach(s => {
              funcs.push(function () {
                return new Promise((resolve, reject) => {
                  db.sm.schedule.create(s, (err,s) => {
                    resolve(true);
                  });
                })
              });
            });

            var promise = funcs[0]();
            for (var i = 1; i < funcs.length; i++) {
                promise = promise.then(funcs[i]);
            }

            promise.then(() => {
              resolve('schedules added');
            });
          });
        });
      });
    });
  };

  return ifScheduleDoesntExist().then(createNewSchedule);
};

/**
 * @function  [getSchedule]
 * @returns {Json} schedules
 */
const getCurrentSchedule = () => {
  return db.execute(() => {
    return new Promise((resolve, reject) => { 
      var scheduleDate = moment();
      var month = scheduleDate.month();
      db.sm.schedule.find({ month: month })
      // .gte('startdate', Date.now)
      // .lte('enddate', Date.now)
      .exec((err, schedule) => {
        if (schedule.length < 1) {
          resolve(false);
        }
        resolve(schedule);
      });
    });
  });
};

//Private
function searchForWorkersInThisRole(roleKey, myArray, excludedIds){
  for (var i=0; i < myArray.length; i++) {
    worker = myArray[i];
    for (var r=0; r < worker.roles.length; r++) {
      role = worker.roles[r];
      if (role.role === roleKey && !excludedIds.includes(worker.id)) {
        return [myArray[i]];
      };
    };
  };

  return [];
};

function getWorkersForSchedule(workerIdsUsedOnLastSchedule) { 
  return new Promise((resolve, reject) => {
    db.wm.worker.find().exec().then((workers) => {
      workers.forEach(w => {
        if (workerIdsUsedOnLastSchedule.includes(w.id)) {
          w.usedOnLastSchedule = 1;
        }
        else {
          w.usedOnLastSchedule = 0;
        }
      }); 
      resolve(workers);
    });
  });
}

// start: 11-02-2018
// end: 17-02-2018
// to_start: 12-02-2018
// to_end: 20-02-2018
function isOnHoliday(worker, start, end) {
  if (worker.timeoff.length > 0) {
    worker.timeoff.forEach(to => {
      var scheduleWeekRange = moment.range(start, end);
      var holidayRange = moment.range(to.datestart, to.dateend);
      if(scheduleWeekRange.overlaps(holidayRange)) {
        return true;
      }
    });
  }
  return false;
};

function getWorkersIdsIncludedInSchedule(month) {
  return new Promise((resolve, reject) => {
    db.sm.schedule.find({month: month}, "items.workers._id" ).exec().then((ss) => {
      workersInSchedule = [];
      ss.forEach(s => {
        s.items.forEach(i => {
          i.workers.forEach(w => {
            workersInSchedule.push(w.id);
          })
        })
      });
      resolve(workersInSchedule);
    });
  });
}

function findSchedule(key, schedules) {
  for (var i=0; i < schedules.length; i++) {
    schedule = schedules[i];
    if (schedule.type == key) {
      return schedule;
    }
  };

  return null;
};


// Export all methods
module.exports = {  newSchedule, getCurrentSchedule };