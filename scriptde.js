

  function getmovie() {
    document.getElementById('loader').style.display = "block";

    var currentpage = 1;


    var reqhttp = new XMLHttpRequest();
    var url = "https://cors-anywhere.herokuapp.com/https://apis.justwatch.com/content/titles/de_DE/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22movie%22%5D,%22genres%22:null,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22rent%22,%22buy%22,%22ads%22%5D,%22page%22:1,%22page_size%22:1000,%22presentation_types%22:null,%22providers%22:%5B%22nfx%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D";
    reqhttp.open("GET", url, true);
    reqhttp.onreadystatechange = ProcessRequest;
    function ProcessRequest() {

    if (reqhttp.readyState == 4 && reqhttp.status == 200) {


    var movies = JSON.parse(reqhttp.responseText);



      var items = movies.items;
      var item = items[Math.floor(Math.random()*items.length)];


      var imgpath = item.full_path.replace('/de/Film/','');


      var poster =  item.poster.replace('{profile}','');
      var url = "https://images.justwatch.com" + poster + "s592/" + imgpath;

        var reqMovie = new XMLHttpRequest();
        var urlMovie = "https://api.themoviedb.org/3/search/movie?api_key=2110337cd64cb684ca46db097ce69338&language=de-CH&query="+ imgpath + "&page=1&include_adult=false";
        reqMovie.open("GET", urlMovie, true);
        reqMovie.onreadystatechange = ProcessMovie;
        function ProcessMovie() {
          if (reqMovie.readyState == 4 && reqMovie.status == 200) {
            console.log(reqMovie.statusText);
          }
          } else {
            console.log(reqMovie.statusText);
          }
        }




      document.getElementById('poster').style.backgroundImage = "url('" + url +"')";


      document.getElementById('loader').style.display = "none";
      document.getElementById('wrapper').style.display = "none";
      document.getElementById('title').innerHTML = item.title;
      document.getElementById('d1').style.display = "block";

      document.getElementById('close').onclick = function() {
        document.getElementById('wrapper').style.display = "flex";
        document.getElementById('d1').style.display = "none";
      };

      } else {
        console.log(reqhttp.statusText);
      }
    }
    reqhttp.setRequestHeader("Content-type", "application/json");
    reqhttp.responseType = "application/json";
    reqhttp.send();
  }
