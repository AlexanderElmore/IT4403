const pageSize = 12;
let currentPage = 1;
let totalItems = 0;
let lastQuery = '';
const cache = {};

const placeholder = 'googleBooksPlaceholder.png'

async function fetchBooks(query, page = 1){
    const key = '${query}|${page}|${pageSize}';
    if (cache[key]) return cache[key];

    const start = (page - 1) * pageSize;
    const url   = `https://www.googleapis.com/books/v1/volumes`
            + `?q=${encodeURIComponent(query)}`
            + `&maxResults=${pageSize}`
            + `&startIndex=${start}`;

    $('#results').html('<p class="loading">Loading...</p>');

    try {
        const data = await $.getJSON(url);
        totalItems = data.totalItems ?? 0;
        cache[key] = data.items ?? [];
        return cache[key];
    } catch (err) {
        $('#results').text('Apologies, Network Error')
    }
}

async function showPage(query, page = 1){
    lastQuery = query;
    currentPage = page;

    const books = await fetchBooks(query, page);

    const $grid = $('<div>', { class: 'book-grid' });

    (books || []).forEach(({ volumeInfo: b }) => {
        const imgSrc = b.imageLinks?.thumbnail
                     || b.imageLinks?.smallThumbnail
                     || placeholder;

        $grid.append(`
            <article class="book-card">
                <img src="${imgSrc}"
                    loading="lazy">
                <h3>${b.title}</h3>
                <p class="author">${(b.authors || ['Unknown author']).join(', ')}</p>
                <p>${b.publishedDate ?? ''}</p>
            </article>
        `);
    });

    const pages = Math.max(1, Math.ceil(totalItems / pageSize));
    const $pager = $('<nav class="pager>');
    const $ul = $('<ul>');

    const addBtn = (label, p, disables = false) => {
        $('<li>').append(
            $('<button>', {
                text: label,
                disabled
            }).on('click', () => showPage(query, p))
        ).appendTo($ul);
    };

    addBtn('Next >', page + 1, page === pages);

    $pager.append($ul);

    $('#results').empty.append($grid, $pager);
}

function cacheSizeGuard(maxEntries = 30) {
    const keys = Object.keys(cache);
    if (keys.length > maxEntries) delete cache[keys[0]];
}

$('#bookSearch').on('submit', e => {
    e.preventDefault();
    const q = $(e.target).find('[name=q]').val().trim();
    if (q) showPage(q, 1);
});

$('#pageSize').on('change', function () {
    pageSize = Number(this.value);
    cacheSizeGuard();
    if (lastQuery) showPage(lastQuery, 1);
});