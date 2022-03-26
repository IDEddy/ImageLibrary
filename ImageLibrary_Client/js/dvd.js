$(document).ready(function () {
    loadDVDs();
    $("#dvdDetails").hide();
    addDVDs();
    $("#addForm").hide();
    updateDVD();
    searchItem();
  
});


function loadDVDs() {
    clearDVDTable();
    $("#editFormDiv").hide();
	
    var contentRows = $("#dvdRows");

    // retrieve and display existing data using GET request
    $.ajax({
        type: "GET",
        url: "https://localhost:44325/dvds",
        success: function (dvdArray) {

          
            $.each(dvdArray, function (index, dvd) {
                //retrieve and store the values
                var Title = dvd.Title;
                var Rating = dvd.Rating;
                var Director = dvd.Director;
                var ReleaseYear = dvd.ReleaseYear;
                var Id = dvd.Id;
				
                // build a table using the retrieved values
                var row = "<tr>";
                row += '<td> <a href="#0" class="link-primary" onclick="detailDVDs(' + Id + ')">' + Title + '</a></td>';
                row += "<td>" + ReleaseYear + "</td>";
                row += "<td>" + Director + "</td>";
                row += "<td>" + Rating + "</td>";
                row += '<td><a href="#0" onclick="showEditForm(' + Id + ')" class="link-primary" > Edit</a > | <a href="#0" onclick="deleteDVD(' + Id + ') " class="link-danger">Delete</a></td > ';
			    row += "</tr>";
              
                contentRows.append(row);
            });
        },

        // create error function to display API error messages
        error: function () {
            $("#errorMessages").append(
                $("<li>")
                    .attr({ class: "list-group-item list-group-item-danger" })
                    .text("Error calling web service. Please try again later.")
            );
        },
    });
}


function clearDVDTable() {
    $("#dvdRows").empty();
}

function hideDVDs()
{

    $("#headerRow").hide();
    $("#dvdTable").hide();

}

function showDVDs() {

    $("#headerRow").show();
    $("#dvdTable").show();

}


function detailDVDs(Id) {
   
    hideDVDs();
   
    $("#dvdDetails").show();
    
    // retrieve and display existing data using GET request
    $.ajax({
        type: "GET",
        url: "https://localhost:44325/dvd/" + Id,
        success: function (data, status) {

            
            $("#dvdReleaseYear").append(data.releaseDate).text();
            $("#dvdTitle").append(data.Title).text();
            $("#dvdDirector").append(data.Director).text();

            $("#dvdRating").append(data.Rating).text();
            $("#dvdNotes").append(data.Notes).text();
            $("#dvdDetails").append('<a  class="btn btn-outline-primary" id="backDVD" href="home.html">Back </button>');
        },

        // create error function to display API error messages
        error: function () {
            $("#errorMessages").append(
                $("<li>")
                    .attr({ class: "list-group-item list-group-item-danger" })
                    .text("Error calling web service. Please try again later.")
            );
        },
    });
}

function loadAddForm()
{
    $("#addForm").show();

}


function addDVDs()
{
   
    $("#addDVDButton2").click(function (event) {
       
        
        var haveValidationErrors = checkAndDisplayValidationErrors(
            $("#addForm").find("input")

        );

        if (haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "https://localhost:44325/dvd/",
            data: JSON.stringify({
                Title: $("#addTitle").val(),
                ReleaseYear: $("#addYear").val(),
                Director: $("#addDirector").val(),
                Rating: $("#addRating").val(),
                notes: $("#addNotes").val(),

            }),
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json"

            },
            dataType: "json",
            success: function () {
                $("#errorMessages").empty();
                $("#addTitle").val("");
                $("#addYear").val("");
                $("#addDirector").val("");
                $("#addRating").val("");
                $("#addNotes").val("");
                $("#addForm").hide();
                showDVDs();
                loadDVDs();

            },

            error: function () {
                $("#errorMessages").append(
                    $("<li>")
                        .attr({ class: "list-group-item list-group-item-danger" })
                        .text("Error calling web service. Please try again later.")
                );
            },

        });


    });
    

}


function showEditForm(Id) {
	hideDVDs();
    $("#errorMessages").empty();
	clearDVDTable();
    $("#editFormDiv").show();
    $.ajax({
        type: "GET",
        url: "https://localhost:44325/dvd/" + Id,
        success: function (data, status) {
          
            $("#editTitleHeader").append(data.Title);
            $("#editTitle").val(data.Title);
            $("#editYear").val(data.ReleaseYear);
            $("#editDirector").val(data.Director);
            $("#editRating").val(data.Rating);
            $("#editNotes").val(data.Notes);
            $("#editId").val(data.Id);
	
			
        },
        error: function () {
            $("#errorMessages").append(
                $("<li>")
                    .attr({ class: "list-group-item list-group-item-danger" })
                    .text("Error calling web service. Please try again later.")
            );
        },
    });

    // hide the table when the form is opened
    //$("#contactTableDiv").hide();
   // $("#editFormDiv").show();
}



// use a PUT request to update existing data
function updateDVD() {
    $("#updateButton").click(function (event) {
		
        // check for errors and abort if errors are found
        var haveValidationErrors = checkAndDisplayValidationErrors(
            $("#editForm").find("input")
        );

        if (haveValidationErrors) {
            return false;
        }
		console.log('#editId');
        $.ajax({
			
            type: "PUT",
            url:
                "https://localhost:44325/dvd/" +  $("#editId").val(),
            data: JSON.stringify({
				Id: $("#editId").val(),
                Title: $("#editTitle").val(),
                ReleaseYear: $("#editYear").val(),
                Director: $("#editDirector").val(),
                Rating: $("#editRating").val(),
				Notes: $("#editNotes").val()
				
             }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
		    "dataType": "json",
		    success: function () {
                $("#errorMessage").empty();
                showDVDs();
                loadDVDs();
            },
            error: function () {
                $("#errorMessages").append(
                    $("<li>")
                        .attr({ class: "list-group-item list-group-item-danger" })
                        .text("Error calling web service. Please try again later.")
                );
            },
        });
    });
}





function checkAndDisplayValidationErrors(input) {
    $("#errorMessages").empty();

    var errorMessages = [];

   
    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $("label[for=" + this.id + "]").text();
            errorMessages.push(errorField + " " + this.validationMessage);
        }
    });

   
    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $("#errorMessages").append(
                $("<li>")
                    .attr({ class: "list-group-item list-group-item-danger" })
                    .text(message)
            );
        });
     
        return true;
    } else {
   
        return false;
    }
}


function deleteDVD(Id) {
    $.ajax({
        type: "DELETE",
        url: "https://localhost:44325/dvd/" + Id,
        success: function () {
            
            loadDVDs();
        },
    });
}

function searchItem(){
	
$('#searchButton').click(function(){
		
	
	
	var category = $('#category').val();
	var searchFieldText = $('#searchField').val();

	console.log(searchFieldText + "FIELD TEST");
	if(category == 'Title' && searchFieldText != "")
	{
		var url = 'https://localhost:44325/dvd/title/' + searchFieldText;
		
	}
	else if(category == 'Year'  && searchFieldText != "")
	{
		var url = 'https://localhost:44325/dvd/year/' + searchFieldText;
		
	}
	else if(category == 'Director' && searchFieldText != "")
	{
		
		var url = 'https://localhost:44325/dvd/director/' + searchFieldText;
	}
	else if(category == 'Rating' && searchFieldText != "")
	{
		var url = 'https://localhost:44325/dvd/rating/' + searchFieldText;
		
	}
	else if	(searchFieldText == "")
	{
		
		loadDVDs();
	}
	else
	{
          $('#errorMessages').append($('<li>Please choose a search term</li>'))
    }
	searchDVDs(url);
});
	
}

function searchDVDs(url) {
    clearDVDTable();
	console.log(url);
    $("#editFormDiv").hide();
	$("#errorMessages").empty();

    var contentRows = $("#dvdRows");


    $.ajax({
        type: "GET",
        url: url,
        success: function (dvdArray) {
			$("#errorMessages").empty();
          
            $.each(dvdArray, function (index, dvd) {
         
                var Title = dvd.Title;
                var Rating = dvd.Rating;
                var Director = dvd.Director;
                var ReleaseYear = dvd.ReleaseYear;
                var Id = dvd.Id;
				
      
                var row = "<tr>";
                row += '<td> <a href="#0" class="link-primary" onclick="detailDVDs(' + Id + ')">' + Title + '</a></td>';
                row += "<td>" + ReleaseYear + "</td>";
                row += "<td>" + Director + "</td>";
                row += "<td>" + Rating + "</td>";
                row += '<td><a href="#0" onclick="showEditForm(' + Id + ')" class="link-primary" > Edit</a > | <a href="#0" onclick="deleteDVD(' + Id + ') " class="link-danger">Delete</a></td > ';
			    row += "</tr>";
              
                contentRows.append(row);
            });
        },

    
        error: function () {
		  $("#errorMessages").empty();
            $("#errorMessages").append(
                $("<li>")
                    .attr({ class: "list-group-item list-group-item-danger" })
                    .text("Please enter a search term.")
            );
        },
    });
}






















