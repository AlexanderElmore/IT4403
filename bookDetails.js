$(async function() {

    let params = new URLSearchParams(location.search);
    let id = params.get('id');

    if (!id) { $('#details').text('No book ID provided.'); return; }

    let url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;

    try {
        let data = await $.getJSON(url);
        let b = data.volumeInfo;
        let p = data.saleInfo;

        let img = data.imageLinks?.thumbnail
                     || b.imageLinks?.smallThumbnail
                     || placeholder;

        let $view = $(`
            <article class="book-details">
                <img class="cover" src="${img}">
                <div class="meta">
                    <h1>${b.title}</h1>
                    <p><strong>Author(s):</strong> ${b.authors?.join(', ') ?? 'Author(s) unknown'}</p>
                    <p><strong>Publisher(s):</strong> ${b.authors?.join(', ') ?? 'Unknown'}</p>
                    <p><strong>Published:</strong> ${b.publishedDate ?? 'Publishing date unknown'}</p>
                    <p><strong>Pages:</strong> ${b.pageCount ?? 'Unknown'}</p>
                    <p><strong>Categories:</strong> ${b.categories?.join(', ') ?? 'Unknown'}</p>
                    <p><strong>List Price:</strong> $${p.listPrice?.amount ?? 'Unknown'}</p>
                    <p><strong>Retail Price:</strong> $${p.retailPrice?.amount ?? 'Unknown'}</p>
                    <p><strong>Description:</strong> ${b.description ?? 'Description unavailable.'}</p>
                    <p><a href="${b.infoLink}" target="_blank" rel="noopener">View on Google Books</a></p>
                </div>
            </article>
            <p><a href="javascript:history.back()">Back to results</a></p>
        `);

        $('#details').empty().append($view);
    } catch (err) {
        console.error(err);
        $('#details').text('Apologies, error loading book!');
    }
});