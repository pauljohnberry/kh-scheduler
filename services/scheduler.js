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
const newSchedule = (monthToSchedule) => {
  var ifScheduleDoesntExist = function () {
    return new Promise((resolve, reject) => {
      if (monthToSchedule == null) {
        monthToSchedule = moment().add(1, 'months').month();
      }
      getSchedules(monthToSchedule).then((schedule) => {
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
        resolve('Schedules have already been generated');
      });
    }
    return db.execute(() => {
      return new Promise((resolve, reject) => { 

        var scheduleDate = moment();
        var schedule = new db.sm.schedule();
        schedule.month = monthToSchedule;

        // TODO - continue to refactor below to non nested promise chain
        
        // find all workers
        getWorkersIdsFromPastSchedules(2, monthToSchedule).then(getWorkersForSchedule).then((workers) => {
          // select roles
          var schedules = [];
          
          db.rm.role.find().exec().then((roles) => {
            var weekdays = moment().month(schedule.month).weekdaysInMonth('Monday');

            var excludedIds = [];

            var wn = 1;
            // process week by week
            weekdays.forEach(wd => {
              
              const dateStart = wd;
              const dateEnd = moment(dateStart, "DD-MM-YYYY").add(6, 'days');
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
                    schedule.month = monthToSchedule;
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


                for (let index = 0; index < r.workersneeded; index++) {
                  // find workers assigned to the role 
                  var firstWorkerInRole = determineFirstWorkerInThisRole({ role: schedule.type, week: wn, dateStart: dateStart, dateEnd: dateEnd, wn: wn } , sortedWorkers, excludedIds);

                  if (firstWorkerInRole.length > 0) {
                    // take from array
                    var worker = firstWorkerInRole[0];
  
                    // // skip if on holiday
                    // while (isOnHoliday(worker, dateStart, dateEnd)) {
                    //   excludedIds.push({ id: worker.id, role: r.role, week: wn });
                    //   worker = determineFirstWorkerInThisRole({ role: schedule.type, week: wn, dateStart: dateStart, dateEnd: dateEnd } , sortedWorkers, excludedIds);
                    //   var worker = worker[0];
                    // }
  
                    var scheduleItem = new db.sim.scheduleItem();
                    scheduleItem.datestart = dateStart;
                    scheduleItem.dateend = dateEnd;
                    scheduleItem.workers.push(worker);
                    schedule.items.push(scheduleItem);
  
                    // make sure this user is excluded
                    excludedIds.push({ id: worker.id, role: r.role, week: wn });
                  }
                }    
              });

              wn++;
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
 * @function  [getCurrentSchedule]
 * @returns {Json} schedule
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

/**
 * @function  [getSchedules]
 * @returns {Json} schedules
 */
const getSchedules = (month) => {
  return db.execute(() => {
    return new Promise((resolve, reject) => { ;
      db.sm.schedule.find({ month: month })
      // .gte('startdate', Date.now)
      // .lte('enddate', Date.now)
      .exec((err, schedules) => {
        if (schedules.length < 1) {
          resolve(false);
        }
        resolve(schedules);
      });
    });
  });
};

function determineFirstWorkerInThisRole(keys, workers, excludedIds) {
  // find workers assigned to the role 
  var firstWorkerInRole = getFirstWorkerInThisRole(keys, workers, excludedIds, 'month');

  // if no more workers are available then start from the top
  if (firstWorkerInRole.length < 1) {
    firstWorkerInRole = getFirstWorkerInThisRole(keys, workers, excludedIds, 'role');
  }

  if (firstWorkerInRole.length < 1) {
    firstWorkerInRole = getFirstWorkerInThisRole(keys, workers, excludedIds, 'week');
  }

  return firstWorkerInRole;
}

//Private
function getFirstWorkerInThisRole(keys, workers, excludedIds, exclusionLevel){
  // randonise the order of workers
  var shuffledWorkers = shuffle(JSON.parse(JSON.stringify(workers)));
  var returnedWorker;
  //workers = shuffle(workers);
  for (var i=0; i < shuffledWorkers.length; i++) {
    worker = shuffledWorkers[i];
    worker.id = worker._id;
    for (var r=0; r < worker.roles.length; r++) {
      role = worker.roles[r];
      if (role.role === keys.role) {

        // TODO - check holidays here and then exclue skip if on holiday
        if (isOnHoliday(worker, keys.dateStart, keys.dateEnd)) {
          excludedIds.push({ id: worker.id, role: r.role, week: keys.wn });
          continue;
        }

        // if (random) {
        //   var rnd = Math.floor(Math.random() * (shuffledWorkers.length - 1)) + 1 ;
        //   return [shuffledWorkers[rnd]];
        // }
        // else {
        if (!excludedIds.find(function(exclusion) { 
          // get exclusions for current week
          // if this user is in the current week then skip
          if (worker.id == exclusion.id && exclusion.week == keys.week && exclusionLevel != 'week') {
            return true;
          }

          switch (exclusionLevel) {
            case 'month':
              return worker.id == exclusion.id; 
              break;
             case 'week':
               return worker.id == exclusion.id && exclusion.week == keys.week; 
               break;
            case 'role':
              return worker.id == exclusion.id && exclusion.role == keys.role; 
              break;
            default:
              return false;
              break;
          };
        })) {
          returnedWorker = shuffledWorkers[i];
        };
      };
    };
  };
  if (returnedWorker == null) {
    return [];
  }
  return [returnedWorker];
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getWorkersForSchedule(params) { 
  var workerIdsFromPastSchedules = params.workerIds;
  var scheduleMonth = params.scheduleMonth;
  return new Promise((resolve, reject) => {
    var thisScheduleMonth = scheduleMonth;
    db.wm.worker.find().exec().then((workers) => {
      workers.forEach(w => {
        if (workerIdsFromPastSchedules.length > 0) {
          var lastScheduledWorker = workerIdsFromPastSchedules.find(function(wid) {
            return wid.id == w.id;
          });
          if (lastScheduledWorker.length > 0) {
            if (thisScheduleMonth > lastScheduledWorker.month) {
                w.priority = lastScheduledWorker.month - thisScheduleMonth;
            }
            else {
              // must be last year
              pastMonth = (lastScheduledWorker.month - 13) * -1;
              w.priority = pastMonth + thisScheduleMonth;
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

function getWorkersIdsFromPastSchedules(noOfSchedules, scheduleMonth) {
  // TODO - have excluded ids 
  return new Promise((resolve, reject) => {
    var pastMonth = scheduleMonth -1;
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
      resolve({ workerIds: response, scheduleMonth: scheduleMonth });
    });
  });
}

// start: 11-02-2018
// end: 17-02-2018
// to_start: 12-02-2018
// to_end: 20-02-2018
function isOnHoliday(worker, start, end) {
  var onHoliday = false;
  if (worker.timeoff != null && worker.timeoff.length > 0) {
    worker.timeoff.forEach(to => {
      var scheduleWeekRange = moment.range(start, end);
      var holidayRange = moment.range(to.datestart, to.dateend);
      if(scheduleWeekRange.overlaps(holidayRange)) {
        onHoliday = true;
        return onHoliday;
      }
    });
  }
  return onHoliday;
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
module.exports = {  newSchedule, getCurrentSchedule, getSchedules };