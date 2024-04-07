// eslint-disable-next-line no-undef
$(() => {
  // eslint-disable-next-line no-undef
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (status === 'success' && data.status === 'OK') {
      // eslint-disable-next-line no-undef
      $('#api_status').addClass('available');
    } else {
      // eslint-disable-next-line no-undef
      $('#api_status').removeClass('available');
    }
  });
});

let amenitiesList = [];
let citiesList = [];
let statesList = [];
let selectedCitiesStates = [];

// Manages amenities selection and updates UI accordingly.
// eslint-disable-next-line no-undef
$(() => {
  // eslint-disable-next-line no-undef
  $('.amenity_checkbox').change(function () {
    if (this.checked) {
      amenitiesList.push(this.dataset);
    } else {
      amenitiesList = amenitiesList.filter(amenity => amenity.id !== this.dataset.id);
    }
    // eslint-disable-next-line no-undef
    $('.amenities h4').text(amenitiesList.map(amenity => `${amenity.name}`).join(', '));

    requestAminities({
      amenities: amenitiesList.map(amenity => amenity.id),
      states: statesList.map(state => state.id),
      cities: citiesList.map(city => city.id)
    });
  });
});

// Manages states selection and updates UI accordingly.
// eslint-disable-next-line no-undef
$(() => {
  // eslint-disable-next-line no-undef
  $('.state_checkbox').change(function () {
    // eslint-disable-next-line no-undef
    if ($(this).is(':checked')) {
      statesList.push(this.dataset);

      selectedCitiesStates.push(this.dataset);
    } else {
      statesList = statesList.filter(state => state.id !== this.dataset.id);

      selectedCitiesStates = selectedCitiesStates.filter(state => state.id !== this.dataset.id);
    }
    const newText = selectedCitiesStates.map(cityState => `${cityState.name}`).join(', ');

    // eslint-disable-next-line no-undef
    $('.locations h4').text(newText);

    requestAminities({
      amenities: amenitiesList.map(amenity => amenity.id),
      states: statesList.map(state => state.id),
      cities: citiesList.map(city => city.id)
    });
  });
});

// Manages cities selection and updates UI accordingly.
// eslint-disable-next-line no-undef
$(() => {
  // eslint-disable-next-line no-undef
  $('.city_checkbox').change(function () {
    // eslint-disable-next-line no-undef
    if ($(this).is(':checked')) {
      citiesList.push(this.dataset);

      selectedCitiesStates.push(this.dataset);
    } else {
      citiesList = citiesList.filter(city => city.id !== this.dataset.id);

      selectedCitiesStates = selectedCitiesStates.filter(city => city.id !== this.dataset.id);
    }
    const newText = selectedCitiesStates.map(cityState => `${cityState.name}`).join(', ');

    // eslint-disable-next-line no-undef
    $('.locations h4').text(newText);

    requestAminities({
      amenities: amenitiesList.map(amenity => amenity.id),
      states: statesList.map(state => state.id),
      cities: citiesList.map(city => city.id)
    });
  });
});

// dict should be like: { states: statesList, cities: citiesList, amenities: amenitiesList}
requestAminities();
function requestAminities (dict = {}) {
  // eslint-disable-next-line no-undef
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    method: 'POST',
    data: JSON.stringify(dict),
    headers: { 'Content-Type': 'application/json' },
    success: function (response) {
      // eslint-disable-next-line no-undef
      $('DIV.place_items').empty();
      loadPlaces(response);
    }
  });
}

async function getReviews (placeID) {
  // eslint-disable-next-line no-undef
  const reviews = await $.get(`http://0.0.0.0:5001/api/v1/places/${placeID}/reviews`);

  return reviews;
}

async function getUserName (userId) {
  // eslint-disable-next-line no-undef
  const user = await $.get(`http://0.0.0.0:5001/api/v1/users/${userId}`);

  return (user.first_name + ' ' + user.last_name);
}
async function loadPlaces (response) {
  // console.log(response.length);
  for (let i = 0; i < response.length; i++) {
    const place = response[i];

    const reviews = await getReviews(place.id);
    const length = reviews.length;

    // eslint-disable-next-line no-undef
    $('DIV.place_items').append(`
          <div class="place">
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">
                  ${place.max_guest}  ${(place.max_guest <= 1 ? ' Guest' : ' Guests')} 
                </div>
                <div class="number_rooms">
                  ${place.number_rooms}  ${(place.number_rooms <= 1 ? ' Bedroom' : ' Bedrooms')}
                </div>
                <div class="number_bathrooms">
                  ${place.number_bathrooms}  ${(place.number_bathrooms <= 1 ? ' Bathroom' : ' Bathrooms')}
                </div>
              </div>
              <div class="description">${place.description}</div>
              <div class=reviews>
                <h2>${length} Reviews <span href="javascript:void(0);" onclick="ToggleBox(); data-id=${place.id}">Show</span></h2>
                <ul>
                </ul>
              </div>
            </article>
          </div>
          `);

    reviews.forEach(async function (review) {
      const userName = await getUserName(review.user_id);

      // eslint-disable-next-line no-undef
      $('DIV.reviews UL').append(`
                    <li>
                      <h3>From ${userName} the ${formatDate(review.updated_at)}</h3>
                      <p>${review.text}</p>
                    </li>
      `);
    });
  }
}

function ToggleBox () {
  // eslint-disable-next-line no-undef
  $('.reviews UL').slideToggle();
}

function formatDate (datetimeString) {
  const date = new Date(datetimeString);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const suffixes = ['st', 'nd', 'rd', 'th'];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const suffix = suffixes[(day - 1) % 10] || suffixes[3];

  const formattedDate = `${day}${suffix} of ${months[monthIndex]} ${year}`;

  return formattedDate;
}
