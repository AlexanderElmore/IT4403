window.TPL_GRID_CARD = `
<article class="book-card" data-id="{{id}}">
    <img src="{{img}}" loading="lazy">
    <h3>{{title}}</h3>
    <p class="author">{{authors}}</p>
    <p>{{published}}</p>
</article>`;

window.TPL_LIST_ROW = `
<article class="book-row" data-id="{{id}}">
    <img src="{{img}}" loading="lazy">
    <div class="meta">
        <h3>{{title}}</h3>
        <p class="author">{{authors}}</p>
        <p class="pub">{{published}}</p>
    </div>
</article>`;

window.TPL_DETAILS = `
<article class="book-details">
    <img class="cover" src="{{img}}">
    <h2>{{title}}</h2>
    <p><strong>Author(s):</strong> {{authors}} </p>
    <p><strong>Publisher(s):</strong> {{publisher}} </p>
    <p><strong>Published:</strong> {{published}} </p>
    <p><strong>Pages:</strong> {{pages}} </p>
    <p><strong>Categories:</strong> {{categories}} </p>
    <p><strong>List Price:</strong> {{listPrice}} </p>
    <p><strong>Retail Price:</strong> {{retailPrice}} </p>
    <p class="desc"> {{{description}}} </p>
    <p><a href="{{infoLink}}" target="_blank" rel="noopener">View on Google Books</a></p>
</article>`;