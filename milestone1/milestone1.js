function renderToHTML(data) {
    const container = document.getElementById("books-list");
    container.innerHTML = data.map(book => `
        <div class="book">
            <div>${book.volumeInfo.title}</div>
        </div>
        `).join('');
}

fetch('google-books-book.json')
    .then(response => response.json())
    .then(data => renderToHTML(data))
    .catch(error => console.error("Error loading JSON:", error));

function renderToHTML2(data) {
    const container = document.getElementById("search-list");
    container.innerHTML = data.map(book => `
        <div class="book">
            <div>${book.volumeInfo.title}</div>
        </div>
        `).join('');
}

fetch('google-books-search.json')
    .then(response => response.json())
    .then(data => renderToHTML2(data.items))
    .catch(error => console.error("Error loading JSON:", error));
