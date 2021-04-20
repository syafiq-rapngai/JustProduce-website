require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const nodemailer = require("nodemailer");
const fs = require("fs");
const crypto = require("crypto");
const expressSanitizer = require("express-sanitizer");
const fetch = require("isomorphic-fetch");

const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
  next();
});
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "*.facebook.com"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "*.elfsight.com",
        "www.googletagmanager.com",
        "*.google-analytics.com",
        "*.google.com",
        "*.facebook.net",
        "*.gstatic.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "*.typekit.net",
        "fonts.googleapis.com",
      ],
      connectSrc: [
        "'self'",
        "*.elfsight.com",
        "*.google-analytics.com",
        "*.doubleclick.net",
        "*.instacloud.io",
      ],
      frameSrc: ["*.facebook.com", "*.google.com", "*.doubleclick.net"],
      fontSrc: ["'self'", "*.typekit.net", "*.gstatic.com"],
      imgSrc: [
        "'self'",
        "data:",
        "*.google-analytics.com",
        "*.google.com",
        "*.google.com.sg",
        "*.facebook.com",
        "*.cdninstagram.com",
        "www.googletagmanager.com",
        "*",
      ],
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(expressSanitizer());

// --------------------------------Models----------------------------------------------------
var Product = require("./models/products");
var Subscriber = require("./models/subscriber");

// --------------------------------Functions--------------------------------------------------

var pad = (n, width) => {
  z = "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

var sendMail = (data) => {
  fs.readFile(__dirname + "/views/email.html", function (err, html) {
    if (err) throw err;

    html = html.toString();
    html = html.replace("{{date}}", data["date"]);
    html = html.replace("{{order_no}}", data["ref_no"]);
    html = html.replace("{{total_amount}}", data["total_amount"]);
    html = html.replace("{{name}}", data["name"]);
    html = html.replace("{{email}}", data["email"]);
    html = html.replace("{{contact}}", data["contact"]);

    html = html.replace("{{JM_Qty}}", data["just_mesclun"]);
    html = html.replace("{{JM_M1_Qty}}", data["just_mesclun_mustard"]);
    html = html.replace("{{JM_S_Qty}}", data["just_mesclun_sorrel"]);
    html = html.replace("{{JM_M2_Qty}}", data["just_mesclun_mizuna"]);

    html = html.replace("{{JM_Price}}", data["just_mesclun_price"]);
    html = html.replace("{{JM_M1_Price}}", data["just_mesclun_mustard_price"]);
    html = html.replace("{{JM_S_Price}}", data["just_mesclun_sorrel_price"]);
    html = html.replace("{{JM_M2_Price}}", data["just_mesclun_mizuna_price"]);

    html = html.replace("{{JM_Total}}", data["just_mesclun_total"]);
    html = html.replace("{{JM_M1_Total}}", data["just_mesclun_mustard_total"]);
    html = html.replace("{{JM_S_Total}}", data["just_mesclun_sorrel_total"]);
    html = html.replace("{{JM_M2_Total}}", data["just_mesclun_mizuna_total"]);

    mailOptions["subject"] = "Order Confirmation: " + data["ref_no"];
    mailOptions["to"] = data["email"];
    mailOptions["html"] = html;

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

var sendInquiry = (data) => {
  fs.readFile(__dirname + "/views/inquiry.html", function (err, html) {
    if (err) throw err;

    html = html.toString();
    html = html.replace("{{name}}", data["name"]);
    html = html.replace("{{coyname}}", data["coyname"]);
    html = html.replace("{{email}}", data["email"]);
    html = html.replace("{{phone}}", data["phone"]);
    html = html.replace("{{inquiry}}", data["inquiry"]);

    mailOptions["subject"] = "Inquiry from " + data["email"];
    mailOptions["to"] = "syafiq@archisen.com";
    mailOptions["html"] = html;

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

//--------------------------------------------------------------------------------------------

//------------------------------------Email---------------------------------------------------

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  port: 465,
  secure: true,
});

var mailOptions = {
  from: "sales@justproduce.sg",
};

// -------------------------------------------------------------------------------------------

var mongoURL = process.env.DB_HOST;

mongoose.connect(
  mongoURL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log(err);
    else {
      app.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
      });
    }
  }
);

app.get("/", (req, res) => {
  Product.find({}, null, { sort: { order: 1 } }, (err, results) => {
    if (err) return console.log(err);
    // renders index.ejs
    res.render("pages/index.ejs", {
      products: results,
      title: "Get your Fresh, Healthy Salads in Singapore | Just Produce",
    });
  });
});

app.get("/about", (req, res) => {
  // renders about.ejs
  res.render("pages/about.ejs", { title: "Get to know us | Just Produce" });
});

app.get("/contact-us", (req, res) => {
  // renders contact.ejs
  res.render("pages/contact.ejs", {
    title: "Get in touch with us | Just Produce",
  });
});

app.get("/where-to-buy", (req, res) => {
  // renders wheretobuy.ejs
  res.render("pages/where-to-buy.ejs", {
    title: "Buy your tasty salad boxes here | Just Produce",
  });
});

app.get("/products", (req, res) => {
  Product.find({}, null, { sort: { order: 1 } }, (err, results) => {
    if (err) return console.log(err);
    res.render("pages/products.ejs", {
      products: results,
      title: "Check out our salads here | Just Produce",
    });
  });
});

app.get("/justharvest", (req, res) => {
  res.render("pages/mailing-list.ejs", {
    title: "Join our mailing list! | Just Produce",
    subscribed: false,
  });
});

app.get("/privacy", (req, res) => {
  res.render("pages/privacy", { title: "Privacy Policy" });
});

// POST

app.post("/verify_recaptcha", (req, res) => {
  const secret_key = process.env.SECRET_KEY;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  var google_response;
  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => res.json({ google_response }))
    .catch((error) => res.json({ error }));
});

app.post("/submit-inquiry", (req, res) => {
  var body = req.body;
  var sanitized = {};

  Object.keys(body).forEach((el) => {
    sanitized[el] = req.sanitize(body[el]);
  });

  try {
    sendInquiry(sanitized);
    res.json({ code: 200 });
  } catch (err) {
    res.json({ code: 500 });
  }
});

app.post("/justharvest", (req, res) => {
  Subscriber.create(req.body, null, (err, results) => {
    res.render("pages/mailing-list-subscribed.ejs", {
      title: "Join our mailing list! | Just Produce",
      subscribed: true,
    });
  });
});

app.use(function (req, res, next) {
  res.status(404);
  res.render("pages/404.ejs", { title: "Page Not Found" });
});

// --------------------------
