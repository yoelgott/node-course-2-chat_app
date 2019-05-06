const moment = require('moment');

var generate_message = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

var generate_location_message = (from, lat, long) => {
    return {
        from,
        text: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: moment().valueOf()
    };
};

module.exports = {
    generate_message,
    generate_location_message
};