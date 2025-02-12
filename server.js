const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

const { UserController } = require('./controller/Usercontroller');
const { CompanyController } = require('./controller/CompanyController');
const { ProductController } = require('./controller/ProductController');
const { SellController } = require('./controller/SellController');
const { ServiceController } = require('./controller/ServiceController');


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
app.get('/api/user/info', UserController.info);
app.put('/api/user/update', UserController.update);
app.get('/api/user/list', UserController.list);


//
//company
//
app.post('/api/company/create', CompanyController.create);
app.get('/api/company/list', CompanyController.list);

//
//product(buy)
//
app.post('/api/buy/create', ProductController.create);
app.get('/api/buy/list', ProductController.list);
app.put('/api/buy/update/:id', ProductController.update);
app.delete('/api/buy/remove/:id', ProductController.remove);

//
//Sell
//
app.post('/api/sell/create',SellController.create);
app.get('/api/sell/list', SellController.list);
app.delete('/api/sell/remove/:id', SellController.remove);
app.get('/api/sell/confirm', SellController.confirm);

//
//service
//
app.post('/api/service/create', ServiceController.create);
app.get('/api/service/list', ServiceController.list);
app.put('/api/service/update/:id', ServiceController.update);
app.delete('/api/service/remove/:id', ServiceController.remove);

