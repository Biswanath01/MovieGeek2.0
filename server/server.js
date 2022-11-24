const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api', require("./routes/authRoute"));
app.use('/api', require('./routes/profileRoute'));
app.use('/api', require('./routes/watchListRoute'));
app.use('/api', require('./routes/discussionRoute'));
 
mongoose.connect(`mongodb://localhost:27017/mgeek`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => console.log("Connected to DB"))
.catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`server running at ${port}`);
});