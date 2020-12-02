var movieTitles = [];
var movieRatings = [];
var userRatings = {};
var otherRatings = {};

function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myFunction(this);
        }
    };
    xmlhttp.open("GET", "testOutput.xml", true);
    xmlhttp.send();
}

function myFunction(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="<tr><th>Movie</th><th>IMDB Rating</th></tr>";
    var x = xmlDoc.getElementsByTagName("item");
    for (i = 0; i <x.length; i++) {
        foundTitle = x[i].getElementsByTagName("movie_name")[0].childNodes[0].nodeValue;
        foundRating = x[i].getElementsByTagName("movie_rating")[0].childNodes[0].nodeValue;

        movieTitles.push(foundTitle);
        movieRatings.push((foundRating));

        table += "<tr><td>" +
        foundTitle +
        "</td><td>" +
        foundRating +
        "</td></tr>";
    }
    document.getElementById("demo").innerHTML = table;
    autocomplete(document.getElementById("myInput"), movieTitles);
    getUserRatings();
}

function getUserRatings(){
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      userRatings = xmlhttp.response;
    }
  };

  xmlhttp.open("GET", "users.json", true);
  xmlhttp.responseType = 'json';
  xmlhttp.send();
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }

function addUserRank(){
  //remember to check that the given values are valid
  var userName = document.getElementById("userName").value;
  var movieName = document.getElementById("myInput").value;
  var userRank = parseFloat(document.getElementById("userRank").value);

  // valid if: user has name, ranking is number and movie title is in the array
  if((userName.length > 1) && (((isFloat(userRank)) || (Number.isInteger(userRank))) && userRank <= 5 && userRank >= 1) && verifyTitle(movieName)){
    //check if the user already exists in the JSON
    if(userRatings.hasOwnProperty(userName)){
      //add the rating for the given movie
      userRatings[userName][movieName] = userRank;
    }else{
      userRatings[userName] = {};
      userRatings[userName][movieName] = userRank;
    }

    document.getElementById("userName").value = "";
    document.getElementById("myInput").value = "";
    document.getElementById("userRank").value = "";

    //console.log(userRatings);

  }else if((userName.length <= 1)){
    window.alert("Please enter your name.");
  }else if(!((isFloat(userRank)) || (Number.isInteger(userRank))) || userRank > 5 || userRank < 1){
    window.alert("Please enter a rating between 1 and 5.");
  }else{
    window.alert("Please choose from the movie titles provided.")
  }
  
}

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}

function verifyTitle(givenTitle){
  return movieTitles.includes(givenTitle);
}

function recommendMovie(){
  //get similarities between people
  var recommendFor = document.getElementById("recommendFor").value;

  if(userRatings.hasOwnProperty(recommendFor)){
    //get the users that have the same movies
    //put movies in an array
    //put users in an array??
    var movies = []
    var sameUsers = []
    for(var movie in userRatings[recommendFor]){
      movies.push(movie);
    }
    for(var users in userRatings){
      for(var movie in userRatings[users]){
        if(movies.includes(movie)){
          if(!sameUsers.includes(users)){
            sameUsers.push(users);
          }
        }
      }
    }

    //Have:movies for recommend for & names of ppl who have at least one movie
    //need: calculate similarities
    //a matrix for the user rankings
    var rankMat = [];

    for(user of sameUsers){
      var rankRow = [];
      //go through the movies
      for(movie of movies){
        //make a row to put in the array
        if(userRatings[user].hasOwnProperty(movie)){
          //this user has rated the movie
          holder = parseFloat(userRatings[user][movie]);
          rankRow.push(holder);
        }else{
          //the user has not rated the movie
          rankRow.push(0);
        }

      }
      rankMat.push(rankRow);
    }

    var currentUser = sameUsers.indexOf(recommendFor);
    var simScores = [];
    console.log(sameUsers);

    for(i = 0; i < sameUsers.length; i++){
      //get the sim score for each user
      if(i == 6){
        //call sim, giving i, current and the matrix
        score = sim(currentUser, i, rankMat);
        simScores.push(score);
        //console.log(sameUsers[0]);
        console.log(simScores);
      }else{
        simScores.push(0);
      }

    }

  }else{
    window.alert("This user does not have any ratings.");
  }
}

function sim(user1, user2, rankMatrix){
  //get the row then avg for each user

  var result = getSameMovies(rankMatrix[user1], rankMatrix[user2]);
  var u1Result = result[0];
  var u2Result = result[1];

  console.log(u1Result);
  console.log(u2Result);

  var u1Avg = 0;
  var u2Avg = 0;

  for(i = 0; i < u1Result.length; i++){
    u1Avg += u1Result[i];
    u2Avg += u2Result[i];
  }

  u1Avg = u1Avg / u1Result.length;
  u2Avg = u2Avg / u2Result.length;

  numerator = 0;
  denU1 = 0;
  denU2 = 0;

  for(i = 0; i < u1Result.length; i++){
    numerator += (u1Result[i] - u1Avg) * (u2Result[i] - u2Avg);
    denU1 += Math.pow((u1Result[i] - u1Avg), 2);
    denU2 += Math.pow((u2Result[i] - u2Avg), 2);
  }

  denominator = Math.sqrt(denU1 * denU2);

  return numerator / denominator;

}

function getSameMovies(user1, user2){
  //will return arrays with 0 columns removed
  var newUser1 = [];
  var newUser2 = [];
  for(i = 0; i < user1.length; i++){
    if(user1[i] !== 0 && user2[i] !== 0){
      //add the values to the new arrays
      newUser1.push(user1[i]);
      newUser2.push(user2[i]);
    }
  }

  return [newUser1, newUser2];
}