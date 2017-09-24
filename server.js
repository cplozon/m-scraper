
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var mongoose = require("mongoose");
//set mongoose to leverage built in JS
var request = require("request");
//request makes http request for html page ie fox news
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var Note = require("./models/Note.js");
//requires the file and values from the file created called Note.js
var Article = require("./models/Article.js");
//requires the file and values from the file created called Article.js
// Initialize Express
var app = express();

//set mongoose to leverage built in JS ES6 Promises
mongoose.Promise = Promise;

//Use morgan and body parser with the app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// making public a static dir
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/foxnewsdata");
var db = mongoose.connection;

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello Message)
app.get("/", function(req, res) {
  res.send("Hello UNC");
});

//get data from db
app.get("/all", function(req,res){
  //find all results from the scrapeddata collection in db
  db.scrapedData.find({}, function(error,found){
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

//Scrape data from fox and place it into the mongodb

app.get("/scrape", function (req,res){
  //make request for news section of fox
request("http://www.foxnews.com/", function(error, response, html) {
 //load html body from request in cheerio
	var $ = cheerio.load(html);
  $("h2.title").each(function(i, element){
    //Save the text and href of each link 
    var title = $(element).children("a").text();
    var link = $(element).children("a").attr("href");

    // if the found element has both title and link = &&
    if (title && link) {
      // instert data into db
      db.scrapedData.insert({
        title: title,
        link: link,
      },
      function(err, inserted){
        if (err){
          console.log(err);
        }
        else {
          //log data if no error
          console.log(inserted);
        }
      });
    }
  });
});
	// send a scrape complete message to browser
  res.send("Scrape Complete");
});





// app.get("/name", function(req,res){
//   //query - in db go to animals collection and find everything
//   //sorit it by name - 1 means ascending order
//   db.scrapedData.find().sort({ name: 1}, function(error,found){
//     if (error) {
//       console.log(error);
//     }
//     else {
//       res.json(found);
//     }
//   });
// });



/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
