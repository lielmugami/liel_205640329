var SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');


//create Users table
const CreateUsersTable = (req,res)=> {
    var Q0 = `CREATE TABLE IF NOT EXISTS USERS (
        email VARCHAR(50) NOT NULL PRIMARY KEY, 
        userName VARCHAR(50) NOT NULL,
        Date_of_birth date ,
        phone VARCHAR(15) NOT NULL,
        city VARCHAR(30),
        Gender VARCHAR(15),
        password VARCHAR(50) NOT NULL, 
        TimeStamp datetime NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q0,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating Users table"});
            return;
        }
        console.log('created Users table');
        res.send("Users table created");
        return;
    })
}


//insert into Users table
const insertDataToUsersTable = (req,res)=>{
    var Q4 = "INSERT INTO USERS SET ?";
    const csvFilePath1= path.join(__dirname, "USERS.csv");
    csv()
    .fromFile(csvFilePath1)
    .then((jsonObj)=>{
        jsonObj.forEach(element => {
            var NewEntry = {
                "email": element.email,
                "userName": element.userName,
                "Date_of_birth": element.Date_of_birth,
                "phone" : element.phone,
                "city": element.city,
                "Gender": element.Gender,
                "password": element.password,
                "TimeStamp": element.year + '/' + element.month + '/' + element.day + ' ' + element.time
            }
            SQL.query(Q4, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error inserting Users data", err);
                }
                console.log("The user was successfully created");
            });
        });
    })
    res.send("Users Data successfully read");
};


//drop Users Table
const dropUsersTable = (req, res)=>{
    var Q55 = "DROP TABLE USERS";
    SQL.query(Q55, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping Users table ", err);
            res.status(400).send({message: "error in dropping Users table" + err});
            return;
        }
        console.log("Users table dropped");
        res.send("Users table dropped");
        return;
    })
}


//show Users table
const ShowUsersTable = (req,res)=>{
    var Q2 = "SELECT * FROM USERS";
    SQL.query(Q2, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Users table ", err);
            res.send("error in showing Users table ");
            return;
        }
        console.log("showing Users table");
        res.send(mySQLres);
        return;
    })
};


//create makeup artist table
const CreateMakeUpArtistTable = (req,res)=> {
    var Q3 = `CREATE TABLE IF NOT EXISTS makeUpArtists (
        email varchar(255) NOT NULL PRIMARY KEY, 
        artistName varchar(50) NOT NULL,
        phoneNumber varchar(100) NOT NULL,
        latitude float NOT NULL,
        longitude float NOT NULL,
        city varchar(255) NOT NULL, 
        yearsOfExperience real NOT NULL,
        address varchar(255) NOT NULL,
        profilePicture nvarchar(100) NOT NULL,
        study varchar(100) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q3,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating makeup artist table"});
            return;
        }
        console.log('the makeup artist table was created');
        res.send("makeup artist table was created");
        return;
    })
}



//insert DATA into makeup artist table
const insertDataIntoMakeUpArtistTable = (req,res)=>{
    var Q9 = "INSERT INTO makeUpArtists SET ?";
    const csvFilePath1= path.join(__dirname, "makeUpArtists.csv");
    csv()
    .fromFile(csvFilePath1)
    .then((jsonObj)=>{
        //console.log(jsonObj);
        jsonObj.forEach(element => {
            var NewEntry = {
                "email": element.email,
                "artistName" : element.artistName,
                "phoneNumber": element.phoneNumber,
                "latitude": element.latitude,
                "longitude": element.longitude,
                "city" :element.city,
                "yearsOfExperience" :element.yearsOfExperience,
                "address": element.address,
                "profilePicture": element.profilePicture,
                "study": element.study
            }
            SQL.query(Q9, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting DATA into makeup artist table", err);
                }
                console.log("created row  at  makeup artist table successfully ");
            });
        });
    })
    res.send("makeUpArtists Data read");
};


//show MakeUp Artists Table
const ShowMakeUpArtistsTable = (req,res)=>{
    var Q49 = "SELECT * FROM makeUpArtists";
    SQL.query(Q49, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing MakeUp Artists Table ", err);
            res.send("error in showing MakeUp Artists Table ");
            return;
        }
        console.log("showing MakeUp Artists Table");
        res.send(mySQLres);
        return;
    })
};



//drop makeup artist table
const dropMakeUpArtistTable = (req, res)=>{
    var Q56 = "DROP TABLE makeUpArtists";
    SQL.query(Q56, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping Users table ", err);
            res.status(400).send({message: "error in dropping makeup artist table" + err});
            return;
        }
        console.log("makeup artist table dropped");
        res.send("makeup artist table dropped");
        return;
    })
}


//create makeUpSpeciality for artists
const CreateMakeUpSpecialityTable = (req,res)=> {
        var Q6 = `CREATE TABLE IF NOT EXISTS makeUpSpecialitys (
        makeUpArtistEmail varchar(255) NOT NULL, 
        makeUpSpeciality varchar(100) NOT NULL,
        price int NOT NULL,
        CONSTRAINT PK_Specialit PRIMARY KEY (makeUpArtistEmail, makeUpSpeciality),
        FOREIGN KEY (makeUpArtistEmail) REFERENCES makeUpArtists (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q6,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating makeUp Speciality table"});
            return;
        }
        console.log('the makeUp Speciality table was created');
        res.send("makeUp Speciality table was created");
        return;
    })
}


//insert DATA into MakeUp Speciality Table
const insertDataIntoMakeUpSpecialityTable = (req,res)=>{
    var Q10 = "INSERT INTO makeUpSpecialitys SET ?";
    const csvFilePath1= path.join(__dirname, "makeUpSpecialitys.csv");
    csv()
    .fromFile(csvFilePath1)
    .then((jsonObj)=>{
        jsonObj.forEach(element => {
            var NewEntry = {
                "makeUpArtistEmail": element.makeUpArtistEmail,
                "makeUpSpeciality": element.makeUpSpeciality,
                "price": element.price,
            }
            SQL.query(Q10, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting DATA into MakeUp Speciality Table", err);
                }
                console.log("created row  at  MakeUp Speciality Table successfully ");
            });
        });
    })
    res.send("makeUpSpecialitys Data read");
};


//show MakeUp SpecialityTable Table
const ShowMakeUpSpecialityTable = (req,res)=>{
    var Q99 = "SELECT * FROM makeUpSpecialitys";
    SQL.query(Q99, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing MakeUp SpecialityTable Table ", err);
            res.send("error in showingMakeUp SpecialityTable Table ");
            return;
        }
        console.log("showing MakeUp SpecialityTable Table");
        res.send(mySQLres);
        return;
    })
};

//drop MakeUp Speciality Table
const dropMakeUpSpecialityTable = (req, res)=>{
    var Q59 = "DROP TABLE makeUpSpecialitys";
    SQL.query(Q59, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping makeUp Specialitys table ", err);
            res.status(400).send({message: "error in makeUp Specialitys table" + err});
            return;
        }
        console.log("makeUp Specialitys table dropped");
        res.send("makeUp Specialitys table dropped");
        return;
    })
}



//create Searches table
const createSearchesTable = (req,res)=> {
    var Q5 = `CREATE TABLE IF NOT EXISTS Searches (
        userEmail varchar(255) NOT NULL,
        city varchar(100),
        latitude float,
        longitude float,
        makeUpSpeciality varchar(100),
        uploadedOn datetime NOT NULL,
        CONSTRAINT PK_Searches PRIMARY KEY (userEmail, uploadedOn),
        FOREIGN KEY (userEmail) REFERENCES USERS (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q5,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating Searches table"});
            return;
        }
        console.log('Searches table was created');
        res.send("Searches table was created");
        return;
    })
}



//insert DATA into Searches table
const insertDataIntoSearchesTable = (req,res)=>{
    var Q11 = "INSERT INTO SEARCHES SET ?";
    const csvFilePath1= path.join(__dirname, "Searches.csv");
    csv()
    .fromFile(csvFilePath1)
    .then((jsonObj)=>{
        jsonObj.forEach(element => {
            var NewEntry = {
                "userEmail": element.userEmail,
                "city" : element.city,
                "latitude": element.latitude,
                "longitude": element.longitude,
                "makeUpSpeciality" : element.makeUpSpeciality,
                "uploadedOn": element.year + '/' + element.month + '/' + element.day + ' ' + element.time
            }
            SQL.query(Q11, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting DATA into SEARCHES Table", err);
                }
                console.log("created row  at  SEARCHES Table successfully ");
            });
        });
    })
    res.send("SEARCHES Data read");
};


//show Searches Table
const ShowSearchesTable = (req,res)=>{
    var Q99 = "SELECT * FROM SEARCHES";
    SQL.query(Q99, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing Searches Table ", err);
            res.send("error in showing Searches Table ");
            return;
        }
        console.log("showing Searches Table");
        res.send(mySQLres);
        return;
    })
};



//drop Searches Table
const dropSearchesTable = (req, res)=>{
    var Q58 = "DROP TABLE SEARCHES";
    SQL.query(Q58, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping Searches table ", err);
            res.status(400).send({message: "error in Searches table" + err});
            return;
        }
        console.log("Searches Table dropped");
        res.send("Searches Table dropped");
        return;
    })
}



//create makeUp Artist not available dates
const CreateMakeUpArtistDatesTable = (req,res)=> {
    var Q7 = `CREATE TABLE IF NOT EXISTS makeUpArtistsDates (
        makeUpArtistEmail varchar(255) NOT NULL, 
        datesNotAvailable date NOT NULL,
        CONSTRAINT PK_Specialit PRIMARY KEY (makeUpArtistEmail, datesNotAvailable),
        FOREIGN KEY (makeUpArtistEmail) REFERENCES makeUpArtists (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    SQL.query(Q7,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating makeUp Artist dates table"});
            return;
        }
        console.log('the makeUp Artist dates table was created');
        res.send("makeUp Artist dates table was created");
        return;
    })
}


//insert DATA into makeUp Artists Dates table
const insertDataIntoMakeUpArtistsDatesTable = (req,res)=>{
    var Q11 = "INSERT INTO makeUpArtistsDates SET ?";
    const csvFilePath1= path.join(__dirname, "makeUpArtistsDates.csv");
    csv()
    .fromFile(csvFilePath1)
    .then((jsonObj)=>{
        //console.log(jsonObj);
        jsonObj.forEach(element => {
            var NewEntry = {
                "makeUpArtistEmail": element.makeUpArtistEmail,
                "datesNotAvailable": element.year + '/' + element.month + '/' + element.day
            }
            SQL.query(Q11, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting DATA into makeUp Artists Dates Table", err);
                }
                console.log("created row  at makeUp Artists Dates Table successfully ");
            });
        });
    })
    res.send("makeUpArtistsDates Data read");
};


//show MakeUp Artists Dates Table
const ShowMakeUpArtistsDatesTable = (req,res)=>{
    var Q99 = "SELECT * FROM makeUpArtistsDates";
    SQL.query(Q99, (err, mySQLres)=>{
        if (err) {
            console.log("error in showingMakeUp Artists Dates Table  ", err);
            res.send("error in MakeUp Artists Dates Table  ");
            return;
        }
        console.log("showing MakeUp Artists Dates Table ");
        res.send(mySQLres);
        return;
    })
};


//drop makeUp Artists Dates Table
const dropMakeUpArtistsDatesTable = (req, res)=>{
    var Q57 = "DROP TABLE makeUpArtistsDates";
    SQL.query(Q57, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping makeUp Artists Dates table ", err);
            res.status(400).send({message: "error in makeUp Artists Dates table" + err});
            return;
        }
        console.log("makeUp Artists Dates Table dropped");
        res.send("makeUp Artists Dates Table dropped");
        return;
    })
}



module.exports = {CreateUsersTable,dropUsersTable,ShowUsersTable,CreateMakeUpArtistTable,
                  insertDataToUsersTable,createSearchesTable,CreateMakeUpSpecialityTable,
                  CreateMakeUpArtistDatesTable,insertDataIntoMakeUpArtistTable,insertDataIntoMakeUpSpecialityTable,
                  insertDataIntoSearchesTable,insertDataIntoMakeUpArtistsDatesTable,dropMakeUpArtistTable,dropSearchesTable,
                  dropMakeUpSpecialityTable,dropMakeUpArtistsDatesTable,ShowMakeUpArtistsTable,ShowMakeUpSpecialityTable,
                  ShowMakeUpArtistsDatesTable,ShowSearchesTable};

