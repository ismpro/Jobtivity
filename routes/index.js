/**
 * @file Express router for handling views and scripts
 * @module routes/index
 */
const User = require("../models/UserModel");
const express = require("express");
const path = require("path");
const fs = require("fs");

let router = express.Router();

/**
 * Redirect Middleware for when you are log in
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
const redirectHome = async (req, res, next) => {
  if (req.session.userid) {
    let user = await User.getById(req.session.userid);

    if (user && user.sessionId === req.session.sessionId) {
      res.redirect("/");
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * Handle GET requests for the home page
 */
router.get("/", function (req, res) {
  res.status(200).sendFile(path.join(global.appRoot, "www", `index.html`));
});

/**
 * Handle GET requests for the favicon
 */
router.get("/favicon.ico", function (req, res) {
  res.status(200).sendFile(path.join(global.appRoot, "www", `favicon.ico`));
});

/**
 * Handle GET requests for the login page
 * Uses the redirectHome middleware to redirect logged in users
 */
router.get("/login", redirectHome);
/**
 * Handle GET requests for the registration page
 * Uses the redirectHome middleware to redirect logged in users
 */
router.get("/registration", redirectHome);

/**
 * Handle GET requests for the admin page
 * Redirects non-admin and non-logged in users to the home page
 */
router.get("/admin", async (req, res) => {
  if (req.session.userid) {
    let user = await User.getById(req.session.userid);

    if (user && user.sessionId === req.session.sessionId && user.admin) {
      res.status(200).sendFile(path.join(global.appRoot, "www", "admin.html"));
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

/**
 * Handle GET requests for the profile page
 * Redirects non-logged in users to the home page
 */
router.get("/profile", async (req, res) => {
  if (req.session.userid) {
    res.status(200).sendFile(path.join(global.appRoot, "www", "profile.html"));
  } else {
    res.redirect("/");
  }
});

/**
 * Handle GET requests for the people page
 * Redirects non-logged in users to the home page
 */
router.get("/people", async (req, res) => {
  if (req.session.userid) {
    res.status(200).sendFile(path.join(global.appRoot, "www", "people.html"));
  } else {
    res.redirect("/");
  }
});

/**
 * Handle GET requests for other pages
 */
router.get("/*", function (req, res, next) {
  if (
    fs.existsSync(path.join(global.appRoot, "www", `${req.path.slice(1)}.html`))
  ) {
    res
      .status(200)
      .sendFile(path.join(global.appRoot, "www", `${req.path.slice(1)}.html`));
  } else {
    next();
  }
});

/**
 * Handle GET requests for the admin script
 * Redirects non-admin and non-logged in users to the home page
 */
router.get("/scripts/admin.js", async function (req, res) {
  if (req.session.userid) {
    let user = await User.getById(req.session.userid);

    if (user && user.sessionId === req.session.sessionId && user.admin) {
      res
        .status(200)
        .sendFile(path.join(global.appRoot, "www", "scripts", "admin.js"));
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
