
// let form = document.querySelector('#search-form');
// form.addEventListener('submit', function(e) {
//     e.preventDefault;
//     alert('prevented');
// });

let searchInput = window.location.search;

let searchQuery = searchInput.substring(searchInput.lastIndexOf("=") + 1);

function getWords(searchQuery, callback) {
  let bhtSourceUrl = "http://words.bighugelabs.com/api/2/";
  let bigHugeLabsKey = "b997da9042a1e672b998a3ad43adcf8e/";
  let format = "/json";
  let bhtUrl = bhtSourceUrl + bigHugeLabsKey + searchQuery + format;

  return fetch(bhtUrl, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.error("Error:", err))
    .then(res => {
      getPhotos(searchQuery);
      console.log(res);

      if (res["noun"]) {
        let words = res["noun"]["syn"];
        console.log(words);
        synonym(searchQuery, words);
      } else if (res["verb"]) {
        let words = res["verb"]["syn"];
        console.log(words);
        synonym(searchQuery, words);
      } else if (res["adjective"]) {
        let words = res["adjective"]["syn"];
        console.log(words);
        synonym(searchQuery, words);
      } else {
        console.log("No synonyms for " + searchQuery + " found :(");
      }
    });
}

function getPhotos(word, callback) {
  let flickrKey = "058845e531e8f0d1c14d2d7be959d3a9";
  let flickrSecret = "11a7a7a8e6cdf18b";
  let flickrQuery = "&tags=" + word + "&safe_search=1&extras=url_m&format=json&nojsoncallback=1";
  let flickrSourceUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
  let flickUrl = flickrSourceUrl + flickrKey + flickrQuery;

  return fetch(flickUrl, {
    method: "GET"
  })
    .then(res => res.json())
    .catch(err => console.error("Error:", err))
    .then(res => {
      console.log("Success:", res);
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

  console.log(searchQuery, words);
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

if (!searchQuery) {
  searchQuery = "forest";
}

getWords(searchQuery);
