const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000; // Port set to 10000

// Serve index.html on the root URL
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Start the server
app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
    logger("Opened server site...", "[ Starting ] >");
});

// Function to start the bot
function startBot(message) {
    // Log the message if provided
    if (message) logger(message, "[ Starting ] >");

    // Spawn a new process for the bot
    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "SHANKAR-PROJECT.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    // Handle the bot process exit
    child.on("close", (codeExit) => {
        if (codeExit != 0 || (global.countRestart && global.countRestart < 5)) {
            startBot("Restarting...");
            global.countRestart = (global.countRestart || 0) + 1;
            return;
        } else return;
    });

    // Handle any error that occurs during the bot process
    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ] >");
    });
}

// Make an Axios GET request with error handling
axios.get("https://run.mocky.io/v3/cf7362ce-918a-47b0-a403-bd5c2891df97")
    .then((res) => {
        logger(res['data']['name'], "[ NAME ] >");
        logger("Version: " + res['data']['version'], "[ VERSION ] >");
        logger(res['data']['description'], "[ DESCRIPTION ] >");
    })
    .catch((error) => {
        // Log the error message if the request fails
        if (error.response && error.response.status === 404) {
            logger("Error: Resource not found (404)", "[ ERROR ] >");
        } else {
            logger("Error: " + error.message, "[ ERROR ] >");
        }
    });

// Start the bot
startBot();
