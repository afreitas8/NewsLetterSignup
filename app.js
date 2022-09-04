const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.post("/", function(req,res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const url = "https://us5.api.mailchimp.com/3.0/lists/d031b97ea6"

    const options = {
        method: "POST",
        auth: "andrew:30e5c3f59a89fb096dc8b8804c841ae9-us5"
    }

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const request = https.request(url, options, function(response){
        console.log(response.statusCode);
        if(response.statusCode === 200){

            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            //console.log(JSON.parse(data));
        })
    })

    //console.log(request.statusCode);

    request.write(jsonData);
    request.end();

    //console.log(jsonData);
})

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});

// mailchipmAPIKkey = 30e5c3f59a89fb096dc8b8804c841ae9-us5
// audienceid = d031b97ea6