
//To use .on() without jQuery
Node.prototype.on = window.on = function (name, fn) {
    this.addEventListener(name, fn);
  }
  
  NodeList.prototype.__proto__ = Array.prototype;
  
  NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
    this.forEach(function (elem, i) {
      elem.on(name, fn);
    });
  }

export function urlEncodeData(data) {
    return Object.keys(data).map((key) => {
        return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
}


// export function getPromiseDataFromAray(promises) {
//     return new Promise((resolve, reject) => {
//         Promise.all(promises)
//         .then(res => {
//             return res.map(type => type.json());
//         }).then(res => {
//             Promise.all(res)
//             .then(resolve);
//         })
//         .catch(reject);
//     });
// }