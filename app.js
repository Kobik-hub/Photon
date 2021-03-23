//You can get your own api key from https://www.pexels.com/
const auth = config.API_KEY;
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
let searchValue;
const more = document.querySelector(".more");
let page = 1;
let fetchLink;
let currentSearch;
//Event Listeners

searchInput.addEventListener("input", (e) => (searchValue = e.target.value));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    const photographer = photo.photographer.split(" ").slice(0, 2).join(" ");
    galleryImg.innerHTML = `
    <div class="gallery-info">
    <p>${photographer}</p>
    <a  href=${photo.src.original} target="_blank" rel="noopener noreferrer">Download</a>
    </div>
    <img src=${photo.src.large}> </img>`;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated/?page=1&per_page=16";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(query) {
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=16"`;
  const data = await fetchApi(fetchLink);
  clear();

  generatePictures(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=16&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated/?page=${page}&per_page=16`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();
