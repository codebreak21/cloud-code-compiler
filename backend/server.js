const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

app.post("/run", (req, res) => {
    const code = req.body.code;
    const language = req.body.language;

    if (!code || !language) {
        return res.status(400).send("Missing code or language");
    }

    let fileName, command;

    if (language === "python") {
        fileName = "temp.py";
        command = `python ${fileName}`;
    } else if (language === "cpp") {
        fileName = "temp.cpp";
        command = `g++ ${fileName} -o temp && temp`;
    } else if (language === "javascript") {
        fileName = "temp.js";
        command = `node ${fileName}`;
    } else {
        return res.status(400).send("Unsupported language");
    }

    const fs = require("fs");
    fs.writeFileSync(fileName, code);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.send(`❌ Error: ${stderr}`);
        } else {
            res.send(`✅ Output:\n${stdout}`);
        }

        fs.unlinkSync(fileName);
        if (language === "cpp") fs.unlinkSync("temp.exe", () => {});
    });
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
