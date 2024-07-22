const express = require('express');// used for routing

var mysql = require('mysql');

const app = express();// instance of server is created
const port = 8080;//run on this port
const path = require('path');


// app.listen(port, function(){                          // connecting to a server
//     console.log(`Listening on port ${port}...`);  
// });

    var connection = mysql.createConnection({  
    host: "localhost",          
    user: "root",  
    password: "1234",
    database: "FAREWELLMANAGEMENTSYSTEM"                
});

module.exports = connection;

/*

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/index', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/xyz', function(req, res) {
    res.send('abyuhcihijjnm');
});

app.get('/abc', function(req, res) {
    res.send('This is Lab 11');
});

// app.get('/query',function(req,res) {          // Request to create table Students in northwind database
//     let sql = "SELECT FIRSTNAME,LASTNAME FROM EMPLOYEES";
//     connection.query(sql,function(err,results){
//         if (err) throw err;  
//         res.send(results);
//     });
// });

*/