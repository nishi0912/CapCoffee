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



app.use(bodyParser.urlencoded({extended:true}));
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
price:Number
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
Id : "0"
}];

let temperature = "";
let tempInCelsius = "";
let description = "";
let place = "";

let resetEmail = "";

passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : "https://dry-brushlands-61318.herokuapp.com/auth/google/finalCoffeeproject",
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
    callbackURL : "http://localhost:3000/auth/facebook/finalCoffeeproject"
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
                res.render("finalCoffeeproject",{Temperature : tempInCelsius , Description : description , Place : place});
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

app.get("/finalCoffeeproject",function(req , res){
    if(req.isAuthenticated()){
        res.render("finalCoffeeproject",{Temperature : tempInCelsius , Description : description , Place : place});
    }
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
res.render("login");
});

app.get("/cart",function(req ,res){
res.render("cart",{yourcart : cartItems});
});

app.post("/cart",function(req ,res){
const Name = req.body.remove;
if(Name === "delete"){
console.log("Go on and delete");

const deletedItem = req.body.delete;

// console.log(Name);
// console.log(deletedItem);

let itemDeleted = _.remove(cartItems , (items)=>{
return items.Item == deletedItem;
});
console.log(itemDeleted);
console.log("Deleting....");
setTimeout(() => {
    res.redirect("/cart");
}, 2000);

}else{
    console.log("Go on an add");
    cartItem = req.body.itemordered;
    itemId = req.body.Itemid;
    console.log("Adding....");
    cartItems.push({Item : cartItem , Id : itemId});
        res.render("cart" , { yourcart : cartItems}); 
}
});

app.post("/cart/remove" , (req , res)=>{

});

app.get("/forgot",function(req , res){
res.render("forgot");
});

app.get("/more",function(req , res){
    res.render("more");
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