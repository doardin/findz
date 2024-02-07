async function fetchData(path) {
    const response = await fetch(path);
    const data = await response.json();
    return data;
}

function createCards(data) {
    const cardsDiv = document.getElementById("cardsContainer");
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = "card";
        // card.style = "width: 18rem;height: 18rem;";

        card.innerHTML = `
            <img class="card-img-top"
                src="${item.image}"
                alt="Card image cap">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <h5 class="card-title" style="font-weight: bold; margin: 0;">${item.name}</h5>
                    <h6 class="card-text" style="font-weight: bold; margin: 0;color: green;">¥${item.value}</h6>
                </div>
                <div>
                    <a href="#" class="badge badge-secondary">Shoes</a>
                    <a href="#" class="badge badge-secondary">¥200~¥300</a>
                </div>
            </div>
            <div class="card-footer">
                <a href="#" class="btn btn-success" style="width: 100%;">Ir para CSSBuy</a>
            </div>`;

        cardsDiv.appendChild(card);
    });
}


fetchData('https://raw.githubusercontent.com/doardin/findz/master/data.json')
    .then(data => {
        items = data;
        createCards(data);
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
    });