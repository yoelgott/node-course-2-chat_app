var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
        console.log('disconnected from server');
    });

socket.on('newMessage', function(message) {
    console.log(message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
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
        console.log(location_m);
        var li = jQuery('<li></li>');
        var a = jQuery('<a target="_blank">My current location</a>');
        
        li.text(`${location_m.from}: `);
        a.attr('href', location_m.text);

        li.append(a);
        jQuery('#messages').append(li);
    });