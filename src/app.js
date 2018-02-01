import "./styles/app.scss";
import { urlEncodeData } from "./helpers";
import { getPromiseDataFromArray } from "./helpers";

class Mashed {
  constructor(element) {
    this.root = element;

    this.search = this.search.bind(this);

    document.querySelector(".search button").on("click", this.search);

    this.input = document.querySelector(".search input");
  }

  search() {
    let searchValue = this.input.value;
    this.getWords(searchValue);
    this.getPhotos(searchValue);

    // let apiCalls = [
    //   this.getWords(searchValue),
    //   this.getPhotos(searchValue)
    // ]

    // getPromiseDataFromArray(apiCalls)
    //   .then((result) => {
    //     console.log(result)
    //   });

    this.input.value = "";
  }

  getWords(query, callback) {
    let bhtSourceUrl = "http://words.bighugelabs.com/api/2/";
    let bigHugeLabsKey = process.env.BHT_API_KEY;
    let format = "/json";
    let bhtUrl = bhtSourceUrl + bigHugeLabsKey + "/" + query + format;

    return fetch(bhtUrl, {})
      .then(res => res.json())
      .then(res => {
        if (res["noun"]) {
          let words = res["noun"]["syn"];
          this.synonym(query, words);

        } else if (res["verb"]) {
          let words = res["verb"]["syn"];
          this.synonym(query, words);

        } else if (res["adjective"]) {
          let words = res["adjective"]["syn"];
          this.synonym(query, words);

        } else {
          console.log("No synonyms for " + query + " found :(");
        }
      })
      .catch(err => {
        let side = document.querySelector(".side");
        side.innerHTML = "";
        let searched = document.createElement("h3");
        searched.classList.add("aside-heading");
        searched.innerHTML = "Search was made for: " + query.toUpperCase();
        let p = document.createElement("p");
        p.innerHTML = "Word and/or synonyms not found :(";

        side.appendChild(searched);
        side.appendChild(p);
        console.log('Error: ', err)
      });
  }

  getPhotos(query, callback) {
    let flickrKey = process.env.FLICKR_API_KEY;
    let flickrSecret = process.env.FLICKR_SECRET;
    let flickrSourceUrl =
      "https://api.flickr.com/services/rest/?";

    let flickrQueryParams = {
      method: 'flickr.photos.search',
      api_key: flickrKey,
      per_page: 10,
      sort: 'relevance',
      text: query,
      tags: query,
      safe_search: 1,
      extras: 'url_m',
      format: 'json',
      nojsoncallback: 1
    }

    let params = urlEncodeData(flickrQueryParams);
    
    let flickUrl = flickrSourceUrl + params;

    return fetch(flickUrl, {})
      .then(res => res.json())
      .then(res => {
        if(res["photos"]["total"] == 0) {
          let photos = null;
          this.showPhotos(photos);
        } else {
          let photos = res["photos"]["photo"];
          this.showPhotos(photos);
        }
      })
      .catch(err => console.error("Error:", err));
  }

  synonym(query, words) {
    
    let side = document.querySelector(".side");
    side.innerHTML = "";

    let searched = document.createElement("h3");
    searched.classList.add("aside-heading");
    searched.innerHTML = "Search was made for: " + query.toUpperCase();
    let p = document.createElement("p");
    p.innerHTML = "Do another search for:";

    side.appendChild(searched);
    side.appendChild(p);

    var ul = document.createElement("ul");
    side.appendChild(ul);

    words.forEach(function(word) {
      var link = document.createElement("a");
      link.href = "#";
      link.classList.add("clickable");

      var li = document.createElement("li");
      link.innerHTML = word;
      ul.appendChild(li);
      li.appendChild(link);
    });

    document.querySelectorAll(".clickable").on("click", e => {
      e.preventDefault();
      let value = e.currentTarget.innerHTML;
      this.getWords(value);
      this.getPhotos(value);
    });
  }

  showPhotos(photos) {
    const holder = document.querySelector(".results");
    holder.innerHTML = "";
    
    if(photos == null) {
      let p = document.createElement('p');
      p.classList.add('no-photo-p');
      p.innerHTML = "Oh no! <br> No photos found! <br> Here is a dog picture for you instead:";
      let img = document.createElement('img');
      img.classList.add('no-photo-img');
      img.src = 'https://loremflickr.com/320/240/dog';
      holder.appendChild(p);
      holder.appendChild(img);

    } else {
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
  }

}

(function() {
  new Mashed(document.querySelector("#mashed"));
})();
