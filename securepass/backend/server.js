const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/validate", (req, res) => {

    const { username, password } = req.body;

    let score = 0;
    let feedback = [];

    const checks = {

        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        username: !password.toLowerCase().includes(username.toLowerCase())

    };

    if (checks.length) score++;
    else feedback.push("Minimum 8 characters");

    if (checks.uppercase) score++;
    else feedback.push("Missing uppercase letter");

    if (checks.lowercase) score++;
    else feedback.push("Missing lowercase letter");

    if (checks.number) score++;
    else feedback.push("Missing number");

    if (checks.special) score++;
    else feedback.push("Missing special character");

    if (checks.username) score++;
    else feedback.push("Password contains username");

    let strength = "";

    if (score <= 2)
        strength = "Weak";
    else if (score <= 4)
        strength = "Medium";
    else if (score === 5)
        strength = "Strong";
    else
        strength = "Very Strong";

    console.log("\n==========================================");
    console.log("PASSWORD VALIDATION");
    console.log("==========================================");
    console.log("Username   :", username);
    console.log("Password   :", "*".repeat(password.length));
    console.log("------------------------------------------");
    console.log("Length     :", checks.length ? "PASS" : "FAIL");
    console.log("Uppercase  :", checks.uppercase ? "PASS" : "FAIL");
    console.log("Lowercase  :", checks.lowercase ? "PASS" : "FAIL");
    console.log("Number     :", checks.number ? "PASS" : "FAIL");
    console.log("Special    :", checks.special ? "PASS" : "FAIL");
    console.log("Username   :", checks.username ? "PASS" : "FAIL");
    console.log("------------------------------------------");
    console.log("Score      :", score + "/6");
    console.log("Strength   :", strength);

    if (feedback.length > 0) {

        console.log("Suggestions:");

        feedback.forEach(item => console.log(" - " + item));

    }

    console.log("==========================================\n");

    const sql =
        "INSERT INTO password_checks(username,strength,score) VALUES(?,?,?)";

    db.query(sql, [username, strength, score], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });

        }

        console.log("Saved Successfully\n");

        res.json({

            strength,
            score,
            feedback

        });

    });

});

app.listen(3000, () => {

    console.log("=================================");
    console.log("Server Running on Port 3000");
    console.log("Database Connected");
    console.log("=================================");

});