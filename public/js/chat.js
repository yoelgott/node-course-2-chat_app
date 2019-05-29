var socket = io();

function scroll_to_bottom () {
    var messages = jQuery('#messages');
    var new_message = messages.children('li:last-child');

    var client_height = messages.prop('clientHeight');
    var scroll_top = messages.prop('scrollTop');
    var scroll_height = messages.prop('scrollHeight');
    var new_message_height = new_message.innerHeight();
    var last_message_height = new_message.prev().innerHeight();

    if (client_height + scroll_top + new_message_height + last_message_height >= scroll_height) {
        messages.scrollTop(scroll_height);
    };
};

socket.on('connect', function () {
    console.log('connected to server');
    
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }else {
            console.log('no error');
        }
    })
});

socket.on('disconnect', function () {
        console.log('disconnected from server');
    });

socket.on('updateUserList', function(users) {
    console.log('Users list', users);

    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
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

    scroll_to_bottom();
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var params = jQuery.deparam(window.location.search);

    socket.emit('createMessage',{
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

    var params = jQuery.deparam(window.location.search);

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

    scroll_to_bottom();
});