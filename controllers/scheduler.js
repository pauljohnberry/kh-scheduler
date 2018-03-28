const db = require('../helpers/db'); 
const assert = require('assert'); 
const moment = require('moment-weekdaysin');
const intersect = require('intersect');

// Public
/**
 * @function  [addSchedule]
 * @returns {String} Status
 */
const newSchedule = () => {
  return db.execute(() => {
    return new Promise((resolve, reject) => { 
      //Schedule.create(schedule, (err) => {
      //assert.equal(null, err);
      var scheduleDate = moment();
      var schedule = new db.sm.schedule();
      schedule.month = scheduleDate.month();

      // find all workers
      db.wm.worker.find().exec().then((workers) => {
        // select roles
        var excludedIds = [];
        db.rm.role.find().exec().then((roles) => {
          var weekdays = moment().month(schedule.month).weekdaysInMonth('Monday');
          // process week by week
          weekdays.forEach(wd => {
            // loop roles
            roles.forEach(r => {
              schedule.type = r.role;
              // find workers assigned to the role 
              // TODO - factor in time off
              var workersInRole = searchRole(schedule.type, workers, excludedIds);
              for (let wir = 0; wir < workersInRole.length; wir++) {
                var worker = workersInRole[wir];
                var scheduleItem = new db.sim.scheduleItem();
                scheduleItem.datestart = wd;
                scheduleItem.dateend = wd + 7;
                scheduleItem.workers.push(worker);
                schedule.items.push(scheduleItem);
                excludedIds.push(worker.id);
              }
            });
          });
          schedule.save((err,a) => {
            if (err === null) {
              resolve('schedules added');
            }
            else {
              reject(false);
            }
          });
          // db.sm.schedule.create(schedule).then((s) => {
          //   if (s === null) {
          //     resolve('schedules added');
          //   }
          //   else {
          //     reject(false);
          //   }
          // });
        });
      });
    });
  });
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
          resolve("No schedule found");
        }
        resolve(schedule);
      });
    });
  });
};

//Private
function searchRole(roleKey, myArray, excludedIds){
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

// Export all methods
module.exports = {  newSchedule, getCurrentSchedule };