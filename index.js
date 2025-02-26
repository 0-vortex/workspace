const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Product = require('./models/product');
const methodOverride = require('method-override');
const categories = ['fruit', 'vegetable', 'dairy'];

mongoose.connect('mongodb://localhost:27017/farmStand', {
    useNewUrlParser: true
}, { useUnifiedTopology: true })
    .then(() => {
        console.log("MONGOCONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.get('/products/new', async (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {

    const newProduct = await new Product(req.body);
    await newProduct.save();
    res.redirect(`products/${newProduct._id}`);
})



/*app.get('/products/:id', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})*/

app.get('/products/:id', async (req, res) => {

    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {

    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})



app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);

})



app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');

})

app.listen(3000, () => {
    console.log("App is listening on Port 3000!")
})