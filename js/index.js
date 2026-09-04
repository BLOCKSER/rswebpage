const searchInput = document.getElementById('search');
const clearButton = document.getElementById('searchbuttons');

function filterResults(query) {
    const items = document.querySelectorAll('.searchable');
    const normalizedQuery = query.trim().toLowerCase();

    items.forEach(item => {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const matches = title.includes(normalizedQuery);
        item.style.display = matches || normalizedQuery === '' ? '' : 'none';
    });
}

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        filterResults(searchInput.value);
    }
    if (e.key === 'Escape') {
        searchInput.value = '';
        filterResults('');
    }
});

clearButton.addEventListener('click', () => {
    searchInput.value = '';
    filterResults('');
    searchInput.focus();
});