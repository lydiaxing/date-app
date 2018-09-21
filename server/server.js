var express = require('express');
var app = express();
var PORT = 2000;
app.use(express.static('./client/'));
app.listen(PORT);
