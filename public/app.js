
$(document).ready(function(){
  $("#view-news").hide();


var articleCounter = 0;
// globlal variable to set the article counter to 0
$("#scrape").on("click", function(event){
  event.preventDefault();
  articleCounter = 0;
  // Grab the articles as a json
  $.getJSON("/articles", function(data) {
    
      // For each one
      for (var i = 0; i < 25; i++) {
      // Display the information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
          "<br />" + data[i].link + "</p>" + 
          '<button id= "saveArticle">Save Article</button></button>' +
          '<button id= "addNotes">Add Notes</button>');
        articleCounter++;
      }
      alert("You have added " + articleCounter + " articles!");
      $(".modal-body-numarticles").html("You have added " + articleCounter + " articles!");
      $("#no-articles").hide();
      $("#view-news").show();  
  });
});

// Whenever someone clicks a p tag
$("#addNotes").on("click", function(event) {
  alert("AN working");
});


$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // Add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      alert("in notes");
      $("#notes").append("<button data-id='" + data._id + "' id='shownote'>Show Notes</button>");
     
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#saved-articles", function() {
  // grab the element
  var selected = $(this);
  // make call to find items
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data){
      //fill the inputs with the data the ajax collected
      alert(data);
      $("#").html("<button id='udater' data-id='" + data._id + "'>Update</button>");
    }
  });
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId + "/note",
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val(),
      articleId: thisId,
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });


  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
$(document).on("click", "#shownote", function() {
 var thisId = $(this).attr("data-id");
$.ajax({
    method: "GET",
    url: "/articles/" + thisId + "/note",
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      $('#myModal').modal('show')

    });
  });


// To delete your articles or clear
$("#empty").on("click", function(event){
  $("#articles").empty();
  articleCounter = 0;
});
// for modals
$('lpModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$('#scrape').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$('#0').on('shown.bs.modal', function () {
  $('#myInput').focus()
})


});



