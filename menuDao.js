
const mysql = require("mysql");
const express = require("express");

//mySql code
const pool = mysql.createPool({

    connectionLimit : 10,
    host : "localhost",
    user : "root",
    database : "canteendb",
});

//addMeal deleteMeal getMeals getMealsByDay getMealsByDayAndCourse 

function addMeal(meal)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;
            con.query("INSERT INTO menu SET ?",meal,function(err,rows){
              
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

function getMeals()
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;
            con.query("SELECT * FROM menu",function(err,rows){
              
                con.release();
                var rowStr = JSON.stringify(rows);
                var rowOut = JSON.parse(rowStr);

                resolve(rowOut);

            });

        });

    });

}

function getMealsByDay(dayid)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;
            con.query("SELECT * FROM menu WHERE dayid = ?",dayid,function(err,rows){
              
                con.release();
                var rowStr = JSON.stringify(rows);
                var rowOut = JSON.parse(rowStr);

                resolve(rowOut);

            });

        });

    });

}

function getMealsByDayANDCourse(dayid,courseid)
{
    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;
            con.query("SELECT * FROM menu WHERE dayid = ? AND courseid = ?",[dayid,courseid],function(err,rows){
              
                con.release();
                var rowStr = JSON.stringify(rows);
                var rowOut = JSON.parse(rowStr);

                resolve(rowOut);

            });

        });

    });

}

function deleteById(mealid)
{

    return new Promise(function(resolve,reject){

        pool.getConnection(function(err,con){

            if(err)throw err;

            con.query("DELETE FROM menu WHERE mealid = ?",mealid,function(err,rows){
               
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

module.exports.addMeal = addMeal;
module.exports.deleteById = deleteById;
module.exports.getMeals = getMeals;
module.exports.getMealsByDay = getMealsByDay;
module.exports.getMealsByDayANDCourse = getMealsByDayANDCourse;