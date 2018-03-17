const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
const moment = require('moment-weekdaysin');
const intersect = require('intersect');
const roleSchema = require('./models/role');
const workerSchema = require('./models/worker');

// Converts value to lowercase
function toLower(v) {
  return v.toLowerCase();
};

// // Define a worker Schema
// const workerSchema = mongoose.Schema({
//   firstname: { type: String, set: toLower },
//   lastname: { type: String, set: toLower }
// });

// Define a schedule item Schema
const scheduleItemSchema = mongoose.Schema({
  datestart: { type: Date },
  dateend: { type: Date },
  workers: [workerSchema]
});

// Define a schedule Schema
const scheduleSchema = mongoose.Schema({
  month: { type: String },
  type: { type: String, set: toLower },
  items: [scheduleItemSchema]
});

// Define model as an interface with the database
const Schedule = mongoose.model('Schedule', scheduleSchema);
//const Worker = mongoose.model('Worker');
// const Role = mongoose.model('Role', roleSchema);

function searchRole(roleKey, myArray, excludedIds){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].role === roleKey && !excludedIds.find(myArray[i]._id)) {
          return myArray[i];
      }
  }
}

/**
 * @function  [addSchedule]
 * @returns {String} Status
 */
const newSchedule = () => {
  //Schedule.create(schedule, (err) => {
    //assert.equal(null, err);
    var schedule = new Schedule();
    schedule.month = Date.now.month;

    // find all workers
    Worker.find().exec()
      .then((workers) => {
        // select roles
        var excludedIds = [];
        Role.find().exec()
          .then((roles) => {
            var weekdays = moment().month(schedule.month).weekdaysInMonth('Monday');
            // process week by week
            weekdays.forEach(wd => {
              // loop roles
              roles.forEach(r => {
                schedule.type = r;
                // find workers assigned to the role 
                // TODO - factor in time off
                var workersInRole = searchRole(role, workers, excludedIds);
                var scheduleItem = new scheduleItemSchema();
                scheduleItem.datestart = wd;
                scheduleItem.dateend = wd + 7;
                scheduleItem.workers.push(worker);
                schedule.items.push(scheduleItem);
                excludedIds.push(worker._id);
              });
            });

            Schedule.create(schedule), (err) => {
              assert.equal(null, err);
            }
          });
      });

    console.info('schedules added');
    mongoose.disconnect();
};

/**
 * @function  [getSchedule]
 * @returns {Json} schedules
 */
const getCurrentSchedule = () => {
  Schedule.find()
  .gte('startdate', Date.now)
  .lte('enddate', Date.now)
  .exec((err, schedule) => {
    assert.equal(null, err);
    console.info(schedule);
    console.info(`${schedule.length} matches`);
    mongoose.disconnect();
  });
};

// Export all methods
module.exports = {  newSchedule, getCurrentSchedule };