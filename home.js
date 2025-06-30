$('#search').on('submit', async function (e) {
    e.preventDefault();
    const query = $(this).find('[name=search]').val().trim();
    if (!query) return;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
    try {
        const data = await $.getJSON(url);
        $('#results').empty();
        data.items?.forEach(item => {
            const b = item.volumeInfo;
            $('#results').append(`
                <article class="book-card">
                    <h3>${b.title ?? 'Untitled'}</h3>
                    <p>${b.authors?.join(', ') ?? 'Unknown author'}</p>
                    <p>${b.publishedDate ?? ''}</p>
                </article>
                `);
        })
    } catch (err) {
        $('#results').text('Apologies, there seens to have been an error. Please try again.');
        console.error(err);
    }
});