const json2xls = require('json2xls');
const fs = require('fs');
const moment = require('moment');
const sf = require('../helpers/string-functions');

var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

// function duplicates(arr, prop, value) {
//     var a = [], b = [], prev;
    
//     arr.sort();
//     for ( var i = 0; i < arr.length; i++ ) {
//         if ( (arr[i] !== prev) && arr[i][prop] == value ) {
//             a.push(arr[i]);
//             b.push(1);
//         } else {
//             b[b.length-1]++;
//         }
//         prev = arr[i];
//     }
    
//     return b[0];
// }

function duplicates(arr, prop, value) {
    var count = 0
    arr.forEach(element => {
        if (element[prop] == value) {
            count++;
        }
    });
    return count;
}

exportToExcel = function (json, month) {
    if (json.length > 0) {
        var listOfItems = [];
        json.forEach(schedule => {
            if (schedule.items.length > 0) {
                schedule.items.forEach(item => {
                    item.month = month,
                    item.schedule = sf.toSentenceCase(schedule.type)
                    listOfItems.push(item);
                });
            }
        });

        var itemsGroupedByWeek = groupBy(listOfItems, 'datestart');

        var newJson = [];

        for (var property in itemsGroupedByWeek) {
            if (itemsGroupedByWeek.hasOwnProperty(property)) {
                
                var newObj = {};

                newObj["Week Starting"] = moment(itemsGroupedByWeek[property][0].datestart).format('DD-MMM-YYYY');
                newObj["Week Ending"] = moment(itemsGroupedByWeek[property][0].dateend).format('DD-MMM-YYYY');

                itemsGroupedByWeek[property].forEach(item => {
                    var worker = item.workers[0];
                    var schedName = item.schedule;

                    var multiple = duplicates(itemsGroupedByWeek[property], 'schedule', item.schedule)
                    if (multiple > 1) {
                        i = 1;
                        while (i <= multiple) {
                            schedName = item.schedule + ' ' + i;
                            i++;
                            if (newObj.hasOwnProperty(schedName)) {
                                schedName = item.schedule + ' ' + i;
                            }
                            else {
                                break;
                            }
                        }
                    }

                    newObj[schedName] = sf.toSentenceCase(worker.firstname) + ' ' + sf.toSentenceCase(worker.lastname)
                    // newJson.push({ 
                    //     //"Month": month, 
                    //     //"Schedule": sf.toSentenceCase(json.type), 
                    //     "Week Starting": moment(item.datestart).format('DD-MMM-YYYY'), 
                    //     "Week Ending": moment(item.dateend).format('DD-MMM-YYYY'), 
                    //     "Name": sf.toSentenceCase(worker.firstname) + ' ' + sf.toSentenceCase(worker.lastname)
                    // });
                });

                newJson.push(newObj);
            }
        }

        // itemsGroupedByWeek.forEach(item => {
        //     var worker = item.workers[0];
        //     item.forEach(element => {
                
        //     });
        //     newJson.push({ 
        //         //"Month": month, 
        //         //"Schedule": sf.toSentenceCase(json.type), 
        //         "Week Starting": moment(item.datestart).format('DD-MMM-YYYY'), 
        //         "Week Ending": moment(item.dateend).format('DD-MMM-YYYY'), 
        //         "Name": sf.toSentenceCase(worker.firstname) + ' ' + sf.toSentenceCase(worker.lastname)
        //     });
        // });

        var fields = {}
        for (var property in newObj) {
            if (newObj.hasOwnProperty(property)) {
                fields[property] = "string";
            }
        }

        var options = { fields: fields };
        var xls = json2xls(newJson, options);
        fs.writeFileSync('exports/' + month + '.xlsx', xls, 'binary');
    }
}


module.exports = { exportToExcel };