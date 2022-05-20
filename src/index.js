import './css/styles.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const searchInput = document.getElementById('search-box');
const countryInfo = document.querySelector('.country-info');
const listOfCountries = document.querySelector('.country-list');

searchInput.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  const searchedCountry = searchInput.value;
  if (searchedCountry === '') {
    cleanListCountries();
    cleanCountryInfo();
    return;
  }
  const countryMarkup = fetchCountries(searchedCountry);
  console.dir(countryMarkup);

  countryMarkup
    .then(countries => {
      if (countries.length === 1) {
        cleanListCountries();
        const cardRender = onlyOneCard(countries);
        countryInfo.innerHTML = cardRender;
      } else if (countries.length >= 2 && countries.length <= 10) {
        cleanCountryInfo();
        const cardRender = listCountries(countries);
        listOfCountries.innerHTML = cardRender;
        return;
      } else {
        tooMuchCountriesOnList();
        return;
      }
      //
    })
    .catch(() => {
      cleanListCountries();
      cleanCountryInfo();
      noSuchCountries();
    });
}

function onlyOneCard(allCountries) {
  return allCountries.map(country => {
    const { name, capital, population, flags, languages } = country;
    const allLang = languages.map(lang => lang.name).join(', ');

    return `<div class="card-markup">
        <div class="card-top">
          <img class="card-img" src="${flags.svg}" alt="" width="30" />
          <p class="card-text country">${name}</p>
        </div>
        <div class="card-meta">
          <p class="card-text"><label class="card-label">Capital:</label> ${capital}</p>
          <p class="card-text"><label class="card-label">Population:</label> ${population}</p>
          <p class="card-text"><label class="card-label">Languages:</label> ${allLang}</p>
        </div>
      </div>`;
  });
}
function listCountries(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li class='country-list-item'><img src ="${flags.svg}" alt='flag' width = 30><p class="list-country-name">${name}</p></li>`,
    )
    .join('');
}
function tooMuchCountriesOnList() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}
function noSuchCountries() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function cleanListCountries() {
  listOfCountries.innerHTML = '';
}

function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}
