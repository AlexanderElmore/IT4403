let pageSize = 10;
let currentPage = 1;
let totalItems = 0;
let lastQuery = '';
let currentView = 'list';
let currentSlice = [];
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

async function showDetails(id) {
    $('#details').removeClass('hidden').html('<p class="loading">loading...</p>');
    const data = await $.getJSON(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`); 
    const b = data.volumeInfo;


    const html = Mustache.render(TPL_DETAILS, {
        title: b.title,
        authors: (b.authors || []).join(', '), 
        publisher: b.publisher ?? '-',
        published: b.publishedDate ?? '-',
        pages: b.pageCount ?? '-',
        description: b.description ?? '-',
        img: b.imageLinks?.thumbnail || placeholder,
        infoLink: b.infoLink
    });

    $('#details').html(html).scrollTop(0);

    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
    // console.log('DETAILS URL', JSON.stringify(url));

    // try {
    //     let data = await $.getJSON(url);
    //     let b = data.volumeInfo;
    //     let p = data.saleInfo;

    //     const img = b.imageLinks?.thumbnail
    //              || b.imageLinks?.smallThumbnail
    //              || placeholder;

    //     const html = `
    //         <article class="book-details">
    //             <img class="cover" src="${img}
    //                 onerror="this.onerror=null;this.src='googleBooksPlaceholder.png'">
    //             <h2>${b.title}</h2>
    //             <p><strong>Author(s):</strong> ${b.authors?.join(', ') ?? 'Author(s) unknown'}</p>
    //             <p><strong>Publisher(s):</strong> ${b.authors?.join(', ') ?? 'Unknown'}</p>
    //             <p><strong>Published:</strong> ${b.publishedDate ?? 'Publishing date unknown'}</p>
    //             <p><strong>Pages:</strong> ${b.pageCount ?? 'Unknown'}</p>
    //             <p><strong>Categories:</strong> ${b.categories?.join(', ') ?? 'Unknown'}</p>
    //             <p><strong>List Price:</strong> $${p.listPrice?.amount ?? 'Unknown'}</p>
    //             <p><strong>Retail Price:</strong> $${p.retailPrice?.amount ?? 'Unknown'}</p>
    //             <p><strong>Description:</strong> ${b.description ?? 'Description unavailable.'}</p>
    //             <p><a href="${b.infoLink}" target="_blank" rel="noopener">View on Google Books</a></p>
    //         </article>`;
    //     $('#details').html(html).scrollTop(0);
    // } catch (err) {
    //     $('#details').html('<p class="error>Apologies, error loading book!</p>');
    //     console.error(err);
    // }
}

async function showPage(query, page = 1){
    lastQuery = query;
    currentPage = page;

    const books = await fetchPage(query, page);
    currentSlice = books;

    renderBooks(books);

    buildPager(query, page);


    const viewHTML = (books || []).map(item => {
        const b = item.volumeInfo;
        return Mustache.render(TPL_GRID_CARD, {
            id: item.id,
            title: b.title,
            authors: (b.authors || ['Unknown']).join(', '),
            published: b.publishedDate ?? '',
            img: b.imageLinks?.thumbnail
              || b.imageLinks?.smallThumbnail
              || placeholder
        });
    }).join('');


    const $grid = $('<div>', { class: 'results' }).html(viewHTML);
    

    $('#results').empty().append($grid);

    window.scrollTo({top: 0, behavior: 'smooth'});
}

function renderBooks(items = []) {
    const tpl = currentView === 'grid' ? TPL_GRID_CARD : TPL_LIST_ROW;

    const html = items.map(item => {
        const b = item.volumeInfo;
        return Mustache.render(tpl, {
            title: b.title,
            authors: (b.authors || []).join(', '), 
            published: b.publishedDate ?? '-',
            img: b.imageLinks?.thumbnail || placeholder
        });
    }).join('');

    $('#results')
        .attr('data-view', currentView)
        .removeClass('grid-list')
        .addClass(currentView)
        .html(html);
}

function buildPager(query, page) {
    const pages = Math.min(5, Math.ceil(totalItems / 10));
    
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
}

$('#viewGrid, #viewList').on('click', function () {
    $('.toggle').removeClass('active');
    $(this).addClass('active');
    currentView = this.id ==='viewGrid' ? 'grid' : 'list';
    renderBooks(currentSlice)
})

function cacheSizeGuard(maxEntries = 30) {
    const keys = Object.keys(cache);
    if (keys.length > maxEntries) delete cache[keys[0]];
}

$('#bookSearch').on('submit', e => {
    e.preventDefault();

    $('#details')
        .addClass('hidden')
        .html('<p class="placeholder">Click a book to see details...</p>');

    const q = $(e.target).find('[name=q]').val().trim();
    if (q) showPage(q, 1);
});

$('#results').on('click', '[data-id]', function () {
    showDetails($(this).data('id'))
});

// $('#pageSize').on('change', function () {
//     pageSize = Number(this.value);
//     cacheSizeGuard();
//     if (lastQuery) showPage(lastQuery, 1);
// });