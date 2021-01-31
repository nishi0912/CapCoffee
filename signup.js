const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

let firstname = " ";
let lastname = " ";
let email = " ";
let username = " ";
let password = " ";

let cartItem="";
let cartItems = ['empty'];

let User = "";
let userPassword = "";

app.use(express.static("public"));

app.get("/",function(req , res){
res.sendFile(__dirname+"/Home.html");
});

app.get("/signup" , function(req , res){
res.sendFile(__dirname + "/signup.html");
});


app.post("/login" , function(req , res){
firstname =  req.body.firstname;
lastname = req.body.lastname;
username = req.body.username;
email = req.body.email;
password = req.body.password;
console.log(firstname +" , "+ lastname  +" , "+ username  +" , "+ email  +" , "+ password);
res.render("login");
});

app.post("/finalCoffeeproject" , function(req , res){
    User = req.body.User;
    userPassword = req.body.userPassword;
    console.log(User +" , "+ userPassword);
    console.log(firstname +" , "+ lastname  +" , "+ username  +" , "+ email  +" , "+ password);
    if(username === User && password === userPassword){
        res.render("finalCoffeeproject");
        }
    else{
    res.render("Failure");
    console.log("Incorrect credentials.");
        }
});

app.post("/Failure",function(req , res){
    console.log(req.body.result);
    res.render("login");
});

app.get("/logout",function(req , res){
res.render("login");
});

app.post("/cart",function(req ,res){
cartItem = req.body.items;
cartItems.push(cartItem);
res.render("cart" , { yourcart : cartItems});
console.log(cartItems);
});


app.get("/cafecoffeeintro" , function(req , res){
res.render("cafecoffeeintro");
});

app.listen(process.env.PORT || 3000 , function(){
console.log("Server has started at port 3000");
});