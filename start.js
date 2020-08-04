var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public")); //__dir and not _dir
app.listen(process.env.PORT || 5000, () => console.log("Started"));