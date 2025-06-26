function renderToHTML(data) {
    const container = document.getElementById("books-list");
    container.innerHTML = data.map(book => `
        <div class="book">
            <h3>${book.title}
        `).join('');
}

fetch('google-books-book.json')
    .then(response => response.json())
    .then(data => renderToHTML(data))
    .catch(error => console.error("Error loading JSON:", error));