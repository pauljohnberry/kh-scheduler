
const scheduler = require('./controllers/scheduler');
const worker = require('./controllers/worker');
const questions = require('./controllers/questions');

//scheduler.newSchedule();

var w = new Object();
w.firstname = "r"
w.lastname = "r"
w.phone = "r"
w.email = "R"
roles = ['sound']
worker.addWorker(w, roles);
