const path = require('path');
const express = require('express');

var app = express();
const public_path = path.join(__dirname, '../public');

var port = process.env.PORT || 3000;

app.use(express.static(public_path));

app.listen(port, () => {
    console.log(`open on port ${port}`);
});