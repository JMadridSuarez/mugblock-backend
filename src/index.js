require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('../src/V1/routes/mainRouter');

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`CONNECTION ON PORT: ${PORT}`);
});


app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);

