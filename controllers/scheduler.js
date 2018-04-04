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

        // TODO - continue to refactor below to non nested promise chain
        
        // find all workers
        getWorkersIdsFromPastSchedules(2).then(getWorkersForSchedule).then((workers) => {
          // select roles
          var schedules = [];
          
          db.rm.role.find().exec().then((roles) => {
            var weekdays = moment().month(schedule.month).weekdaysInMonth('Monday');

            var excludedIds = [];

            // process week by week
            weekdays.forEach(wd => {

              const weekStart = wd;
              const weekEnd = moment(weekStart, "DD-MM-YYYY").add(6, 'days');
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

                // give priority to any one who was not included on previous schedules
                var sortedWorkers = workers.sort(function compare(a,b) {
                  if (a.priority < b.priority)
                    return -1;
                  if (a.priority > b.priority)
                    return 1;
                  return 0;
                });

                // find workers assigned to the role 
                var firstWorkerInRole = getFirstWorkerInThisRole(schedule.type, sortedWorkers, excludedIds, false);

                // if no more workers are available then start from the top
                if (firstWorkerInRole.length < 1) {
                  firstWorkerInRole = getFirstWorkerInThisRole(schedule.type, workers, excludedIds, true);
                }

                if (firstWorkerInRole.length > 0) {
                  i = 0
                  // take from array
                  var worker = firstWorkerInRole[i];

                  // skip if on holiday
                  while (isOnHoliday(worker, weekStart, weekEnd)) {
                    excludedIds.push({ id: worker.id, role: r.role });
                    i++;
                    worker = firstWorkerInRole[i];
                  }

                  var scheduleItem = new db.sim.scheduleItem();
                  scheduleItem.datestart = weekStart;
                  scheduleItem.dateend = weekEnd;
                  scheduleItem.workers.push(worker);
                  schedule.items.push(scheduleItem);

                  // make sure this user is excluded
                  excludedIds.push({ id: worker.id, role: r.role });
                }
              });
            });

            // collate changes for save
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
function getFirstWorkerInThisRole(roleKey, myArray, excludedIds, enforceRole){
  if (enforceRole == null) {
    enforceRole = false;
  }

  for (var i=0; i < myArray.length; i++) {
    worker = myArray[i];
    for (var r=0; r < worker.roles.length; r++) {
      role = worker.roles[r];
      if (role.role === roleKey && !excludedIds.find(function(exid) { 
          if (enforceRole) {
            return worker.id == exid.id && roleKey == exid.role;
          }
          else {
            return worker.id == exid.id;
          }
        })) {
        return [myArray[i]];
      };
    };
  };
  return [];
};

function getWorkersForSchedule(workersIdsFromPastSchedules) { 
  return new Promise((resolve, reject) => {
    var currentMonth = moment().month();
    db.wm.worker.find().exec().then((workers) => {
      workers.forEach(w => {
        if (workersIdsFromPastSchedules.length > 0) {
          var lastScheduledWorker = workersIdsFromPastSchedules.find(function(wid) {
            return wid.id == w.id;
          });
          if (lastScheduledWorker.length > 0) {
            if (currentMonth > lastScheduledWorker.month) {
                w.priority = lastScheduledWorker.month - currentMonth;
            }
            else {
              // must be last year
              pastMonth = (lastScheduledWorker.month - 13) * -1;
              w.priority = pastMonth + currentMonth;
            }
          }
          else {
            w.priority = 0;
          }
        }
        else {
          w.priority = 0;
        }
      }); 
      resolve(workers);
    });
  });
}

function getWorkersIdsFromPastSchedules(noOfSchedules) {
  // TODO - have excluded ids 
  return new Promise((resolve, reject) => {
    var pastMonth = moment().month() - 1;
    var workerIds = [];
    var funcs = [];
    var excludedIds = [];
    for (let index = 0; index < noOfSchedules; index++) {
      const month = JSON.parse(JSON.stringify(pastMonth));
      funcs.push(function (excludedIds) {
        return getWorkersIdsIncludedInSchedule(month, excludedIds)
      });
      pastMonth--;
    }
    
    var promise = funcs[0](excludedIds);
    for (var i = 1; i < funcs.length; i++) {
        promise = promise.then(funcs[i]);
    }
    promise.then((response) => {
      resolve(response);
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

function getWorkersIdsIncludedInSchedule(month, excludedIds) {
  return new Promise((resolve, reject) => {
    db.sm.schedule.find({month: month}, "items.workers._id" ).exec().then((ss) => {
      workersInSchedule = [];
      ss.forEach(s => {
        s.items.forEach(i => {
          i.workers.forEach(w => {
            if (!excludedIds.includes(w.id)) {
              workersInSchedule.push({ id: w.id, month: month });
            }
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