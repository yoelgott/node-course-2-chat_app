var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
        console.log('disconnected from server');
    });

socket.on('newMessage', function(message) {
    console.log(message);
    var formated_time = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formated_time
    });

    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from:'User',
        text: jQuery('[name=message]').val()
    }, function(){
        jQuery('[name=message]').val('');
    });
});

var location_button = jQuery('#send-location');
location_button.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported in your browser.');
    };

    location_button.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        location_button.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        location_button.removeAttr('disabled').text('Send location');
        return alert('could not fetch location');
    });
});

socket.on('newLocationMessage', function(location_m) {
    console.log(location_m)
    var formated_time = moment(location_m.createdAt).format('h:mm a');
    var template = jQuery('#location-template').html();
    var html = Mustache.render(template, {
        text: location_m.text,
        from: location_m.from,
        createdAt: formated_time
    });

    jQuery('#messages').append(html);
});