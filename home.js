let pageSize = 12;
let currentPage = 1;
let totalItems = 0;
let lastQuery = '';
const cache = {};

const placeholder = 'googleBooksPlaceholder.png'

async function fetchPage(query, page = 1){
    const key = `${query}|${page}|${pageSize}`;
    if (cache[key]) return cache[key];

    const start = (page - 1) * pageSize;
    const url   = `https://www.googleapis.com/books/v1/volumes`
            + `?q=${encodeURIComponent(query)}`
            + `&maxResults=${pageSize}`
            + `&startIndex=${start}`;

    try {
        const data = await $.getJSON(url);
        totalItems = data.totalItems ?? 0;
        return (cache[key] = data.items ?? []);
    } catch (err) {
        $('#results').text('Apologies, Network Error');
        throw err;
    }
}

async function showPage(query, page = 1){
    lastQuery = query;
    currentPage = page;

    const books = await fetchPage(query, page);

    const $grid = $('<div>', { class: 'results' });

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

    /* Build Pager */
    const pages = Math.max(1, Math.ceil(totalItems / pageSize));
    
    const $pager = $('<nav>', { class: "pager" });
    const $ul = $('<ul>').appendTo($pager);

    const addBtn = (label, p, disabled = false) => {
        $('<li>').append(
            $('<button>', {
                text: label,
                disabled
            }).on('click', () => showPage(query, p))
        ).appendTo($ul);
    };

    addBtn('Prev <', page - 1, page === 1);

    let first = Math.max(1, page-2);
    let last = Math.min(pages, page+2);
    if(first > 1) addBtn('1', 1);
    if(first > 2) $('<li>').text("...").appendTo($ul);

    for(let i = first; i <= last; i++) addBtn(String(i), i);

    if (last < pages - 1) $('<li>').text('...').appendTo($ul);
    if (last < pages) addBtn(String(pages), pages);

    addBtn('Next >', page + 1, page === pages);

    $('#results').empty().append($grid, $pager);

    window.scrollTo({top: 0, behavior: 'smooth'});
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