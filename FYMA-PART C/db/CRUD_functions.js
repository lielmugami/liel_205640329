const sql = require("./db");
var path = require("path");
const express = require("express");
var url = require('url');


// Create new User
const createNewUser = function (req, res) {
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    let d = new Date();

    const newUser = {
        "email": req.body.email,
        "userName": req.body.userName,
        "Date_of_birth": req.body.date,
        "phone": req.body.phone,
        "city": req.body.city,
        "Gender": req.body.options,
        "password": req.body.password,
        "TimeStamp": d,
    };

    sql.query("SELECT email FROM USERS WHERE email = ?", newUser.email, (err, results) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in creating customer: " + err});
            return;
        }
        if (results.length !== 0) { //the user is already exist in DB
            res.render('signup', {theUserExist: "This user is already exist"});
            return;
        } else {
            const Q1 = 'INSERT INTO USERS SET ?';
            sql.query(Q1, newUser, (err, mysqlres) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).render('error', {message: "could not sign up"});
                    return;
                }
                console.log("Successfully")
                res.redirect('login');
                return;
            });
        }
    });
};


//login - find user
const findUser = function (req, res) {
    const {email, password} = req.query;
    console.log(email, password);
    sql.query(`SELECT *
               FROM USERS
               WHERE email = '${email}'
                 AND password = '${password}'`, (err, result) => {
        console.log("results", result);
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "there is a problem with the search" + err});
            return;
        }
        if (result.length != 0) {// found the user in DB
            req.session.userid = email;
            res.redirect('search'); //if the user is not on the DB
            return;
        }
        console.log("error: ", err);
        res.render('login', {SignInError:"Invalid userName or Password"});
        return;
    });
}


//find makeup artist
const findMakeupArtist = function (req, res) { //insert details into the Searches table
    var currentdate = new Date();
    var dd = currentdate.getDate();
    var mm = currentdate.getMonth() + 1; //January is 0 so need to add 1 to make it 1
    var yyyy = currentdate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var hh = currentdate.getHours();
    var mi = currentdate.getMinutes();
    var ss = currentdate.getSeconds();
    currentdate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss;

    // if (!req.session.isAuthenticared()) {
    //     console.log("error in authenticates ", err);
    //     res.status(400).send({message: "error in authenticates" + err});
    //     return;
    // }

    const newSearch = {
        "userEmail": req.session.userid,
        "city": req.body.city,
        "latitude": req.body.lat === '' ? null : req.body.lat,
        "longitude": req.body.lon === '' ? null : req.body.lon,
        "makeUpSpeciality": req.body.options,
        "uploadedOn": currentdate,
    };
    console.log(newSearch);

    //insert the new search details to the db
    sql.query("INSERT INTO Searches SET ?", newSearch, (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in creating Search object: " + err});
            return;
        }
        console.log("new Search added to db");
    });

    if (newSearch.city !== '') { // use city for the search
        sql.query('SELECT * FROM makeUpArtists as MA JOIN makeUpSpecialitys as MS on MA.email = MS.makeUpArtistEmail right JOIN makeUpArtistsDates as MD on MD.makeUpArtistEmail = MS.makeUpArtistEmail WHERE MS.makeUpSpeciality = ? and MD.datesNotAvailable != ? and MA.city =?', [req.body.options, req.body.date, req.body.city], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) { // If there is a relevant Makeup artist in DB
                const map = new Map(results.map((obj) => [obj.email, obj]));
                const newArr = map.values();
                console.log(newArr);
                let arr2 = Array.from(map.values());
                console.log(arr2);
                res.render('Found', {resultMakeUpArtist: arr2});
            } else {
                res.render('notFound');
            }
        });
    } else if (newSearch.latitude !== null) { // use GEO location for the search
        sql.query('SELECT * FROM makeUpArtists as MA JOIN makeUpSpecialitys as MS on MA.email = MS.makeUpArtistEmail right JOIN makeUpArtistsDates as MD on MD.makeUpArtistEmail = MS.makeUpArtistEmail WHERE MS.makeUpSpeciality = ? and MD.datesNotAvailable!= ?', [req.body.options, req.body.date], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) { // If there is a relevant Makeup artist in DB
                results.forEach((a, index) => {
                    a.distance = calculateDistanceBetweenTwoCoordinates(req.body.lat, req.body.lon, a.latitude, a.longitude);
                });
                results = results.filter(element => element.distance < 10)
                const map = new Map(results.map((obj) => [obj.email, obj]));
                const newArr = map.values();
                console.log(newArr);
                let arr2 = Array.from(map.values());
                console.log(arr2);

                if (results.length == 0) {
                    res.render('notFound');
                } else { // If there is relevant Makeup artist in DB
                    res.render('Found', {resultMakeUpArtist: arr2});
                }
            } else {
                res.render('notFound');
            }
            res.end();
        });
    } else {
        // not city , and no coordinates
        sql.query('SELECT distinct * FROM makeUpArtists as MA JOIN makeUpSpecialitys as MS on MA.email = MS.makeUpArtistEmail right JOIN makeUpArtistsDates as MD on MD.makeUpArtistEmail = MS.makeUpArtistEmail WHERE MS.makeUpSpeciality = ? and MD.datesNotAvailable!= ?', [req.body.options, req.body.date], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) { // If there is a relevant Makeup artist in DB
                const map = new Map(results.map((obj) => [obj.email, obj]));
                const newArr = map.values();
                console.log(newArr);
                let arr2 = Array.from(map.values());
                console.log(arr2);
                res.render('Found', {resultMakeUpArtist: arr2});
            } else {
                res.render('notFound');
            }
        });
    }
    console.log(newSearch);
}


//help function for search - find distance from GEO location
function calculateDistanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2) {
    var radios = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = radios * c; // Distance in km
    console.log(d);
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}



// help function that find makeup artist by email
function getMakeupArtistByEmail(email) {
        console.log(email);
            const myPromise = new Promise((resolve, reject) => {
               return  sql.query('SELECT * FROM makeUpArtists join makeUpSpecialitys on makeUpArtists.email=makeUpSpecialitys.makeUpArtistEmail  WHERE makeUpArtists.email=?', email, (err, results)=>{
                if (err) reject(err);
                if (results.length === 0){
                  reject(null);
                }
                else{
                  resolve(results[0]);
                }
         });
        });
         return myPromise.then((results) =>results).catch(err => err);
}



//help function that check if makeUp artist is Available  in some date
const checkAvailableDateByMakeUpArtist = function (req, res) {
    const newBooking = {
        "makeUpArtistEmail":req.body.email,
        "datesNotAvailable":req.body.date,
    };
    console.log(newBooking);
    sql.query('SELECT * FROM makeUpArtistsDates WHERE makeUpArtistsDates.makeUpArtistEmail=? and makeUpArtistsDates.datesNotAvailable=?', [newBooking.makeUpArtistEmail, newBooking.datesNotAvailable], (err, results) => {
        if (err) throw err;
        if (results.length == 0) {
            const Q1 = 'INSERT INTO makeUpArtistsDates SET ?';
            sql.query(Q1, newBooking, (err, mysqlres) => {
                res.redirect(`/search?message=Successfully booked an Appointment`);
            });
        }
        else {
            res.redirect(`/profile?userid=${req.body.email}&message=this date is not Available, please select another date`);
        }
    });
}


module.exports = {createNewUser, findUser, findMakeupArtist,getMakeupArtistByEmail,checkAvailableDateByMakeUpArtist};
