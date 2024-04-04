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
      // alert('online');
    } else {
      $('#api_status').removeClass('available');
        alert('offline');
    }
  });
});
