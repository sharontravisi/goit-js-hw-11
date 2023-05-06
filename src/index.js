import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const btnSubmit = document.querySelector('.search-form');
const input = document.querySelector('input');

btnSubmit.addEventListener('submit', onSubmit);

const parameters = {
  key: '36100509-cefa0799b958b9cf46d136602',
  url: 'https://pixabay.com/api/',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
};

const fetchPhoto = async (q, page) => {
  try {
    const response = await axios.get(
      `${parameters.url}?key=${parameters.key}&q=${q}&image_type=${parameters.image_type}&safesearch=${parameters.safesearch}&orientation=${parameters.orientation}&page=${page}&per_page=${parameters.per_page}`
    );
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

let page = 1;
let pages = 0;

const galleryEl = document.querySelector('.gallery');
const simpleLightbox = new SimpleLightbox('.gallery a');

function clearArticlesContainer() {
  galleryEl.innerHTML = '';
}

function createMarkupForCard(items) {
  galleryEl.innerHTML = ' ';
  const markupForCard = items
    .map(
      item =>
        `<a class="photo-card__link" href="${item.largeImageURL}"><div class="photo-card"><img class="photo-card__img" src="${item.webformatURL}" data-source="${item.largeImageURL}" alt="${item.tags}" loading="lazy" /><div class="info"><p class="info-item"><strong>Likes</strong>${item.likes}</p><p class="info-item"><strong>Views</strong>${item.views}</p><p class="info-item"><strong>Comments</strong>${item.comments}</p><p class="info-item"><strong>Downloads</strong>${item.downloads}</p></div></div></a>`
    )
    .join(``);
  galleryEl.insertAdjacentHTML('beforeend', markupForCard);
  simpleLightbox.refresh();
}

function addPhotoToGallery(items) {
  const markupForCard = items
    .map(
      item =>
        `<a class="photo-card__link" href="${item.largeImageURL}"><div class="photo-card"><img class="photo-card__img" src="${item.webformatURL}" data-source="${item.largeImageURL}" alt="${item.tags}" loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b>${item.likes}</p><p class="info-item"><b>Views</b>${item.views}</p><p class="info-item"><b>Comments</b>${item.comments}</p><p class="info-item"><b>Downloads</b>${item.downloads}</p></div></div></a>`
    )
    .join(``);
  galleryEl.insertAdjacentHTML('beforeend', markupForCard);
  simpleLightbox.refresh();
}

function onSubmit(e) {
  e.preventDefault();
  clearArticlesContainer();
  btnSubmit.disabled = true;
  const submitValue = e.currentTarget.searchQuery.value.trim();
  if (submitValue === '') {
    return;
  } else {
    searchResult(submitValue);
    btnLoadMore.style.opacity = '1';
    btnLoadMore.disabled = false;
  }
}

const searchResult = async submitValue => {
  page = 1;
  try {
    const respons = await fetchPhoto(submitValue, page);
    if (respons.data.totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.disabled = true;
      btnLoadMore.style.opacity = '0';
      return;
    } else createMarkupForCard(respons.data.hits);
    alertImagesFound(respons.data);

    pages = respons.data.totalHits / 40;
  } catch (error) {
    console.log(error.message);
  }
};

function alertImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}
const btnLoadMore = document.querySelector('.load-more');

btnLoadMore.addEventListener('click', addEltoGallery);
btnLoadMore.style.opacity = '0';

async function addEltoGallery(submitValue) {
  page += 1;
  try {
    if (Math.ceil(pages) >= page) {
      const respons = await fetchPhoto(input.value, page);
      addPhotoToGallery(respons.data.hits);

      btnLoadMore.disabled = false;
    } else {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.disabled = true;
      btnLoadMore.style.opacity = '0';
    }
  } catch (error) {
    console.log(error.message);
  }
}
