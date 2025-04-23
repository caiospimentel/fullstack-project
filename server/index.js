const express = require('express');
const cors = require('cors');
const app = express();
const PORT_NUMBER = 5000;

app.use(cors());

app.use(express.json());


app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT_NUMBER, () => console.log('Server on htt://localhost:' + PORT_NUMBER));
