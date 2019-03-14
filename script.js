function getmovie() {
    document.getElementById('loader').style.display = "block";
    document.getElementById('movieImage').style.backgroundColor = "black";
    document.getElementById('movieImage').style.backgroundImage = "none";
    var reqhttp = new XMLHttpRequest();
    var url = "https://cors-anywhere.herokuapp.com/https://apis.justwatch.com/content/titles/de_CH/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22movie%22%5D,%22genres%22:null,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22rent%22,%22buy%22,%22ads%22%5D,%22page%22:1,%22page_size%22:20000,%22presentation_types%22:null,%22providers%22:%5B%22nfx%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D";
    reqhttp.open("GET", url, true);
    reqhttp.onreadystatechange = ProcessRequest;

    function ProcessRequest() {

        if (reqhttp.readyState == 4 && reqhttp.status == 200) {


            var movies = JSON.parse(reqhttp.responseText);
            var items = movies.items;
            var item = items[Math.floor(Math.random() * items.length)];

            var imgpath = item.full_path.replace('/ch/Film/', '');
            var primary_release_year = item.original_release_year;

            var poster = item.poster.replace('{profile}', '');
            var url = "https://images.justwatch.com" + poster + "s592/" + imgpath;
            var movieid = 0;

            movieid = item.id;

            var reqMovie = new XMLHttpRequest();
            var urlMovie = "https://api.themoviedb.org/3/search/movie?api_key=2110337cd64cb684ca46db097ce69338&language=de-CH&query=" + imgpath + "&page=1&include_adult=false&primary_release_year=" + primary_release_year;
            reqMovie.open("GET", urlMovie, true);
            reqMovie.onreadystatechange = ProcessMovie;

            function ProcessMovie() {
                if (reqMovie.readyState == 4 && reqMovie.status == 200) {
                    var movie = JSON.parse(reqMovie.responseText);

                    if (movie.results[0] == undefined) {
                      document.getElementById('movieImage').style.backgroundColor = "black";
                      document.getElementById('movieImage').style.backgroundImage = "none";
                    } else {
                      document.getElementById('movieImage').style.backgroundImage = "url('" + "https://image.tmdb.org/t/p/original" + movie.results[0].backdrop_path; + "')";
                    }

                    var detailinfo = new XMLHttpRequest();

                    var urlURL = "https://api.themoviedb.org/3/movie/" + movie.results[0].id + "?api_key=2110337cd64cb684ca46db097ce69338&language=de-CH";
                    detailinfo.open("GET", urlURL, true);
                    detailinfo.onreadystatechange = DetailInfo;

                    function DetailInfo() {
                        if (detailinfo.readyState == 4 && detailinfo.status == 200) {
                            var details = JSON.parse(detailinfo.responseText);


                            var genres = details.genres;

                            var lblgenres = "";
                            for (i = 0; i < genres.length; i++) {
                                lblgenres += genres[i].name + ", ";
                            }
                            lblgenres = lblgenres.substring(0, lblgenres.length - 2);
                            document.getElementById('genre').innerHTML = lblgenres;
                            document.getElementById('dauer').innerHTML = timeConvert(details.runtime);
                            document.getElementById('rating').innerHTML = details.vote_average + " / 10"

                            var releaseReq = new XMLHttpRequest();
                            var urlURL = "https://api.themoviedb.org/3/movie/" + movie.results[0].id + "/release_dates?api_key=2110337cd64cb684ca46db097ce69338";
                            releaseReq.open("GET", urlURL, true);
                            releaseReq.onreadystatechange = Release;

                            function Release() {
                                if (releaseReq.readyState == 4 && releaseReq.status == 200) {
                                    var release = JSON.parse(releaseReq.responseText);


                                    var certification = 0;
                                    var lblgenres = "";
                                    for (i = 0; i < release.results.length; i++) {
                                        if (release.results[i].iso_3166_1 == "DE") {
                                            certification = release.results[i].release_dates[0].certification;
                                        }
                                    }
                                    document.getElementById('fsk').innerHTML = certification;

                                    var directorReq = new XMLHttpRequest();
                                    var urlDirector = "https://api.themoviedb.org/3/movie/" + movie.results[0].id + "?api_key=2110337cd64cb684ca46db097ce69338&append_to_response=credits";
                                    directorReq.open("GET", urlDirector, true);
                                    directorReq.onreadystatechange = Director;

                                    function Director() {
                                        if (directorReq.readyState == 4 && directorReq.status == 200) {
                                            var director = JSON.parse(directorReq.responseText);
                                            var directors = [];
                                            director.credits.crew.forEach(function(entry) {
                                                if (entry.job === 'Director') {
                                                    directors.push(entry.name);
                                                }
                                            })
                                            document.getElementById('director').innerHTML = directors.join(', ');




                                            var netflixReq = new XMLHttpRequest();
                                            var urlNetflix = "https://cors-anywhere.herokuapp.com/https://apis.justwatch.com/content/titles/movie/" + movieid + "/locale/de_CH";
                                            netflixReq.open("GET", urlNetflix, true);
                                            netflixReq.onreadystatechange = Netflix;

                                            function Netflix() {

                                                if (netflixReq.readyState == 4 && netflixReq.status == 200) {
                                                    var netflix = JSON.parse(netflixReq.responseText);

                                                    for (i = 0; i < netflix.offers.length; i++) {
                                                            if (netflix.offers[i].urls.standard_web.indexOf("netflix") !== -1) {
                                                                console.log(netflix.offers[i].urls.standard_web);
                                                                document.getElementById('netflixlink').href = netflix.offers[i].urls.standard_web;
                                                            }
                                                    }


                                                    document.getElementById('loader').style.display = "none";
                                                    document.getElementById('wrapper').style.display = "none";
                                                    document.getElementById('titleDetails').innerHTML = item.title;
                                                    document.getElementById('detailsContainer').style.display = "block";

                                                } else {
                                                    console.log(netflixReq.statusText);
                                                }
                                            }
                                            netflixReq.setRequestHeader("Content-type", "application/json");
                                            netflixReq.responseType = "application/json";
                                            netflixReq.send();

                                        } else {
                                            console.log(releaseReq.statusText);
                                        }
                                    }
                                    directorReq.setRequestHeader("Content-type", "application/json");
                                    directorReq.responseType = "application/json";
                                    directorReq.send();




                                } else {
                                    console.log(releaseReq.statusText);
                                }
                            }
                            releaseReq.setRequestHeader("Content-type", "application/json");
                            releaseReq.responseType = "application/json";
                            releaseReq.send();




                        } else {
                            console.log(detailinfo.statusText);
                        }
                    }
                    detailinfo.setRequestHeader("Content-type", "application/json");
                    detailinfo.responseType = "application/json";
                    detailinfo.send();


                } else {
                    console.log(reqMovie.statusText);
                }

            }
            reqMovie.setRequestHeader("Content-type", "application/json");
            reqMovie.responseType = "application/json";
            reqMovie.send();



            document.getElementById('close').onclick = function() {
                document.getElementById('wrapper').style.display = "block";
                document.getElementById('detailsContainer').style.display = "none";
            };

        } else {
            console.log(reqhttp.statusText);
        }
    }
    reqhttp.setRequestHeader("Content-type", "application/json");
    reqhttp.responseType = "application/json";
    reqhttp.send();
}

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "min";
}
