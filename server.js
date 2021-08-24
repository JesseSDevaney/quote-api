const express = require("express");
const { quotes } = require("./data.cjs");
const { getRandomElement } = require("./utils.cjs");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));
