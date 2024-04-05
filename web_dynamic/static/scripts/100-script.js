let locationsList = { statesList: [], citiesList: [] };
let amenitiesList = [];
$(() => {
  // make a post request to fetch places
  getPlaces();

  // check the status of the api
  $.get("http://localhost:5001/api/v1/status/", function (data, status) {
    if (status === "success" && data.status === "OK") {
      $("#api_status").addClass("available");
    } else {
      $("#api_status").removeClass("available");
    }
  });

  // add event listeners for state inputs
  $(".state_checkbox").change(function () {
    if (this.checked) {
      locationsList.statesList.push(this.dataset);
    } else {
      locationsList.statesList = locationsList.statesList.filter(
        (state) => state.id !== this.dataset.id
      );
    }
    $(".locations h4").text(
      [...locationsList.statesList, ...locationsList.citiesList]
        .map((amenity) => `${amenity.name}`)
        .join(", ")
    );
  });
  // add event listeners for city inputs
  $(".city_checkbox").change(function () {
    if (this.checked) {
      locationsList.citiesList.push(this.dataset);
    } else {
      locationsList.citiesList = locationsList.citiesList.filter(
        (city) => city.id !== this.dataset.id
      );
    }
    $(".locations h4").text(
      [...locationsList.statesList, ...locationsList.citiesList]
        .map((amenity) => `${amenity.name}`)
        .join(", ")
    );
  });
  // add event listeners for amenity inputs
  $(".amenity_checkbox").change(function () {
    if (this.checked) {
      amenitiesList.push(this.dataset);
    } else {
      amenitiesList = amenitiesList.filter(
        (amenity) => amenity.id !== this.dataset.id
      );
    }
    $(".amenities h4").text(
      amenitiesList.map((amenity) => `${amenity.name}`).join(", ")
    );
  });

  // add event listener to filter button
  // $(".search_btn").on('click', getPlaces({amenities: amenitiesList}))
  $(".search_btn").on("click", () =>
    getPlaces({
      states: locationsList.statesList.map((state) => state.id),
      cities: locationsList.citiesList.map((city) => city.id),
      amenities: amenitiesList.map((amenity) => amenity.id),
    })
  );
});

// modified loadPlaces to use the map method of the array
function loadPlaces(response) {
  const placesHtmlArray = response.map(
    (place) => `<div class="place">
  <article>
    <div class="title_box">
      <h2>${place.name}</h2>
      <div class="price_by_night">$${place.price_by_night}</div>
    </div>
    <div class="information">
      <div class="max_guest">
        ${place.max_guest}  ${place.max_guest <= 1 ? " Guest" : " Guests"} 
      </div>
      <div class="number_rooms">
        ${place.number_rooms}  ${
      place.number_rooms <= 1 ? " Bedroom" : " Bedrooms"
    }
      </div>
      <div class="number_bathrooms">
        ${place.number_bathrooms}  ${
      place.number_bathrooms <= 1 ? " Bathroom" : " Bathrooms"
    }
      </div>
    </div>
    <div class="description">${place.description}</div>
  </article>
</div>`
  );
  $("DIV.place_items").html(
    placesHtmlArray.join("") || "<p>No Places match your requirements</p>"
  );
}

// uses data passed to it to send a POST request to
// get a list of places
function getPlaces(data) {
  $.ajax({
    url: "http://localhost:5001/api/v1/places_search",
    method: "POST",
    data: JSON.stringify(data || {}),
    headers: { "Content-Type": "application/json" },
    success: function (response) {
      loadPlaces(response);
    },
  });
}
