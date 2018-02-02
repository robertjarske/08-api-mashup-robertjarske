import "./styles/app.scss";
import { urlEncodeData, getPromiseDataFromArray, flatten } from "./helpers";


class Mashed {
  constructor(element) {
    this.root = element;

    this.search = this.search.bind(this);
    this.counter = 1;
    this.input = document.querySelector(".search input");

    this.eventListeners();    
    
  }
  
  eventListeners() {
    document.querySelector("#search-input").on("keyup", (e) => {
      if (e.keyCode === 13) {
        this.search();
      }
    });
    
    document.querySelector(".search button").on("click", this.search);

    document.querySelectorAll(".side ul").on("click", (event) => {
      let searchString = event.target.textContent;
      searchString = searchString ? searchString : searchValue;
      this.input.value = searchString ? searchString : searchValue;
      
      this.search()
    });
  }

  search(event, searchString = null) {

    let errorContainer = document.querySelector('#error');
    errorContainer.style.display = 'none';

    let searchValue = this.input.value;
    
    const isOnlyWhiteSpace = searchValue.match("^\\s*$") ? true : false;

    if ((!searchValue.length || !searchString), (isOnlyWhiteSpace)) {
      let error = 'That, my friend, is not a valid search'
      return this.errorHandler(error);
    }
    
    let loader = document.querySelector('.loader');
    loader.style.display = 'block';

    let apiCalls = [
      this.getPhotos(searchValue),
      this.getWords(searchValue),
    ]

    getPromiseDataFromArray(apiCalls)
      .then((result) => {
        this.showPhotos(result[0]);
        this.synonym(result[1]);
        loader.style.display = 'none';
      })
      .catch((reason) => {
        this.errorHandler(reason);
      });
  }

  getWords(query, callback) {
    let bhtSourceUrl = "http://words.bighugelabs.com/api/2/";
    let bigHugeLabsKey = process.env.BHT_API_KEY;
    let format = "/json";
    let bhtUrl = bhtSourceUrl + bigHugeLabsKey + "/" + query + format;

    return fetch(bhtUrl);
  }

  getPhotos(query, callback) {
    let flickrKey = process.env.FLICKR_API_KEY;
    let flickrSecret = process.env.FLICKR_SECRET;
    let flickrSourceUrl =
      "https://api.flickr.com/services/rest/?";

    let flickrQueryParams = {
      method: 'flickr.photos.search',
      api_key: flickrKey,
      sort: 'relevance',
      text: query,
      tags: query,
      safe_search: 1,
      license: "2,3,4,5,6,9",
      extras: 'url_m, owner_name',
      format: 'json',
      nojsoncallback: 1
    }

    let params = urlEncodeData(flickrQueryParams);
    
    let flickUrl = flickrSourceUrl + params;

    return fetch(flickUrl);
     
  }

  synonym(data) {
    
    let words = Object.keys(data).map(key => {
      return Object.values(data[key]).map(word => {
        return word;
      });
    });
    
    words = flatten(words);
    
    let side = document.querySelector(".side");

    let frag = document.createDocumentFragment();
    

    words.forEach(function(word) {
      let firstLetter = word.charAt(0).toUpperCase();
      let subStr = word.substring(1, word.length);
      
      let li = document.createElement("li");
      li.innerHTML = `${firstLetter + subStr}`;
      frag.appendChild(li);
    });
    
    let ul = document.querySelector('.side ul');
    ul.innerHTML = ""
    document.querySelector('.side ul').appendChild(frag);
    

  }

  showPhotos(data) {
    let photos = data.photos.photo;
    // let holder = document.querySelector(".results");
    
    
    if(!photos.length) {
      let p = document.createElement('p');
      p.classList.add('no-photo-p');
      p.innerHTML = "Oh no! <br> No photos found! <br> Here is a dog picture for you instead:";
      let img = document.createElement('img');
      img.classList.add('no-photo-img');
      img.src = 'https://loremflickr.com/320/240/dog';
      holder.appendChild(p);
      holder.appendChild(img);

    } else {
      let container = document.querySelector('.container');
      // container.classList.add('container');
      // holder.appendChild(container);
      
      
      let column1 = container.children[0];
      let column2 = container.children[1];
      let column3 = container.children[2];
      let column4 = container.children[3];
      
      column1.innerHTML= "";
      column2.innerHTML= "";
      column3.innerHTML= "";
      column4.innerHTML= "";
      

      let columnCounter = 0;
      let self = this;

      photos.forEach(function(photo) {
        
        let item = document.createElement('div');
        item.classList.add('item' + self.counter, 'contrast');
        
        let currentColumn = container.children[columnCounter];
        currentColumn.appendChild(item);

        item.style.backgroundImage = `url(${photo.url_m})`;
        
        let titleLink = document.createElement("a");
        titleLink.innerHTML = 'Uploaded by: ' + photo.ownername;
        titleLink.href = `https://www.flickr.com/photos/${photo.owner}`;
        titleLink.target = '_blank';
        titleLink.classList.add("owner-link");
        
        let link = document.createElement("a");
        link.target = '_blank'
        link.classList.add('photo-link');
        link.href = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
        link.textContent = 'Go to photo @ Flickr';
        
        
        item.appendChild(titleLink);
        item.appendChild(link);

        columnCounter >= 3 ? columnCounter = 0 : columnCounter++;
        self.counter >= 4 ? self.counter = 1 : self.counter++;
        
      });

    }
  }

  errorHandler(reason) {
    let errorContainer = document.querySelector('#error');
    errorContainer.textContent = reason + '. Try again!';
    errorContainer.style.display = 'block';
  }

}

(function() {
  new Mashed(document.querySelector("#mashed"));
})();
