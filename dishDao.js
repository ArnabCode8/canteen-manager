
const mysql = require("mysql");
const express = require("express");

//mySql code
const pool = mysql.createPool({

    connectionLimit : 10,
    host : "localhost",
    user : "root",
    database : "canteendb",
});

function addDish(dish)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("INSERT INTO dish SET ?",dish,function(err,rows){
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

function allDishes()
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("SELECT * FROM dish",function(err,rows){
                
                con.release();
                var str = JSON.stringify(rows);
                var resOut = JSON.parse(str);
                resolve(resOut);

            });

        });

    });

}

function dishById(dishid)
{
   return new Promise(function(resolve,reject){

       pool.getConnection(function(err,con){
       
         con.query("SELECT * FROM dish WHERE dishid = ?",dishid,function(err,rows){
             
            con.release();
            var str = JSON.stringify(rows);
            var resOut = JSON.parse(str);
            resolve(resOut);           

         });

       });

   });

}

module.exports.addDish = addDish;
module.exports.allDishes = allDishes;
module.exports.dishById = dishById;