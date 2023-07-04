const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const DBconn = require("./db");
const User = require("./Models/userModel");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    key: "random",
    secret: "random_user",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

// Route for Home-Page
app.get("/", (req, res) => {
  if (req.session.user && req.cookies.random) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

// Route for user Login
app.route("/login").get((req, res) => {
  if (req.session.user && req.cookies.random) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(__dirname + "/Public/login.html");
  }
}).post(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username }).exec();

  if (!user) {
    res.redirect("/login");
    return;
  }

  try {
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      req.session.user = user;
      res.redirect("/dashboard");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});


// Route for user signup
app
  .route("/signup")
  .get((req, res) => {
    if (req.session.user && req.cookies.random) {
      res.redirect("/dashboard");
    } else {
      res.sendFile(__dirname + "/Public/signup.html");
    }
  })
  .post(async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    try {
      const newUser = await user.save();
      req.session.user = newUser;
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/signup");
    }
  });

// Route for user dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user && req.cookies.random) {
    res.sendFile(__dirname + "/Public/dashboard.html");
  } else {
    res.redirect("/login");
  }
});


// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.random) {
    res.clearCookie("random");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

DBconn();
