/* Students: Using the tools and techniques you learned so far,
 * you will scrape a website of your choice, then place the data
 * in a MongoDB database. Be sure to make the database and collection
 * before running this exercise.

 * Consult the assignment files from earlier in class
 * if you need a refresher on Cheerio. */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

request("http://www.foxnews.com/", function(error, response, html) {

	var $ = cheerio.load(html);
	var results = [];

	$("h2.title").each(function(i, element) {

		var link = $(element).children().attr("href");
    	var title = $(element).text();

    	results.push({
      title: title,
      //link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});



// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);


db.on("error", function(error) {
  console.log("Database Error:", error);
});



// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});


app.get("/all", function(req,res){
  db.scrapedData.find({}, function(error,found){
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
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
