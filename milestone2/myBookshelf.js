$(async function() {

let userId = '101044350015130496054';
let shelfId = 0;
let apiKey = 'AIzaSyDF2KU0miVRTUPzhKVmX2cXJCGQv5Z1Kb8';

let url = `https://www.googleapis.com/books/v1/users/${userId}` + 
        `/bookshelves/${shelfId}/volumes` + 
        `?maxResults=12&startIndex=0&key=${apiKey}`;

$.getJSON(url).then(data => {
    console.log(data.log);
})

})