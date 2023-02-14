//all the modules import
var http = require('http');
const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const sql = require('./db/db');
const port = 3000;
const createDB = require('./db/createDB');
const CRUD_f = require("./db/CRUD_functions");
const CSVToJSON = require('csvtojson');
const {findMakeupArtist} = require("./db/CRUD_functions");



//setup
app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "pug"); // PUG setting up (view engine)
app.use(express.static(path.join(__dirname, "public/static")));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));


// setup session & cookie
app.use(cookieParser());
app.use(session({
    secret: 'zsdrtcfgyujnjkoiuytyhb',
    resave: false,
    saveUninitialized: false
}));

app.use(function (req, res, next) {
    res.locals.isAuthenticared = req.session.userid;
    next();
})


//listen
app.listen(port, ()=>{
    console.log("server is running on port " + port);
});


//routs
app.get('/', (req, res) => {
  res.redirect('home-page');
});

app.get('/home-page' , (req, res)=>{
    res.render('home-page',{ title: 'Home' });
});

app.get('/about-us' , (req, res)=>{
    res.render('about-us', { title: 'About-Us' });
});

app.get('/search' , (req, res)=>{
    res.render('search',{ title: 'Search' });
});

app.get('/signup', (req, res) =>{
  res.render('signup', { title: 'Signup' });
});


app.get('/profile', async (req, res, next) =>  {
    let email = req.query.userid;
    let p = await CRUD_f.getMakeupArtistByEmail(email)
    console.log(p);
    if (p === null) {
        res.status(404).send("Artist doesn't exist");
        return;
    }
    res.render('profile', { title: 'Profile', artist: p });
});


app.get('/login', (req, res, next) =>{
  res.render('login', { title: 'login' });
});

app.get('/logout', (req, res, next) =>{
    req.session.destroy()
  res.redirect('/');
});


//get and post
app.post('/newUser', CRUD_f.createNewUser);
app.get("/findUser", CRUD_f.findUser);
app.post('/search' ,CRUD_f.findMakeupArtist);
app.post('/bookMakeUp' ,CRUD_f.checkAvailableDateByMakeUpArtist);


//create DB tables
app.get("/createUserTable", createDB.CreateUsersTable);
app.get("/CreateMakeUpArtistTable", createDB.CreateMakeUpArtistTable);
app.get("/createSearchesTable", createDB.createSearchesTable);
app.get("/CreateMakeUpSpecialityTable", createDB.CreateMakeUpSpecialityTable);
app.get("/CreateMakeUpArtistDatesTable", createDB.CreateMakeUpArtistDatesTable);


//insert into DB tables
app.get("/insertDataToUsersTable", createDB.insertDataToUsersTable);
app.get("/insertDataIntoMakeUpArtistTable", createDB.insertDataIntoMakeUpArtistTable);
app.get("/insertDataIntoSearchesTable", createDB.insertDataIntoSearchesTable);
app.get("/insertDataIntoMakeUpSpecialityTable", createDB.insertDataIntoMakeUpSpecialityTable);
app.get("/insertDataIntoMakeUpArtistsDatesTable", createDB.insertDataIntoMakeUpArtistsDatesTable);


//drop DB tables
app.get('/dropMakeUpArtistsDatesTable', createDB.dropMakeUpArtistsDatesTable);
app.get('/dropMakeUpSpecialityTable', createDB.dropMakeUpSpecialityTable);
app.get('/dropSearchesTable', createDB.dropSearchesTable);
app.get('/dropMakeUpArtistTable', createDB.dropMakeUpArtistTable);
app.get('/dropUsersTable', createDB.dropUsersTable);


//show DB tables
app.get("/ShowUsersTable", createDB.ShowUsersTable);
app.get("/ShowMakeUpArtistsTable", createDB.ShowMakeUpArtistsTable);
app.get("/ShowMakeUpSpecialityTable", createDB.ShowMakeUpSpecialityTable);
app.get("/ShowMakeUpArtistsDatesTable", createDB.ShowMakeUpArtistsDatesTable);
app.get("/ShowSearchesTable", createDB.ShowSearchesTable);



