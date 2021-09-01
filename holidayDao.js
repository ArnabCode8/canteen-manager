const mysql = require("mysql");
const express = require("express");

//mySql code
const pool = mysql.createPool({

    connectionLimit : 10,
    host : "localhost",
    user : "root",
    database : "canteendb",
});

//addHoliday deleteHoliday allHolidays

function addHoliday(dates)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            var len = dates.length;
            var i;
            var queryStr = "INSERT INTO holiday (date) VALUES ";
            for(i=0;i<len;i++)
            {
                queryStr += "('" + dates[i] + "'),";
            }

            queryStr = queryStr.substring(0,queryStr.length - 1);

            con.query(queryStr,function(err,rows){
                
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

function deleteHoliday(dates)
{
   return new Promise(function(resolve,reject){

       pool.getConnection(function(err,con){

          if(err)throw err;

          var queryStr = "DELETE FROM holiday WHERE date IN (";
          var len = dates.length;
          var i;
          for(i=0;i<len;i++)
          {
              queryStr += "'" + dates[i] + "',";
          }

          queryStr = queryStr.substring(0,queryStr.length - 1);
          queryStr += ")";

          con.query(queryStr,function(err,rows){

            con.release();
            var str = "yes";
            if(err)
            {
                str = "no";
            }

            resolve(str);

          });

       });

   });

}

function  allHolidays()
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM holiday",function(err,rows){

                con.release();
                var str = JSON.stringify(rows);
                var jsonStr = JSON.parse(str);
                resolve(jsonStr);

            });

        });

    });

}

function holidayByDate(date)
{
   return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM holiday WHERE date = ?",date,function(err,rows){

                con.release();
                var jsonStr = JSON.stringify(rows);
                var resOut = JSON.parse(jsonStr);

                var str = "yes";
                if(resOut.length == 0)
                {
                    str = "no";
                }
                
                resolve(str);

            });

        });

   });

}

module.exports.addHoliday = addHoliday;
module.exports.allHolidays = allHolidays;
module.exports.deleteHoliday = deleteHoliday;
module.exports.holidayByDate = holidayByDate;