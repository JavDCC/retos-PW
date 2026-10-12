document.addEventListener("DOMContentLoaded", () => { console.log("Loaded!") })

// - Buscar por título.
// - Ordenarlas por año o alfabéticamente.
// - Marcarlas como favoritas y que se recuerden.

// La vista actual dependera de:
// - el boton de categoria que se presione [Todas/Favoritas]
// - la opcion de ordenamiento activa [Recientes/Alfabeticamente]
// - cuales peliculas han sido agregadas como favoritas
// - el string como parametro de busqueda por titulo

//Placeholder
const ghost = document.querySelector("#item-box>p")

//Container
const item_box = document.querySelector("#item-box")
item_box.addEventListener("click", (item) => {
    if (item.target.matches("button")) toggleFavorite(item.target.closest(".card"))
})

//Tally
const tally = document.querySelector("header #tally")
const found = document.querySelector("main #tally")

//Inputs
const query = document.querySelector("header input")

//Buttons
const search = document.querySelector("header button")
search.addEventListener("click", () => {
    drawCards();
})

const categories = document.querySelector("#categories")
categories.addEventListener("click", (item) => {
    if (item.target.matches("button"))
        drawCards(item.target.textContent)
})

//Select
const orders = document.querySelector("#orders")
orders.addEventListener("change", () => {
    drawCards();
})

//Initial display of the catalog
start();

//Functions
function start() {
    console.log("Started!")
    try { drawCards(); }
    catch (error) { console.log(error); }
}

async function drawCards(category = "Todas") {
    let catalog = await loadCatalog();
    const favorites = loadFavorites();
    //Update 'favorites' tally
    tally.textContent = favorites.length;

    if (query.value !== "") {
        //SEARCH    - [query]
        catalog = catalog.filter(entry => entry.title.toLowerCase().includes(query.value.toLowerCase()))
    }
    if (category === "Favoritas") {
        //CATEGORY  - ["Todas", "Favoritas"]
        catalog = catalog.filter(entry => favorites.indexOf(String(entry.id)) !== -1)
    }
    switch (orders.value) {
        //ORDER     - ["Más recientes", "Alfabéticamente"]
        case "Más recientes":
            //Ordenar por fecha
            catalog.sort((a, b) => b.year - a.year);
            break;

        case "Alfabéticamente":
            //Ordenar por titulo
            catalog.sort((a, b) => a.title.localeCompare(b.title));
            break;

        default:
            break;
    }

    //Adjust placeholder visibility via the display CSS property
    ghost.style.setProperty("display", (catalog.length) ? "none" : "block");
    //Remove all existing .card elements to avoid duplciates
    item_box.querySelectorAll(".card").forEach(card => card.remove());
    //Update 'found' tally
    found.textContent = catalog.length

    //draw all <div class="card"> elements matching the various criteria
    // <div class="card">
    //     <img src="" alt="poster" />
    //     <img src="./media/item-star-off.jpg" alt="*" />
    //     <p>ID</p>
    //     <div>
    //         <h3>Name</h3>
    //         <p>Year</p>
    //         <p>Genre(s)</p>
    //         <button>* Agregar a favoritos</button>
    //     </div>
    // </div>
    catalog.forEach(entry => {
        const card = document.createElement("div")
        card.className = "card"
        card.dataset.id = entry.id

        const poster = document.createElement("img")
        poster.src = entry.image
        poster.alt = "poster"

        const star = document.createElement("img")
        star.alt = "*"
        star.src = "media/item-star-off.jpg"
        if (favorites.indexOf(String(entry.id)) !== -1) star.src = "media/item-star.jpg";

        const info = document.createElement("div")

        const title = document.createElement("h3")
        title.textContent = entry.title

        const year = document.createElement("p")
        year.textContent = entry.year

        const genre = document.createElement("p")
        genre.textContent = entry.genre

        const setFav = document.createElement("button")
        setFav.textContent = "* Agregar a favoritos"

        info.append(title, year, genre, setFav)
        card.append(poster, star, info)
        item_box.append(card)
    })
}

async function loadCatalog() {
    try {
        const temp = await fetch("catalog.json");
        const data = await temp.json();
        return data;
    }
    catch (error) { console.log(error); }
}

function loadFavorites() {
    try { return JSON.parse(localStorage.getItem("CineApp_favorites")) }
    catch (error) { console.log(error); return []; }
}

function saveFavorites(favList) {
    try { localStorage.setItem("CineApp_favorites", JSON.stringify(favList)); }
    catch (error) { console.log(error); }
}

function toggleFavorite(card) {
    if (card !== null) {
        const ID = card.dataset.id
        let favList = loadFavorites();
        const index = favList.indexOf(ID);

        if (index === -1) {
            favList.push(ID);
            //update ID star
            card.querySelector("img:nth-child(2)").src = "media/item-star.jpg"
            // Update 'favorite' tally
            tally.textContent = favList.length;
        }
        else {
            favList.splice(index, 1);
            //update ID star
            card.querySelector("img:nth-child(2)").src = "media/item-star-off.jpg"
            // Update 'favorite' tally
            tally.textContent = favList.length;
        }
        saveFavorites(favList);
    }
}