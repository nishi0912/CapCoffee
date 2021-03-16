require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require("ejs");

const ejsLint  = require("ejs-lint");
const https = require("https");
const _ = require("lodash");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require("mongoose-findorcreate");


// body parser is deprecated , so we are using the express module in which body-parser
app.use(express.urlencoded({extended:true}));
//    was present

app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(new session({
secret : "This is my coffee.",
saveUninitialized : false,
resave:false
}));

app.use(passport.initialize());
app.use(passport.session());

// -------------------userDB------------------------------
// const localUrl ="mongodb://localhost:27017/CoffeeDB";
const url  = process.env.MONGO_URI ;
mongoose.connect(url , {useNewUrlParser : true , useUnifiedTopology:true , useCreateIndex : true});


const userSchema = new mongoose.Schema({
username:String,
email :String,
password : String,
location:String,
googleId:String,
facebookId:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User" , userSchema);
// -------------------------------------------------------

// --------------------Cart-items-------------------------
const cartSchema =new mongoose.Schema({
orderId : String,
itemname : String,
price:String
});

const Cart = mongoose.model("Cart" , cartSchema);
// -------------------------------------------------------

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
    done(err, user);
    });
});


let cartItem = "";
let itemId = "";
let cartItems = [{
Item:"Empty",
Id : "0",
price:"0"
}];

let itemPrice="";

let temperature = "";
let tempInCelsius = "";
let description = "";
let place = "";

let resetEmail = "";

passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URI,
    userProfileURL : "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken , refreshToken , profile , cb){
    User.findOrCreate({googleId : profile.id , name : profile.displayName} , function(err , user){
        return cb(err , user);
    });
    }
    ));
    
passport.use(new FacebookStrategy({
    clientID : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL : process.env.FACEBOOK_CALLBACK_URI
    },
    function(accessToken , refreshToken , profile , cb){
        User.findOrCreate({facebookId : profile.id} , function(err , user){
        return cb(err , user);
        });
    }
));


app.get("/",function(req , res){
res.sendFile(__dirname+"/Home.html");
});

app.get("/signup" , function(req , res){
res.sendFile(__dirname + "/signup.html");
});

app.get("/Login",function(req , res){
    if(req.isAuthenticated()){
        res.render("login");
    }else{
        res.redirect("/signup");
    }
});

ejsLint("cart"); 

app.post("/login" , function(req , res){

const user1 = new User({
username : req.body.username,
email:req.body.email,
location:req.body.city
});


User.register({username : req.body.username,email : req.body.email , location:req.body.city},req.body.password,function(err){
if(err){
    console.log(err);
    res.redirect("/signup");
}else{
passport.authenticate("local")(req, res , function(){
    let password =  req.body.password;
    let passwordLength = password.length;
    if(passwordLength >= 6 && passwordLength <= 12){
        user1.save(function(err){
            res.render("login");
        });
    }else if(passwordLength < 6){
        res.render("Failure",{Message : "More"});
    }else if(passwordLength  > 12)
        {
        res.render("Failure",{Message : "Less"});
    }
});
}
});

});

app.get("/finalCoffeeproject",function(req , res){  
        if(req.isAuthenticated()){
            res.render("finalCoffeeproject",{Temperature : tempInCelsius , Description : description , Place : place});
    }
});

app.post("/previouspage" , (req , res)=>{
    let getmsg = req.body.home;
    res.render("finalCoffeeproject",{Temperature : tempInCelsius , Description : description , Place : place,Message:"",Robot:""});
});

app.post("/finalCoffeeproject" , function(req , res){
    
    const newUser = new User({
        username:req.body.User,
        password:req.body.userPassword
    });

    // console.log(newUser);
    req.logIn(newUser , function(err){
        if(err){
            console.log(err);
        }else{
            console.log("req success");
            // passport.authenticate("local")(req, res , function(){

            // });

            
                User.findOne({username : req.body.User} , function(err , foundUser){
                    console.log(foundUser.location);
            const url ="https://api.openweathermap.org/data/2.5/weather?q="+foundUser.location+"&appid=86ec7a4a847d69237bdbbc7be5505c71" ;
                    
            https.get(url , function(response){
            console.log(response.statusCode);

            response.on("data",function(data){

                const weatherData = JSON.parse(data);
                temperature = weatherData.main.temp;
                tempInCelsius = ((temperature) - 273.15).toFixed(0);
                description = _.capitalize(weatherData.weather[0].description);
                place = weatherData.name;
                setTimeout(() => {
                res.render("finalCoffeeproject",{Temperature : tempInCelsius , Description : description , Place : place,Message:"",Robot:""});
                }, 5000);
            });
    });   
            });
        }
    });
    
    //     res.render("Failure",{Message : ""});
    //     console.log("Incorrect credentials.");
    //         }
    // });

});


app.get("/Failure",function(req , res){
    res.render("login");
});

app.post("/Failure",function(req , res){
    const result = req.body.result;
    if(req.body.result === "reenter"){
        res.sendFile(__dirname+"/signup.html");
    }
});

app.get("/logout",function(req , res){
    setTimeout(() => {
        res.render("login");
    }, 10000);
});


app.get("/order",function(req ,res){
    res.send("Your order is been processed");
});

app.post("/order",(req , res)=>{
const noOfItems =  req.body.nItem;

if(noOfItems === ""){
    res.send("Please enter the quantity of items.");
}else if(noOfItems > 10){
res.send("The maximum number of orders for this item is 10.");
}else{
    res.send(noOfItems + " orders been placed for this item.");
}
});

app.get("/cart",function(req ,res){
    setTimeout(() => {
    Cart.find({} , (err , foundcarts)=>{
    res.render("cart",{yourcart : foundcarts});
    }); 
    },5000);
});

app.post("/cart",function(req ,res){
const Name = req.body.remove;
if(Name === "delete"){
console.log("Go on and delete");

const deletedItem = req.body.delete;
Cart.find({} , (err , foundcarts)=>{
    Cart.findByIdAndRemove(deletedItem ,{useFindAndModify:false} , function(err){
        if(!err){
            setTimeout(() => {
                console.log("Deleting from database");
                res.redirect("/cart");
            }, 2000); 
        }
        });

});

// let itemDeleted = _.remove(cartItems , (items)=>{
// return items.Item == deletedItem;
// });

// console.log(itemDeleted);
console.log("Deleting....");


}else{
    console.log("Go on an add");
    cartItem = req.body.itemordered;
    itemId = req.body.Itemid;
    itemPrice = req.body.Itemprice;

    const carts =new Cart({
        orderId : itemId,
        itemname : cartItem,
        price:itemPrice 
        });

    Cart.find({},function(err , foundCarts){
        if(foundCarts.length === 0){
            carts.save();
            console.log(carts);
            console.log("Adding....");
            cartItems.push({Item : carts.itemname, Id :carts.orderId, Price:carts.price}); 
            res.render("cart" , { yourcart : cartItems});
        }else{
            Cart.find({} , (err , foundcarts)=>{
                carts.save();
                cartItems.push({Item : carts.itemname, Id :carts.orderId, Price:carts.price}); 
                res.redirect("/cart");
            });
        }
    });
}
});

// app.post("/cart/remove" , (req , res)=>{

// });

app.get("/forgot",function(req , res){
res.render("forgot");
});

app.get("/more",function(req , res){
    res.render("more");
    });
    
app.post("/chat" , (req , res)=>{
    let robot="";
const message = req.body.usermessage;
if(message ==="Hi" || message === "Hello"|| message==="Test"){
    robot = "Welcome to our chat.";
}else if(message === ""){
    robot = "Empty";
}
res.render("finalCoffeeproject",{Temperature : tempInCelsius , Description : description , Place : place,Message:message,Robot:robot});
console.log(message);
});

app.post("/flavors",function(req , res){
    const flavoursInfo = req.body.flavourInfo;
    res.render("flavors" ,{ getInfo : flavoursInfo });
});

app.post("/re-enter", function(req , res){
resetEmail = req.body.resetEmail;
if(email === resetEmail){
    res.render("re-enter");
}
});


app.post("/cafecoffeeintro" , function(req , res){
res.render("cafecoffeeintro");
});

app.get("/auth/google",passport.authenticate("google",{scope:['profile']}));

app.get("/auth/facebook",passport.authenticate("facebook",{scope:['public_profile']}));

app.get("/auth/google/finalCoffeeproject",
passport.authenticate("google",{failureRedirect:"/login"}),
function(req ,res){
    res.redirect("/finalCoffeeproject");
});

app.get("/auth/facebook/finalCoffeeproject",
    passport.authenticate("facebook",{failureRedirect:"/login"}),
    function(req ,res){
        res.redirect("/finalCoffeeproject");
    });

app.listen(process.env.PORT || 3000 , function(){
console.log("Server has started at port 3000");
});