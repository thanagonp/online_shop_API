const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

const { UserController } = require('./controller/Usercontroller');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/user/signin', UserController.signin);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});