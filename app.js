const express = require('express');
const app = express();
const connectDB = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Connect to MongoDB
connectDB();

const userModel = require('./models/user');

const cookieParser = require('cookie-parser');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req , res) => {
    res.render('index');
});

// Show signup (create account) page
app.get('/create', (req, res) => {
    res.render('index'); // make sure you have views/create.ejs
});

// Show login page
app.get('/login', (req, res) => {
    res.render('login'); // make sure you have views/login.ejs
});

app.post('/create', async (req, res) => {
    try {
        const { username, email, password, age } = req.body;

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user with the hashed password
        const user = await userModel.create({ username, email, password: hashedPassword, age });
        let token = jwt.sign({email : user.email} , "mmmmmmmmm");
        res.cookie("token" , token);
        // Redirect to the home page after successful creation
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

app.post("/login", async function(req, res){
    let user = await userModel.findOne({email : req.body.email});
    if(!user) return res.send("something is wrong");   //dont tell no user found else malicious user can find which email is registered
    
    bcrypt.compare(req.body.password, user.password , function(err, result){
        console.log(result);
        if(result){
            let token = jwt.sign({email} , "mmmmmmmmm");
            res.cookie("token" , token);
            res.send("yes you can login");
        }
        else res.send("no you can't login");
    })
    console.log(user.password, req.body.password);
    // res.render("login");
});

app.get("/logout", function(req, res){   //post = server is getting change //get = no changes in the server
    res.cookie("token", "");
    res.redirect("/");
})
app.listen(3000);