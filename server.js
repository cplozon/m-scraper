
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var swal = require("sweetalert");
var logger = require("morgan");
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
//set mongoose to leverage built in JS ES6 Promises
mongoose.Promise = Promise;


//requires the file and values from the file created called Article.js
// Initialize Express
var app = express();

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
db.on("error", function(error) {
  console.log("Database Error:", error);
});
// Success message for mongoose
db.once("open", function(){
  console.log("Mongoose conenction successful");
});

//Scrape data from fox and place it into the mongodb

app.get("/scrape", function (req,res){
  //make request for news section of fox
  request("http://www.foxnews.com/", function(error, response, html) {
  //load html body from request in cheerio
	 var $ = cheerio.load(html);
    $("h2.title").each(function(i, element){
      //Save the text and href of each link 
      var result = {};
      //Add text and href of links and save as an object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var entry = new Article(result);

      entry.save(function(err,doc){
        if(err){
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
	// send a scrape complete message to browser
  res.send("Scrape Complete");
});

// get articles we scraped from the mongo DB
app.get("/articles", function(req, res){
  Article.find({}, function(error,doc){
    // Log errors if any
    if(error) {
      console.log(error);
    }
    // or send the doc to the broweser
    else {
      res.json(doc);
    }
  });
});

app.get("/articles/:id", function(req,res){
  //query that finds the matching article in our db
  Article.findOne({"_id": req.params.id})
  //populates the notes associated with it
  .populate("note")
  //execute query
  .exec(function(error,doc){
    if(error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:article_id/note", function(req,res){
  console.log(req);
  //Create a new note and pass the body to the entry
  var newNote = new Note(req.body);
  //save the new note to the db
  newNote.save(function(error,doc){
    if (error){
      console.log(error);
    }
    else {
      //use article id to find and update the note
      Article.findOneAndUpdate({"_id": req.params.id}, {"note": doc._id})
      //execute query
      .exec(function(err,doc){
        if (err) {
          console.log(err);
        }
        else{
          res.send(doc);
        }
      });
    }
  });
});

app.get("/articles/:article_id/note", function(req,res){

  Note.findOne({"articleId": req.params.article_id})

  .exec(function(error,doc){
    if(error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});



app.get("/delete/:id", function(req,res){
  //remove a note using the object id
  
})


// Listen on port 3000///////
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
