const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function (req, res) {

    const mailChimpApiKey = "dc7c155dd040950532a36170b7b4c351-us20"


    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const data = {
        members: [{

            email_address: email,
            status: "subscribed",
            merge_fields: {

                FNAME: firstName,
                LNAME: lastName,

            }
        }]
    }

    const jsonData = JSON.stringify(data)
    const url = "https://us20.api.mailchimp.com/3.0/lists/fe4197a2d2"
    // const audianceID = "fe4197a2d2"
    const options = {
        method: "POST",
        auth: "pabloleal7:" + mailChimpApiKey,
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/sucess.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data) => {
                console.log(JSON.parse(data));
            })
    })

    request.write(jsonData)
    request.end()

    // res.send(fistName + lastName + email)
})

app.post("/failure", function(req, res){
    res.redirect("/")
})



app.listen(process.env.PORT || 3000, function () {
    console.log("Server On"+ this.address().port);
});