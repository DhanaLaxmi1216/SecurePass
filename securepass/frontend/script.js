fetch("http://localhost:3000/validate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username,
        password
    })
})
.then(res => res.json())
.then(data => {

    console.log(data);

    result.innerHTML = `
        <h2>${data.strength}</h2>
        <h3>Score : ${data.score}/6</h3>

        <ul>
            ${data.feedback.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;

})
.catch(err => console.log(err));