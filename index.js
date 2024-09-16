const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});
app.listen(port);
console.log('Server started at http://localhost:' + port);
logger("Opened server site...", "[ Starting ] >");
function startBot(message) {
		(message) ? logger(message, "[ Starting ] >") : "";

		const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "SHANKAR-PROJECT.js"], {
				cwd: __dirname,
				stdio: "inherit",
				shell: true
		});

		child.on("close", (codeExit) => {
				if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
						startBot("Restarting...");
						global.countRestart += 1;
						return;
				} else return;
		});

		child.on("error", function (error) {
				logger("An error occurred: " + JSON.stringify(error), "[ Starting ] >");
		});
};
axios.get("https://run.mocky.io/v3/cf7362ce-918a-47b0-a403-bd5c2891df97").then((res) => {
		logger(res['data']['name'], "[ NAME ] >");
		logger("Version: " + res['data']['version'], "[ VERSION ] >");
		logger(res['data']['description'], "[ DESCRIPTION ] >");
});
startBot();
