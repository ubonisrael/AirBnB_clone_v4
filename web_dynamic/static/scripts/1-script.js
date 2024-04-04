let amenitiesList = []
$(() => {
  // console.log($('.amenities h4').text())
  $('.amenity_checkbox').change(function () {
    if (this.checked) {
      amenitiesList.push(this.dataset);
    } else {
      amenitiesList = amenitiesList.filter(amenity => amenity.id != this.dataset.id);
    }
    $('.amenities h4').text(amenitiesList.map(amenity => `${amenity.name}`).join(', '));
  });
});
