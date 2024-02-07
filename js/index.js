function createTags() {
    const tags = new Set();
    items.forEach(item => {
        item.tags.forEach(tag => {
            tags.add(tag);
        });
    });
    const tagContainer = document.getElementById("tagContainer");
    tags.forEach(tag => {
        const label = document.createElement("label");
        label.style.marginRight = "10px"; // Adicione essa linha para adicionar margem entre os checkboxes
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;
        checkbox.className = "tag-checkbox";
        checkbox.addEventListener("change", () => {
            handleTagCheckboxChange();
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(tag));
        tagContainer.appendChild(label);
    });
}

function handleTagCheckboxChange() {
    const checkedCheckboxes = document.querySelectorAll('.tag-checkbox:checked');
    if (checkedCheckboxes.length === 0) {
        createCards(currentPage, items.slice(0, itemsPerPage));
        createPaginationButtons();
    } else {
        const filteredTags = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
        const filteredItems = items.filter(item => {
            return filteredTags.some(tag => item.tags.includes(tag));
        });
        const container = document.getElementById("cardContainer");
        container.innerHTML = "";
        const totalFilteredPages = Math.ceil(filteredItems.length / itemsPerPage);
        totalPages = totalFilteredPages > 0 ? totalFilteredPages : 1;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        const itemsToShow = filteredItems.slice(startIndex, endIndex);
        createCards(currentPage, itemsToShow);
        createPaginationButtons();
    }
}

async function fetchJSONFile(path) {
    const response = await fetch(path);
    const data = await response.json();
    return data;
}

function createCards(pageNumber, itemsToShow) {
    const container = document.getElementById("cardContainer");
    container.innerHTML = "";
    itemsToShow.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        const img = document.createElement("img");
        img.src = item.image;
        imgContainer.appendChild(img);

        card.appendChild(imgContainer);

        const content = document.createElement("div");
        content.classList.add("card-content");

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("card-content-div");
        content.appendChild(nameDiv);
        const name = document.createElement("p");
        name.textContent = item.name;
        nameDiv.appendChild(name);



        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("card-content-div");
        content.appendChild(descriptionDiv);
        const description = document.createElement("p");
        description.textContent = item.description;
        descriptionDiv.appendChild(description);
        content.appendChild(descriptionDiv);


        const valueDiv = document.createElement("div");
        valueDiv.classList.add("card-content-div");
        content.appendChild(valueDiv);

        const value = document.createElement("p");
        value.textContent = "Valor: ¥" + item.value;
        valueDiv.appendChild(value);
        content.appendChild(valueDiv);

        const tagsDiv = document.createElement("div");
        tagsDiv.classList.add("card-content-div");
        content.appendChild(tagsDiv);
        const tags = document.createElement("div");
        tags.classList.add("card-tag-container");
        item.tags.forEach(tag => {
            const tagElement = document.createElement("span");
            tagElement.classList.add("tag");
            tagElement.textContent = tag;
            tagElement.addEventListener("click", () => {
                filterByTag(tag);
            });
            tags.appendChild(tagElement);
        });
        tagsDiv.appendChild(tags);
        content.appendChild(tagsDiv);



        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");


        const cssBuyButton = document.createElement("button");
        cssBuyButton.textContent = "Ir para CSSBuy";
        cssBuyButton.addEventListener("click", () => {
            window.open(item.cssBuyLink, "_blank");
        });
        buttonContainer.appendChild(cssBuyButton);
        content.appendChild(buttonContainer)

        card.appendChild(content);

        container.appendChild(card);
    });
}

function createPaginationButtons() {
    if (totalPages == 1) {
        return
    }
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => {
            currentPage = i;
            if (searchInput.value === "") {
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = currentPage * itemsPerPage;
                const itemsToShow = items.slice(startIndex, endIndex);
                createCards(currentPage, itemsToShow);
            } else {
                search();
            }
        });
        paginationContainer.appendChild(button);
    }
}

function filterByTag(tag) {
    const filteredItems = items.filter(item => item.tags.includes(tag));
    const container = document.getElementById("cardContainer");
    container.innerHTML = "";
    const totalFilteredPages = Math.ceil(filteredItems.length / itemsPerPage);
    totalPages = totalFilteredPages > 0 ? totalFilteredPages : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    createCards(currentPage, itemsToShow);
    createPaginationButtons();
}

function search() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchInput));
    const container = document.getElementById("cardContainer");
    container.innerHTML = "";
    const totalFilteredPages = Math.ceil(filteredItems.length / itemsPerPage);
    totalPages = totalFilteredPages > 0 ? totalFilteredPages : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    createCards(currentPage, itemsToShow);
    createPaginationButtons();
}

let items;
const itemsPerPage = 14;
let currentPage = 1;
let totalPages = 1;

fetchJSONFile('https://raw.githubusercontent.com/doardin/findz/master/data.json')
    .then(data => {
        items = data;
        totalPages = Math.ceil(items.length / itemsPerPage);
        createTags();
        createCards(currentPage, items.slice(0, itemsPerPage));
        createPaginationButtons();
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", search);