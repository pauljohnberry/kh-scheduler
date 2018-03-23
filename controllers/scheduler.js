const db = require('../helpers/db'); 
const assert = require('assert'); 
const moment = require('moment-weekdaysin');
const intersect = require('intersect');
const wm = require('../models/worker');
const sm = require('../models/schedule');
const sim = require('../models/schedule-item');
const rm = require('../models/role');

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

/**
 * @function  [addSchedule]
 * @returns {String} Status
 */
const newSchedule = () => {
  //Schedule.create(schedule, (err) => {
    //assert.equal(null, err);
    var scheduleDate = moment();
    var schedule = new sm.schedule();
    schedule.month = scheduleDate.month();

    // find all workers
    wm.worker.find().exec()
      .then((workers) => {
          // select roles
          var excludedIds = [];
          rm.role.find().exec()
            .then((roles) => {
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
                    var scheduleItem = new sim.scheduleItem();
                    scheduleItem.datestart = wd;
                    scheduleItem.dateend = wd + 7;
                    scheduleItem.workers.push(worker);
                    schedule.items.push(scheduleItem);
                    excludedIds.push(worker.id);
                  }
                });
              });

              sm.schedule.create(schedule), (err) => {
                assert.equal(null, err);
                console.info('schedules added');
              }
            });
      });
};

/**
 * @function  [getSchedule]
 * @returns {Json} schedules
 */
const getCurrentSchedule = () => {
  sm.schedule.find()
  .gte('startdate', Date.now)
  .lte('enddate', Date.now)
  .exec((err, schedule) => {
    assert.equal(null, err);
    console.info(schedule);
    console.info(`${schedule.length} matches`);
  });
};

// Export all methods
module.exports = {  newSchedule, getCurrentSchedule };