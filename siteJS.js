var movieTitles = [];
var movieRatings = [];

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
}