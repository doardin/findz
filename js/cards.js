let items;
const itemsPerPage = 8;
let currentPage = 1;
let totalPages = 1;


async function fetchData(path) {
    const response = await fetch(path);
    const data = await response.json();
    return data;
}

function createCards(data) {
    const cardsDiv = document.getElementById("cards-container");
    cardsDiv.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = "card";

        const tagsHTML = item.tags.map(tag => `<a href="#" class="badge badge-success">${tag}</a>`).join('\n');

        card.innerHTML = `
            <div class="card-img">
                <img class="card-img-top"
                    src="${item.image}"
                    alt="Card image cap">
            </div>
            <div class="card-body">
                <div>
                    <h5 class="card-title" style="font-weight: bold; margin: 0;">${item.name}</h5>
                    <h6 class="card-text" style="font-weight: bold; margin: 0;color: green;">¥${item.value}</h6>
                </div>
                <div class="card-tags">
                    ${tagsHTML}
                </div>
            </div>
            <div class="card-footer">
                <a href="${item.cssBuyLink}" class="btn btn-success" style="width: 100%;">Ir para CSSBuy</a>
            </div>`;
        cardsDiv.appendChild(card);
    });
}

function createPaginationButtons() {
    const paginationContainer = document.getElementById("pagination-buttons");
    paginationContainer.innerHTML = "";

    if (totalPages == 1) {
        return
    }

    for (let i = 1; i <= totalPages; i++) {
        const pagination = document.createElement('li');
        pagination.className = 'page-item';

        pagination.addEventListener("click", () => {
            currentPage = i;
            if (searchInput.value === "") {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = currentPage * itemsPerPage;
                const itemsToShow = items.slice(startIndex, endIndex);
                createCards(itemsToShow);
            } else {
                search();
            }
        });
        pagination.innerHTML = `
            <a class="page-link" href="#">${i}</a>
        `;
        paginationContainer.appendChild(pagination);
    }
}

function search() {
    const searchInput = replaceSpecialChars(document.getElementById("search").value.toLowerCase());

    const filteredItems = items.filter(item => replaceSpecialChars(item.name.toLowerCase()).includes(searchInput));
    const container = document.getElementById("cards-container");
    container.innerHTML = "";
    const totalFilteredPages = Math.ceil(filteredItems.length / itemsPerPage);
    totalPages = totalFilteredPages > 0 ? totalFilteredPages : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    createCards(itemsToShow);
    createPaginationButtons();
}

function replaceSpecialChars(str) {
    str = str.replace(/[ÀÁÂÃÄÅ]/, "A");
    str = str.replace(/[àáâãäå]/, "a");
    str = str.replace(/[ÈÉÊË]/, "E");
    str = str.replace(/[Ç]/, "C");
    str = str.replace(/[ç]/, "c");

    return str.replace(/[^a-z0-9]/gi, '');
}

fetchData('https://raw.githubusercontent.com/doardin/findz/master/data.json')
    .then(data => {
        items = data;
        totalPages = Math.ceil(items.length / itemsPerPage);
        createCards(items.slice(0, itemsPerPage));
        createPaginationButtons();
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", search);