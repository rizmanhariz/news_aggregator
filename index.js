const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 9000;
const app = express();
app.listen(PORT);
console.log(`Server live on PORT: ${PORT}`);