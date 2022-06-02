require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require("ejs");

const ejsLint = require("ejs-lint");
const https = require("https");
const _ = require("lodash");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require("mongoose-findorcreate");
const { Passport } = require("passport");
const { runInNewContext } = require("vm");

// body parser is deprecated , so we are using the express module in which body-parser
app.use(express.urlencoded({ extended: true }));
//    was present

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  new session({
    secret: "This is my coffee.",
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// -------------------userDB------------------------------
// const localUrl ="mongodb://localhost:27017/CoffeeDB";
const url = process.env.MONGO_URI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  location: String,
  googleId: String,
  facebookId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
// -------------------------------------------------------

// --------------------Cart-items-------------------------
const cartSchema = new mongoose.Schema({
  orderId: String,
  likes: String,
  itemname: String,
  price: String,
  updatedprice: String,
  quantity: String,
});

const Cart = mongoose.model("Cart", cartSchema);
// -------------------------------------------------------

// --------------Reset Schema ---------------
const resetSchema = new mongoose.Schema({
  username: String,
  password: String,
});

resetSchema.plugin(passportLocalMongoose);
resetSchema.plugin(findOrCreate);

const Reset = mongoose.model("Reset", resetSchema);
// ------------------------------------------
const currentSchema = new mongoose.Schema({
  username: String,
});
const Current = mongoose.model("Current", currentSchema);
// ------------------------------------------
const questionSchema = new mongoose.Schema({
  item: { itemname: String, question: String },
});

const Question = mongoose.model("Questions", questionSchema);
// ------------------------------------------
passport.use(User.createStrategy());
passport.use(Reset.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

let cartItem = "";
let itemId = "";
let cartItems = [
  {
    Item: "Empty",
    Id: "0",
    price: "0",
  },
];

let itemPrice = "";
let Likes = "";

let temperature = "";
let tempInCelsius = "";
let description = "";
let place = "";
let icon = "";
let imageURL = "";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        { googleId: profile.id, name: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URI,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

let currentuser = "";

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/Home.html");
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/Login", function (req, res) {
  res.render("login", {
    registeredPassword: "",
    isreg: "true",
    NewLocation: "",
  });
});

ejsLint("cart");

app.post("/login", function (req, res) {
  let alreadyRegistered = req.body.Already;
  let Newone = req.body.newLocation;

  const user1 = new User({
    username: req.body.username,
    email: req.body.email,
    location: req.body.city,
  });

  if (alreadyRegistered) {
    res.render("login", {
      registeredPassword: alreadyRegistered,
      isreg: "true",
      NewLocation: Newone,
    });
  } else if (!alreadyRegistered) {
    User.register(
      {
        username: req.body.username,
        email: req.body.email,
        location: req.body.city,
      },
      req.body.password,
      function (err) {
        if (err) {
          console.log(err);
          setTimeout(() => {
            res.render("Failure", {
              Message: "signedIn",
              already: req.body.password,
              NewLocation: req.body.city,
            });
          }, 2000);
        } else {
          passport.authenticate("local", (err, user, info) => {
            let password = req.body.password;
            let passwordLength = password.length;
            if (passwordLength >= 6 && passwordLength <= 12) {
              user1.save(function (err) {
                res.render("login", {
                  registeredPassword: req.body.password,
                  isreg: "true",
                  NewLocation: req.body.city,
                });
              });
            } else if (passwordLength < 6) {
              res.render("Failure", { Message: "More" });
            } else if (passwordLength > 12) {
              res.render("Failure", { Message: "Less" });
            }
          })(req, res);
        }
      }
    );
  }
});

app.post("/previouspage", (req, res) => {
  let getmsg = req.body.home;
  res.redirect("/finalCoffeeproject");
});

// Current.find({}, (err, foundCurrent) => {
//   if (foundCurrent.length === 0) {
//     console.log("No current user");
//   } else {
//     currentuser = foundCurrent[0].username;
//     console.log("Current User - " + currentuser);
//   }
// });

let already_added = { itemname: String, isAdded: String };
app.get("/finalCoffeeproject", function (req, res) {
  setTimeout(() => {
    Cart.find({}, (err, foundCarts) => {
      res.render("finalCoffeeproject", {
        Temperature: tempInCelsius,
        Description: description,
        Image: imageURL,
        Place: place,
        Message: _.capitalize(currentuser),
        Robot: "",
        Logout: "false",
        cartnumber: foundCarts.length,
        Already_added: already_added,
      });
    });
  }, 2000);
});

app.post("/finalCoffeeproject", function (req, res) {
  const RegisteredPassword = req.body.registeredpassword;
  const Logout = req.body.logoutpass;
  const NewLocation = req.body.NewLocation;
  const Re_locate = req.body.reLocate;
  if (Re_locate) {
    console.log(Re_locate);
  }

  const newUser = new User({
    username: req.body.User,
    password: req.body.userPassword,
  });

  User.find({ username: req.body.User }, function (err, foundUser) {
    console
    foundUser === ""
      ? res.render("login", { isreg: "false" })
      : (RegisteredPassword === req.body.userPassword &&
          foundUser[0].username === req.body.User) ||
        (Logout === req.body.userPassword &&
          foundUser[0].username === req.body.User) ||
        foundUser[0].username === req.body.User
      ? req.logIn(newUser, function (err) {
          if (err) {
            console.log(err);
          } else {
            passport.authenticate("local", (err, user, info) => {
              let current = "";
              if (!Re_locate) {
                NewLocation.length === 0
                  ? (current = foundUser[0].location)
                  : (current = NewLocation);
              } else {
                Re_locate.length === 0
                  ? (current = foundUser[0].location)
                  : (current = Re_locate);
              }
              const url =
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                current +
                "&appid=86ec7a4a847d69237bdbbc7be5505c71";

              https.get(url, function (response, err) {
                if (!err) {
                  if (response.statusCode === 200) {
                    response.on("data", function (data) {
                      const weatherData = JSON.parse(data);
                      icon = weatherData.weather[0].icon;
                      imageURL =
                        "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                      temperature = weatherData.main.temp;
                      tempInCelsius = (temperature - 273.15).toFixed(0);
                      description = _.capitalize(
                        weatherData.weather[0].description
                      );
                      place = weatherData.name;

                      if (req.isAuthenticated()) {
                        Current.find({}, (err, foundCurrent) => {
                          if (!err) {
                            if (foundCurrent.length === 0) {
                              const new_current = new Current({
                                username: req.user.username,
                              });
                              new_current.save();
                              currentuser = req.user.username;
                            }
                          }
                        });
                        setTimeout(() => {
                          Cart.find({}, (err, foundCarts) => {
                            res.render("finalCoffeeproject", {
                              Temperature: tempInCelsius,
                              Description: description,
                              Image: imageURL,
                              Place: place,
                              Message: _.upperCase(currentuser),
                              Robot: "",
                              Logout: RegisteredPassword,
                              cartnumber: foundCarts.length,
                              Already_added: already_added,
                            });
                          });
                        }, 5000);
                      }
                    });
                  } else {
                    res.render("login", {
                      registeredPassword: req.body.userPassword,
                      isreg: "Re-locate",
                      NewLocation: "",
                    });
                  }
                }
              });
            })(req, res);
          }
        })
      : res.render("login", { isreg: "false" });
  });
});

app.get("/Failure", function (req, res) {
  res.render("login", { isreg: "false" });
});

app.post("/Failure", function (req, res) {
  const result = req.body.result;
  if (req.body.result === "reenter") {
    res.sendFile(__dirname + "/signup.html");
  }
});

let flavoursInfo = "";

app.get("/flavors", (req, res) => {
  setTimeout(() => {
    Question.find({}, (err, foundQuestions) => {
      if (foundQuestions.length === 0) {
        res.render("flavors", {
          getInfo: flavoursInfo,
          questions: foundQuestions,
        });
      } else {
        res.render("flavors", {
          getInfo: flavoursInfo,
          questions: foundQuestions,
        });
      }
    });
  }, 2000);
});

app.post("/flavors", function (req, res) {
  if (req.body.hidden_flavorsInfo) {
    flavoursInfo = req.body.hidden_flavorsInfo;
    const newquestion = new Question({
      item: { itemname: flavoursInfo, question: req.body.questions },
    });
    Question.find({}, (err, foundQuestions) => {
      if (foundQuestions.length === 0) {
        newquestion.save((err) => {
          if (!err) {
            res.redirect("/flavors");
          }
        });
      } else {
        newquestion.save((err) => {
          if (!err) {
            res.redirect("/flavors");
          }
        });
      }
    });
  } else if (req.body.flavourInfo) {
    flavoursInfo = req.body.flavourInfo;
    res.redirect("/flavors");
  } else if (req.body.delete_question === "delete_question") {
    const hidden_id = req.body.hidden_questionid;
    Question.find({ _id: hidden_id }, (err, foundId) => {
      if (!err) {
        Question.deleteOne({ _id: hidden_id }, (err) => {
          if (!err) {
            res.redirect("/flavors");
          }
        });
      }
    });
  } else {
    console.log("Edit your question");
  }
});

app.get("/order", function (req, res) {
  res.send("Your order is been processed");
});

let moreorders = "";

app.post("/order", (req, res) => {
  let noOfItems = req.body.nItem;
  moreorders = noOfItems;
  const orders = req.body.orderplaced;

  if (noOfItems === "") {
    res.redirect("/flavors");
  } else if (noOfItems > 10) {
    res.redirect("/flavors");
  } else {
    Cart.find({ itemname: orders }, (err, foundorders) => {
      Cart.updateOne({}, (err) => {
        foundorders[0].quantity = noOfItems;
        foundorders[0].updatedprice =
          "$" + foundorders[0].price.replace("$", "") * noOfItems;
      });
      foundorders[0].save((err) => {
        if (!err) {
          console.log("New order -");
          console.log(foundorders);
        }
      });
      res.redirect("/cart");
    });
  }
});

app.get("/cart", function (req, res) {
  setTimeout(() => {
    Cart.find({}, (err, foundcarts) => {
      res.render("cart", { yourcart: foundcarts });
    }).sort({ itemname: 1 });
  }, 3000);
});

app.post("/cart", function (req, res) {
  const Name = req.body.remove;
  if (Name === "delete") {
    console.log("Go on and delete");

    const deletedItem = req.body.delete;
    Cart.find({}, (err, foundcarts) => {
      Cart.findByIdAndRemove(
        deletedItem,
        { useFindAndModify: false },
        function (err) {
          if (!err) {
            setTimeout(() => {
              console.log("Deleting from database");
              res.redirect("/cart");
            }, 1000);
          }
        }
      );
    });

    console.log("Deleting....");
  } else if (Name === liked) {
    console.log("Liked");
  } else {
    console.log("Go on an add");
    cartItem = req.body.itemordered;
    itemId = req.body.Itemid;
    itemPrice = req.body.Itemprice;

    const carts = new Cart({
      orderId: itemId,
      likes: Likes,
      itemname: cartItem,
      price: itemPrice,
      updatedprice: itemPrice,
    });

    Cart.find({}, function (err, foundCarts) {
      if (foundCarts.length === 0) {
        carts.save();
        cartItems.push({
          Item: carts.itemname,
          Id: carts.orderId,
          Price: carts.updatedprice,
          Likes: carts.likes,
        });
        res.render("cart", { yourcart: cartItems });
      } else {
        Cart.find({}, (err, foundcarts) => {
          let isPresent = false;
          let presentItem = "";
          for (let i = 0; i < foundcarts.length; i++) {
            console.log("Two items - ", cartItem, foundcarts[i].itemname);
            if (cartItem === foundcarts[i].itemname) {
              isPresent = true;
              presentItem = foundcarts[i].itemname;
              break;
            } else {
              isPresent = false;
            }
          }
          if (isPresent === true) {
            already_added = {
              itemname: presentItem,
              isAdded: true,
            };
            console.log("Already added to cart");
            res.redirect("/finalCoffeeproject");
          } else {
            console.log("Not added to cart");
            carts.save();
            cartItems.push({
              Item: carts.itemname,
              Id: carts.orderId,
              Price: carts.updatedprice,
            });
            res.redirect("/cart");
          }
        });
      }
    });
  }
});

app.get("/logout", function (req, res) {
  setTimeout(() => {
    res.render("login", { isreg: "false" });
  }, 10000);
});

app.post("/logout", function (req, res) {
  const logoutPass = req.body.Logout;
  Current.find({}, (err, foundCurrent) => {
    Current.deleteMany({}, (err) => {
      console.log("Deleted current user");
    });
  });
  res.render("login", {
    isreg: "logback",
    Logout: logoutPass,
    NewLocation: "",
  });
});

app.get("/forgot", function (req, res) {
  res.render("forgot");
});

app.post("/re-enter", function (req, res) {
  let Reset = req.body.resetEmail;
  console.log("Re-entered - " + Reset);
  User.findOne({ email: Reset }, (err, foundEmail) => {
    if (foundEmail) {
      checked = true;
      res.render("re-enter", { usermail: Reset });
    } else {
      checked = false;
      res.redirect("/forgot");
    }
  });
});

app.post("/cafecoffeeintro", function (req, res) {
  const first = req.body.firstpassword;
  const second = req.body.secondpassword;
  const UserMail = req.body.newmail;
  if (first === second) {
    const reset1 = new Reset({
      username: "",
      password: second,
    });
    Reset.register({ username: UserMail }, req.body.secondpassword, (err) => {
      if (err) {
        console.log(err);
      } else {
        User.updateOne(
          { password: req.body.secondpassword },
          { useFindAndModify: false },
          (err, foundResults) => {
            console.log(foundResults[0]);
          }
        );
      }
    });
  }
  res.render("cafecoffeeintro");
});

app.get("/more", function (req, res) {
  res.render("more");
});

app.post("/chat", (req, res) => {
  let robot = "";
  const message = req.body.usermessage;
  if (message === "Hi" || message === "Hello" || message === "Test") {
    robot = "Welcome to our chat.";
  } else if (message === "") {
    robot = "Empty";
  }
  const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  res.render("finalCoffeeproject", {
    Temperature: tempInCelsius,
    Description: description,
    Image: imageURL,
    Place: place,
    Message: message,
    Robot: robot,
    Logout: "false",
  });
  console.log(message);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] })
);

app.get(
  "/auth/google/finalCoffeeproject",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/finalCoffeeproject");
  }
);

app.get(
  "/auth/facebook/finalCoffeeproject",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/finalCoffeeproject");
  }
);

app.listen(process.env.PORT || 3000, function () {
  console.log("Server has started at port 3000");
});
