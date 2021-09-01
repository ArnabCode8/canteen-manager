
//facilities: edit or create menu || assign holidays || view todays selected || whole view of menu
//worry about : seeing total records : better to store it in separate db
//db: dishes : id name || menu : day course mealid(pk) dishStr || record : studid courseid date dishStr(as meal can be dlted) 
//db: || dailycount : date dishStr count
//db: student regid studid studname

//so remained : record, dailycount, holidaydb : holidayid date


const express = require('express');
const path = require('path');
const mysql = require('mysql');

const studDao = require("./studDao.js");
const dishDao = require("./dishDao.js");
const menuDao = require("./menuDao.js");
const holidayDao = require("./holidayDao.js");
const recordDao = require("./recordDao.js");
const e = require('express');
const { Console } = require('console');

const app = express(); //class instantanised to call get post etc
const port = process.env.PORT || 9880;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//mySql code
const pool = mysql.createPool({

    connectionLimit : 10,
    host : "localhost",
    user : "root",
    database : "canteendb",
});

//PAGE HOISTING MODULE****************************************************************************************

app.get("/authority",function(req,res){

    console.log("directory name is : " + __dirname);
    res.sendFile(path.join(__dirname,"/authorityPage.html"));

});

app.get("/accountant",function(req,res){

    console.log("directory name is : " + __dirname);
    res.sendFile(path.join(__dirname,"/accountantPage.html"));

});

app.get("/service",function(req,res){

    console.log("directory name is : " + __dirname);
    res.sendFile(path.join(__dirname,"/servicePage.html"));

});

app.get("/login",function(req,res){

    console.log("directory name is : " + __dirname);
    res.sendFile(path.join(__dirname,"/loginPage.html"));

});

//STUDENT MODULE***********************************************************************************************

app.get("/student",function(req,res){

    var pro = studDao.allStudent(); //promise returns

    pro.then(function(rows){
      
        console.log("At control");
        console.log(rows);
        res.json(rows);

    });

});

app.get("/studentIn/:idArr",function(req,res){

    const idArr = JSON.parse(req.params['idArr']);
    console.log("received in control");
    
    var pro = studDao.studentByIdArr(idArr);
    pro.then(function(val){

        console.log(val);
        res.json(val);
    });

});

app.get("/student/:studid",function(req,res){

    var studid = JSON.parse(req.params['studid']);
    console.log("stud id received : " + studid);
    var pro = studDao.studentById(studid);
    pro.then(function(val){

        console.log("In control : ");
        console.log(val);
        res.json(val);

    });

});

app.put("/student/:stud",function(req,res){

    const stud = JSON.parse(req.params['stud']);
    console.log("student id : " + stud['studid']);
    console.log(stud);

    var pro = studDao.updateStudent(stud);
    pro.then(function(val){
       console.log("In control");
       console.log("updation status : " + val);
        res.json(val);
    });
});

app.post("/student/:stud",function(req,res){

    const stud = JSON.parse(req.params['stud']);
    
    var pro = studDao.addStudent(stud);

    pro.then(function(val){

        console.log("In control");
        console.log("insertion status : " + val);
        res.json(val);
        

    });

});

//DISH MODULE*****************************************************************************************************

app.get("/dish",function(req,res){

    var pro = dishDao.allDishes();

    pro.then(function(val){

        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.get("/dish/:dishid",function(req,res){

    const dishid = JSON.parse(req.params['dishid']);
    console.log("dish id : " + dishid);

    var pro = dishDao.dishById(dishid);

    pro.then(function(val){
    
        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.post("/dish/:dish",function(req,res){

    const dish = JSON.parse(req.params['dish']);
    console.log("received dish");
    console.log(dish);
    var pro = dishDao.addDish(dish);

    pro.then(function(val){
     
        console.log("Insertion status : " + val);
        res.json(val);
    });

});

//MENU MODULE***************************************************************************************************

app.post("/menu/:meal",function(req,res){

    const meal = JSON.parse(req.params['meal']);
    console.log("meal received in control");
    console.log(meal);

    var pro = menuDao.addMeal(meal);
    pro.then(function(val){

        console.log("insertion status : " + val);
        res.json(val);

    });

});

app.get("/menu",function(req,res){

    var pro = menuDao.getMeals();
    pro.then(function(val){

        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.get("/menu/:dayid",function(req,res){

    const dayid = JSON.parse(req.params['dayid']);
    var pro = menuDao.getMealsByDay(dayid);
    pro.then(function(val){

        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.get("/menu/:dayid/:courseid",function(req,res){

    const dayid = JSON.parse(req.params['dayid']);
    const courseid = JSON.parse(req.params['courseid']);
    var pro = menuDao.getMealsByDayANDCourse(dayid,courseid);
    pro.then(function(val){

        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.delete("/menu/:mealid",function(req,res){

    const mealid = JSON.parse(req.params['mealid']);
    console.log("meal id received in control : " + mealid);
    var pro = menuDao.deleteById(mealid);
    pro.then(function(val){

        console.log("Deletion status : " + val);
        res.json(val);

    });

});

//HOLIDAY MODULE***********************************************************************************

app.get("/holiday",function(req,res){

    var pro = holidayDao.allHolidays();
    pro.then(function(val){
      
        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.get("/holiday/:date",function(req,res){

    var date = JSON.parse(req.params['date']);
    var dArr = date.split(".");
    var dd = dArr[0] + "." + dArr[1];
    var pro = holidayDao.holidayByDate(dd);
    pro.then(function(val){

        console.log("is today holiday : " + val);
        res.json(val);

    });

});

app.post("/holiday/:dates",function(req,res){

    const dates = JSON.parse(req.params['dates']);
    console.log("received in control");
    console.log(dates);

    if(dates.length == 0)
    {
       var str = "yes";
       res.json(str);

    }
    else
    {
        var pro = holidayDao.addHoliday(dates);
        pro.then(function(val){
    
            console.log("insertion status : " + val);
            res.json(val);
    
        });

    }
    
});

app.delete("/holiday/:dates",function(req,res){

    const dates = JSON.parse(req.params['dates']);
    console.log("received in control : ");
    console.log(dates);

    if(dates.length == 0)
    {
       var str = "yes";
       res.json(str);
    }
    else
    {
        var pro = holidayDao.deleteHoliday(dates);
        pro.then(function(val){
        
        console.log("deletion status : " + val);
        res.json(val);

        });
    }

    

});

//RECORD MODULE*********************************************************************************************

//due 

//course count by month
app.get("/recordSCC/:studid/:dateArr",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    const dateArr = JSON.parse(req.params['dateArr']);

    var pro = recordDao.getStudentRecordCountBydateArr(studid,dateArr);
    pro.then(function(val){

        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

//student record by month
app.get("/recordSM/:studid/:dateArr",function(req,res){

    const dateArr = JSON.parse(req.params['dateArr']);
    const studid = JSON.parse(req.params['studid']);
    console.log("received in control : ");
    console.log("studid : " + studid);
    console.log(dateArr);

    var pro = recordDao.recordOfStudentByDateArr(dateArr,studid);
    pro.then(function(val){

        console.log(val);
        res.json(val);

    });

});

app.post("/record/:record",function(req,res){

    const record = JSON.parse(req.params['record']);
    console.log("received in control");
    console.log(record);

    var pro = recordDao.addRecord(record);
    pro.then(function(val){

        console.log("record insertion status : " + val);
        res.json(val);

    })

});

app.delete("/recordSD/:studid/:date",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    const date = JSON.parse(req.params['date']);

    console.log("received in control : studid : " + studid + " and date : " + date);
    var pro = recordDao.deleteRecordByStudidAndDate(studid,date);
    pro.then(function(val){

        console.log("deletion status : " + val);
        res.json(val);

    });

});

app.post("/recordUlt/:studid/:date/:recordArr",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    const date = JSON.parse(req.params['date']);
    const recordArr = JSON.parse(req.params['recordArr']);

    console.log("received in control");
    console.log("studid : " + studid + " and date : " + date);
    console.log(recordArr);

    var pro = recordDao.deleteRecordByStudidAndDate(studid,date);
    pro.then(function(val){

        if(val == "yes")
        {
            console.log("previous records deleted successfully");

            if(recordArr.length == 0)
            {
                console.log("nothing new to insert in record");
                res.json("yes");
            }
            else
            {
                var pro1 = recordDao.insertRecordArray(recordArr);
                pro1.then(function(val1){

                    if(val1 == "yes")
                    {
                    console.log("new record successfully inserted");
                    res.json("yes");
                    }
                    else
                    {
                        console.log("new record insertion failed");
                        res.json("no");
                    }

                });

            } 

        }
        else
        {
            console.log("previous record deletion failed");
            res.json("no");
        }

    });

});

app.get("/recordSD/:studid/:date",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    const date = JSON.parse(req.params['date']);

    console.log("received in control : ");
    console.log("studid : " + studid + " and date : " + date);

    var pro = recordDao.recordByStudidDate(studid,date);
    pro.then(function(val){

        console.log("In control");
        console.log(val);
        res.json(val);

    });

});

app.get("/uniquerecord/:date",function(req,res){

    const date = JSON.parse(req.params['date']);
    console.log("In control");
    console.log(date);
    var pro = recordDao.uniqueRecordWithCountByDate(date);

    pro.then(function(val){

        console.log("unique record");
        console.log(val);
        res.json(val);

    })

});

app.get("/studrecordcount/:studid",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    console.log("received in control : " + studid);
    var pro = recordDao.getRecordCountByStudId(studid);
    pro.then(function(val){

        console.log(val);
        res.json(val);

    });

});

app.delete("/studentR/:studid",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    var pro = recordDao.deleteRecordByStudid(studid);
    pro.then(function(val){

        if(val == "yes")
        {
           console.log("student record deleted"); 
           var pro1 = studDao.deleteStudent(studid);
           pro1.then(function(val1){

            if(val1 == "yes")
            {
                console.log("student is deleted");
                res.json("yes");
            }
            else
            {
                console.log("student deletion failed");
                res.json("no");
            }


           });

        }
        else
        {
            res.json("no");
        }

    });

});

app.delete("/studentW/:studid",function(req,res){

    const studid = JSON.parse(req.params['studid']);
    var pro = studDao.deleteStudent(studid);
    pro.then(function(val){

        console.log("student deletion status : " + val);
        res.json(val);

    })
    

});

app.listen(port,function(){

    console.log(`Server listening to the port ${port}`);

});