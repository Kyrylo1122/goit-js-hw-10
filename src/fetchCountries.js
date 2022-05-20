const container = document.querySelector('.country-info');

export default function fetchCountries(name) {
  return fetch(`https://restcountries.com/v2/name/${name}`).then(res => {
    if (res.status !== 200) {
      return;
    }
    return res.json();
  });
}
