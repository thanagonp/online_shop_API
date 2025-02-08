const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

const { UserController } = require('./controller/Usercontroller');
const { CompanyController } = require('./controller/CompanyController');
const { ProductController } = require('./controller/ProductController');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});


//
//Users
//
app.post('/api/user/signin', UserController.signin);


//
//company
//
app.post('/api/company/create', CompanyController.create);
app.get('/api/company/list', CompanyController.list);

//
//product
//
app.post('/api/buy/create', ProductController.create);



