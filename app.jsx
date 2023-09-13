const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("./DB/conn");
app.use(express.json());
app.use(cookieParser());
app.use(require("./Routes/auth"));
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app is listening at port ${PORT}`);
});
