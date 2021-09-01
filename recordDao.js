//studid date courseid dishstr

const mysql = require("mysql");
const express = require("express");

//mySql code
const pool = mysql.createPool({

    connectionLimit : 10,
    host : "localhost",
    user : "root",
    database : "canteendb",
});

//addRecord recordByStudid recordByStudidDate recordByDate recordByCourseid updateByStudidDateCourseid

function addRecord(record)
{
   return new Promise(function(resolve,reject){

       pool.getConnection(function(err,con){

        if(err)throw err;

        con.query("INSERT INTO record SET ?",record,function(err,rows){

            con.release();
            var str = "yes";
            if(err)
            {
                console.log(err);
                str = "no";
            }

            resolve(str);

           });

       });

   });

}

function recordByStudid(studid)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM record WHERE studid = ?",studid,function(err,rows){

                if(err)console.log(err);

                var str = JSON.stringify(rows);
                var strOut = JSON.parse(str);

                resolve(strOut);

            });

        });

    });

}

function recordByStudidDate(studid,date)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM record WHERE studid = ? AND date = ?",[studid,date],function(err,rows){

                if(err)console.log(err);

                var str = JSON.stringify(rows);
                var strOut = JSON.parse(str);

                resolve(strOut);

            });

        });

    });

}

function recordByDate(date)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM record WHERE date = ?",date,function(err,rows){

                if(err)console.log(err);

                var str = JSON.stringify(rows);
                var strOut = JSON.parse(str);

                resolve(strOut);

            });

        });

    });

}

function updateByStudidDateCourseid(record)
{

    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            const arr = [];
            arr[0] = record['dishstr'];
            arr[1] = record['studid'];
            arr[2] = record['date'];
            arr[3] = record['courseid'];

            con.query("UPDATE record SET dishstr = ? WHERE studid = ? AND date = ? AND courseid = ?",arr,function(err,rows){

                var str = "yes";
                if(err)
                {
                    console.log(err);
                    str = "no";
                }

                resolve(str);
            });

        });

    });

}

function uniqueRecordWithCountByDate(date)
{
   return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT COUNT(studid),dishstr FROM record WHERE date = ? GROUP BY dishstr",date,function(err,rows){

                if(err)
                {
                    console.log(err);
                }
                else
                {
                    var jsonStr = JSON.stringify(rows);
                    var resOut = JSON.parse(jsonStr);
                    resolve(resOut);
                }

            });

        });

   });

}

function getStudentRecordCountBydateArr(studid,dateArr)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            var qr = "SELECT COUNT(courseid),courseid FROM record WHERE studid = '" + studid + "'";
            qr += " AND date IN (";
            var len = dateArr.length;
            var i;

            for(i=0;i<len;i++)
            {
               qr += "'" + dateArr[i] + "',"; 
            }

            qr = qr.substring(0,qr.length - 1);
            qr += ") GROUP BY courseid";

            con.query(qr,function(err,rows){

                if(err)
                {
                    console.log(err);
                }

                var jsonStr = JSON.stringify(rows);
                var resOut = JSON.parse(jsonStr);
                resolve(resOut);

            });

        });

    });

}

function getRecordCountByStudId(studid)
{

    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT COUNT(courseid) FROM record WHERE studid = ?",studid,function(err,rows){

                if(err)
                {
                    console.log(err);
                }
                else
                {
                    var jsonStr = JSON.stringify(rows);
                    var resOut = JSON.parse(jsonStr);
                    resolve(resOut);
                }

            });

        });

   });

}

function deleteRecordByStudid(studid)
{
   return new Promise(function(resolve,reject){

    pool.getConnection(function(err,con){

       if(err)throw err;

       con.query("DELETE FROM record WHERE studid = ?",studid,function(err,rows){

           con.release();
           var str = "yes";
           if(err)
           {
               str = "no";
               console.log(err);
           }

           resolve(str);

         });

      });

   });

}

function deleteRecordByStudidAndDate(studid,date)
{
   return new Promise(function(resolve,reject){

    pool.getConnection(function(err,con){

       if(err)throw err;

       con.query("DELETE FROM record WHERE studid = ? AND date = ?",[studid,date],function(err,rows){

           con.release();
           var str = "yes";
           if(err)
           {
               str = "no";
               console.log(err);
           }

           resolve(str);

         });

      });

   });

}

function recordOfStudentByDateArr(dateArr,studid)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            var qr = "SELECT * FROM record WHERE studid = '" + studid + "' AND date IN (";
            var len = dateArr.length;
            var i;

            for(i=0;i<len;i++)
            {
                qr += "'" + dateArr[i] + "',";
            }
            qr = qr.substring(0,qr.length - 1);
            qr += ")";

            con.query(qr,dateArr,function(err,rows){

                con.release();

                if(err)
                {
                    console.log(err);
                }

                var jsonStr = JSON.stringify(rows);
                var resOut = JSON.parse(jsonStr);

                resolve(resOut);

            });

        });

    });
}

function insertRecordArray(recordArr)
{

    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            var qr = "INSERT INTO record (studid,date,courseid,dishstr) VALUES ";
            var len = recordArr.length;
            var i;

            for(i=0;i<len;i++)
            {
                qr += "('" + recordArr[i].studid + "','" + recordArr[i].date + "',";
                qr += recordArr[i].courseid + ",'" + recordArr[i].dishstr + "'),";
            }

            qr = qr.substring(0,qr.length - 1);

            con.query(qr,function(err,rows){

                var str = "yes";
                if(err)
                {
                    str = "no";
                    console.log(err);
                }

                resolve(str);

            });

        });

    });
}

module.exports.addRecord = addRecord;
module.exports.recordByDate = recordByDate;
module.exports.recordByStudid = recordByStudid;
module.exports.recordByStudidDate = recordByStudidDate; //needed
module.exports.updateByStudidDateCourseid = updateByStudidDateCourseid;
module.exports.uniqueRecordWithCountByDate = uniqueRecordWithCountByDate;
module.exports.getRecordCountByStudId = getRecordCountByStudId;
module.exports.deleteRecordByStudid = deleteRecordByStudid;
module.exports.recordOfStudentByDateArr = recordOfStudentByDateArr;
module.exports.insertRecordArray = insertRecordArray;
module.exports.deleteRecordByStudidAndDate = deleteRecordByStudidAndDate;
module.exports.getStudentRecordCountBydateArr = getStudentRecordCountBydateArr;