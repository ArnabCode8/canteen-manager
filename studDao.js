

const mysql = require("mysql");
const express = require("express");

//mySql code
const pool = mysql.createPool({

    connectionLimit : 10,
    host : "localhost",
    user : "root",
    database : "canteendb",
});



function allStudent()
{

    return pro = new Promise(function(resolve,reject){
         
        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM student",function(err,rows){

                con.release();
                var rowStr = JSON.stringify(rows);
                var rowOut = JSON.parse(rowStr);

                resolve(rowOut);

            });

        });

    });

}

//passing student object
function addStudent(stud)
{
     return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            con.query("INSERT INTO student SET ?",stud,function(err,rows){

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

function updateStudent(stud)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;
    
            con.query("UPDATE student SET studname = ? WHERE studid = ?",[stud['studname'],stud['studid']],function(err,rows){
    
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

function deleteStudent(studid)
{
   return new Promise(function(resolve,reject){

       pool.getConnection(function(err,con){

        if(err)throw err;

        con.query("DELETE FROM student WHERE studid = ?",studid,function(err,rows){

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

function studentById(studid)
{
   return new Promise(function(resolve,reject){

    pool.getConnection(function(err,con){

        if(err)throw err;

        con.query("SELECT * FROM student WHERE studid = ?",studid,function(err,rows){

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

function studentByIdArr(idArr)
{
   return new Promise(function(resolve,reject){
         
        pool.getConnection(function(err,con){
         
            if(err)throw err;
            var len = idArr.length;
            var i;
            var qr = "SELECT * FROM student WHERE studid IN (";
            for(i=0;i<len;i++)
            {
                qr += "'" + idArr[i] + "',";
            }
            qr = qr.substring(0,qr.length - 1);
            qr += ")";

            con.query(qr,idArr,function(err,rows){
                
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

module.exports.addStudent = addStudent;
module.exports.updateStudent = updateStudent;
module.exports.allStudent = allStudent;
module.exports.deleteStudent = deleteStudent;
module.exports.studentById = studentById;
module.exports.studentByIdArr = studentByIdArr;