var generate_message = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};

var generate_location_message = (from, lat, long) => {
    return {
        from,
        text: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generate_message,
    generate_location_message
};