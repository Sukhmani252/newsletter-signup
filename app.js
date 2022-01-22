const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); //for using the static files
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/c34ab27e37";
    const options = {
        method: "POST",
        auth: "mani_02:1e9f964af6da693b26ec5560e4d475b8-us2"
    }
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
    // console.log(firstName, lastName, Email);
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

// ApiKey
// 1e9f964af6da693b26ec5560e4d475b8-us20

//List ID/Audience ID
//c34ab27e37