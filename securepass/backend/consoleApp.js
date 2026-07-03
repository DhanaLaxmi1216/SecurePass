const readline = require("readline");
const db = require("./db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=======================================");
console.log("      SecurePass Password Validator");
console.log("=======================================\n");

rl.question("Enter Username : ", (username) => {

    rl.question("Enter Password : ", (password) => {

        let score = 0;

        console.log("\nChecking Password...\n");

        // 1. Minimum 8 characters
        if (password.length >= 8) {
            console.log("✓ Minimum 8 characters");
            score++;
        } else {
            console.log("✗ Minimum 8 characters");
        }

        // 2. Minimum 12 characters
        if (password.length >= 12) {
            console.log("✓ 12 or more characters");
            score++;
        } else {
            console.log("✗ 12 or more characters");
        }

        // 3. Uppercase
        if (/[A-Z]/.test(password)) {
            console.log("✓ Contains Uppercase");
            score++;
        } else {
            console.log("✗ Contains Uppercase");
        }

        // 4. Lowercase
        if (/[a-z]/.test(password)) {
            console.log("✓ Contains Lowercase");
            score++;
        } else {
            console.log("✗ Contains Lowercase");
        }

        // 5. Number
        if (/\d/.test(password)) {
            console.log("✓ Contains Number");
            score++;
        } else {
            console.log("✗ Contains Number");
        }

        // 6. Special Character
        if (/[^A-Za-z0-9]/.test(password)) {
            console.log("✓ Contains Special Character");
            score++;
        } else {
            console.log("✗ Contains Special Character");
        }

        // 7. Username Check
        if (!password.toLowerCase().includes(username.toLowerCase())) {
            console.log("✓ Password doesn't contain Username");
            score++;
        } else {
            console.log("✗ Password contains Username");
        }

        // 8. Repeated Characters
        if (!/(.)\1\1/.test(password)) {
            console.log("✓ No repeated characters");
            score++;
        } else {
            console.log("✗ Repeated characters found");
        }

        // 9. Sequential Characters
        if (!/(123|234|345|456|567|678|789|abc|bcd|cde|def|qwerty)/i.test(password)) {
            console.log("✓ No sequential characters");
            score++;
        } else {
            console.log("✗ Sequential characters found");
        }

        // 10. Common Password
        const commonPasswords = [
            "password",
            "password123",
            "123456",
            "admin",
            "welcome",
            "qwerty"
        ];

        if (!commonPasswords.includes(password.toLowerCase())) {
            console.log("✓ Not a common password");
            score++;
        } else {
            console.log("✗ Common password");
        }

        // Strength
        let strength;

        if (score <= 3) {
            strength = "Weak";
        }
        else if (score <= 6) {
            strength = "Medium";
        }
        else if (score <= 8) {
            strength = "Strong";
        }
        else {
            strength = "Very Strong";
        }

        console.log("\n=======================================");
        console.log("Password Strength :", strength);
        console.log("Score             :", score + "/10");
        console.log("=======================================\n");

        rl.question("Save to Database? (Y/N): ", (answer) => {

            if (answer.toLowerCase() === "y") {

                const sql = `
                    INSERT INTO password_checks
                    (username, strength, score)
                    VALUES (?, ?, ?)
                `;

                db.query(sql, [username, strength, score], (err) => {

                    if (err) {
                        console.log("Database Error!");
                        console.log(err);
                    } else {
                        console.log("\nData Saved Successfully!");
                    }

                    rl.close();

                });

            } else {

                console.log("\nData Not Saved.");
                rl.close();

            }

        });

    });

});