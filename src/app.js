const express = require('express');
const app = express();

app.get("/",(req, res) => {
    res.send("Home Page 111111111111")
})

app.get("/hi",(req, res) => {
    res.send("Hellow from Hi Page")
})

app.get("/test",(req, res) => {
    res.send("Hellow from Test Page")
})


app.listen(3000, () => {
    console.log('Server is listening on port 3000')
});