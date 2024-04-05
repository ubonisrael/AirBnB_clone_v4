let amenitiesList = [];
$(() => {
  // console.log($('.amenities h4').text())
  $('.amenity_checkbox').change(function () {
    if (this.checked) {
      amenitiesList.push(this.dataset);
    } else {
      amenitiesList = amenitiesList.filter(amenity => amenity.id !== this.dataset.id);
    }
    $('.amenities h4').text(amenitiesList.map(amenity => `${amenity.name}`).join(', '));
  });
});

$(() => {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (status === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});

$.ajax({
  url: 'http://0.0.0.0:5001/api/v1/places_search',
  method: 'POST',
  data: JSON.stringify({}),
  headers: { 'Content-Type': 'application/json' },
  success: function (response) {
    loadPlaces(response);
  }
});

function loadPlaces (response) {
  for (let i = 0; i < response.length; i++) {
    const place = response[i];
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
            </article>
          </div>
          `);
  }
}
