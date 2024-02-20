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
                    <h6 class="card-text" style="font-weight: bold; margin: 0;color: green;">¥${item.price}</h6>
                </div>
                <div class="card-tags">
                    ${tagsHTML}
                </div>
            </div>
            <div class="card-footer">
                <a href="${item.link}" class="btn btn-success" style="width: 100%;" target="_blank">Ir para CSSBuy</a>
            </div>`;
        cardsDiv.appendChild(card);
    });
}


function showHiddenPaginationButtons() {
    const previousButton = document.getElementById("btn-previous-page");
    previousButton.classList.add("hidden");

    const nextButton = document.getElementById("btn-next-page");
    nextButton.classList.add("hidden");

    previousButton.removeEventListener("click", previousButtonClickHandler);
    nextButton.removeEventListener("click", nextButtonClickHandler);

    if (totalPages > 1 && currentPage < totalPages) {
        nextButton.classList.remove("hidden");
        nextButton.addEventListener("click", nextButtonClickHandler);
    }

    if (currentPage > 1) {
        previousButton.classList.remove("hidden");
        previousButton.addEventListener("click", previousButtonClickHandler);
    }
}

function previousButtonClickHandler() {
    currentPage -= 1;
    const endIndex = currentPage * itemsPerPage;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const itemsToShow = items.slice(startIndex, endIndex);
    createCards(itemsToShow);
    showHiddenPaginationButtons();
    window.scrollTo(0, 0);
}

function nextButtonClickHandler() {
    currentPage += 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = items.slice(startIndex, endIndex);
    createCards(itemsToShow);
    showHiddenPaginationButtons();
    window.scrollTo(0, 0);
}

function search() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchInput));
    const container = document.getElementById("cards-container");
    container.innerHTML = "";
    const totalFilteredPages = Math.ceil(filteredItems.length / itemsPerPage);
    totalPages = totalFilteredPages > 0 ? totalFilteredPages : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    createCards(itemsToShow);
    showHiddenPaginationButtons();
}

fetchData('https://findz.s3.sa-east-1.amazonaws.com/data.json')
    .then(data => {
        items = data;
        totalPages = Math.ceil(items.length / itemsPerPage);
        createCards(items.slice(0, itemsPerPage));
        showHiddenPaginationButtons();
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", search);