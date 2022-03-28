function initMap() {
      var myLatLng = {lat: 48.616017, lng: 37.526632};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: true,
        zoom: 14
    });
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: 48.617830, lng: 37.523181}, 
        title: 'Celentano',
        icon: 'img/icons/map-marker-icon.png'
    });
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: 48.613988, lng: 37.526767}, 
        title: 'Altair',
        icon: 'img/icons/map-marker-icon.png'
    });
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: 48.602280, lng: 37.535365}, 
        title: 'Royal',
        icon: 'img/icons/map-marker-icon.png'
    });
}

$(window).on('load', function () {
    var $preloader = $('#page-preloader'),
        $spinner   = $preloader.find('.spinner');
    $preloader.delay(1000).fadeOut('slow');
});