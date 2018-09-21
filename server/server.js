const express = require('express');
const app = express();
const PORT = 2000;

app.use(express.static('./client/'));

app.listen(process.env.PORT || PORT);
