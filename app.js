
var flickrKey = '058845e531e8f0d1c14d2d7be959d3a9';
var flickrSecret = '11a7a7a8e6cdf18b';

var bigHugeLabsKey = 'b997da9042a1e672b998a3ad43adcf8e';

let searchInput = window.location.search;

let searchQuery = searchInput.substring(searchInput.lastIndexOf('=') + 1);



function getWords(searchQuery, callback) {
    let bhtUrl =`http://words.bighugelabs.com/api/2/${bigHugeLabsKey}/${searchQuery}/json`
    return fetch(bhtUrl, {
    method: 'GET',
  }).then(res => res.json())
        .then(res => {
            getPhotos(searchQuery);
            console.log(res);
                
            if(res['noun']) {
                let words = res['noun']['syn'];
                console.log(words);
                synonym(searchQuery, words);
                
            } else if(res['verb']) {
                let words = res['verb']['syn'];
                console.log(words);
                synonym(searchQuery, words);
                
            } else if (res['adjective']) {
                let words = res['adjective']['syn'];
                console.log(words);
                synonym(searchQuery, words);
            } else {
                console.log('No synonyms for ' + searchQuery + ' found :(');
            }
        })   
    .catch(err => console.error('Error:', err));
    
  }

function getPhotos(word, callback) {
    let flickUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrKey}&tags=${word}&safe_search=1&extras=url_m&format=json&nojsoncallback=1`;
    console.log(flickUrl);
    return fetch(flickUrl, {
        method: 'GET',
      }).then(res => res.json())
      .then(res => {
          console.log('Success:', res)
          let photos = res['photos']['photo'];
          //send photos to showPhotos() do the loop...boogie!
          showPhotos(photos);
          photos.forEach(function(photo) {
              console.log(photo['url_m']);
          })
        })
      .catch(err => console.error('Error:', err));
        
      
}

function synonym(searchQuery, words) {
    const holder = document.querySelector('.results');
    var ul = document.createElement('ul');
    holder.appendChild(ul);
    
    words.forEach(function(word) {
        var li = document.createElement('li');
            li.innerHTML = word;
            ul.appendChild(li);

        console.log(li);
        
        
    });
    console.log(searchQuery, words);
    
}

function showPhotos(photos) {
    const holder = document.querySelector('.results');
    var ul = document.createElement('ul');
    holder.appendChild(ul);
    
    photos.forEach(function(photo) {
        var img = document.createElement('img');
            img.src = photo['url_m'];
            ul.appendChild(img);

        console.log(img);
         
    });
}

if(!searchQuery) {
    searchQuery = 'forest';
}
 getWords(searchQuery);


 