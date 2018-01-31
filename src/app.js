
import './styles/app.scss';
import { getPromiseDataFromAray } from './helpers/index';

let searchInput = window.location.search;

let searchQuery = searchInput.substring(searchInput.lastIndexOf("=") + 1);

window.on.load= init();

function init() {


  function getWords(query, callback) {
    let bhtSourceUrl = "http://words.bighugelabs.com/api/2/";
    let bigHugeLabsKey = process.env.BHT_API_KEY;
    let format = "/json";
    let bhtUrl = bhtSourceUrl + bigHugeLabsKey + '/' + searchQuery + format;

    return fetch(bhtUrl, {
      method: "GET"
    })
      .then(res => res.json())
      .catch(err => console.error("Error:", err))
      .then(res => {
        getPhotos(searchQuery);
      

        if (res["noun"]) {
          let words = res["noun"]["syn"];
          synonym(searchQuery, words);
        } else if (res["verb"]) {
          let words = res["verb"]["syn"];
          synonym(searchQuery, words);
        } else if (res["adjective"]) {
          let words = res["adjective"]["syn"];
          synonym(searchQuery, words);
        } else {
          console.log("No synonyms for " + searchQuery + " found :(");
        }
      });
  }

  function getPhotos(word, callback) {
      //sort = relevance, text, licence 2,3,4,5,6,9, parse_tags = 1, per_page: 10
    let flickrKey = process.env.FLICKR_API_KEY;
    let flickrSecret = process.env.FLICKR_SECRET;
    let flickrQuery = "&tags=" + word + "&safe_search=1&extras=url_m&format=json&nojsoncallback=1";
    let flickrSourceUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
    let flickUrl = flickrSourceUrl + flickrKey + flickrQuery;

    return fetch(flickUrl, {
      method: "GET"
    })
      .then(res => res.json())
      .catch(err => console.error("Error:", err))
      .then(res => {
        let photos = res["photos"]["photo"];
        //send photos to showPhotos() do the loop...boogie!
        showPhotos(photos);
      });
  }

  function synonym(searchQuery, words) {
    const holder = document.querySelector(".results");

    var searched = document.createElement("h3");
    searched.innerHTML = "Search was made for: " + searchQuery.toUpperCase();
    holder.appendChild(searched);

    var ul = document.createElement("ul");
    holder.appendChild(ul);

    words.forEach(function(word) {
      var link = document.createElement("a");
      link.href = "?search=" + word;
      link.classList.add("clickable");

      var li = document.createElement("li");
      link.innerHTML = word;
      ul.appendChild(li);
      li.appendChild(link);
    });

  }

  function showPhotos(photos) {
    const holder = document.querySelector(".results");
    var ul = document.createElement("ul");
    holder.appendChild(ul);

    photos.forEach(function(photo) {
      var link = document.createElement("a");
      link.href = photo["url_m"];
      link.classList.add("clickable");

      var li = document.createElement("li");
      var img = document.createElement("img");
      img.src = photo["url_m"];

      ul.appendChild(li);
      li.appendChild(link);
      link.appendChild(img);
      
    });
  }



  // function search() {
  //   const searchValue = document.querySelector('.search input').value;
  //   getWords(searchValue);
    
  // }

  // document.querySelector('.search button').on('click', search);



  if (!searchQuery) {
    searchQuery = "forest";
  }

  getWords(searchQuery);

}

