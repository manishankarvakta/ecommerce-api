const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

// get - product list
router.get(`/`, async (req, res)=>{
    // localhost:3000/api/v1/products?categories=12,25,45
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter).populate('category');
    if(!productList){
        res.status(500).json({success: false});
    }
    res.send(productList);
})
 


// get - product by id
router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');
    if(!product){
        res.status(500).json({success: false});
    }
    res.send(product);
})


// post - creat new product
router.post(`/`, async (req, res)=>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalide category');

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if(!product){
        res.status(500).send('Product cannot be created!');
    }else{
        return res .send(product);
    }
     
});


// update
router.put(`/:id`, async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalide Product Id');
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalide category');

    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true,
        }
    );

    if(!product){
        return res.status(500).send('The product can not be updated!');
    }else{
        res.send(product);
    }
});

// delete - delete product by id
router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success: true, message:'The product has been deleted!'});
        }else{
            return res.status(404).json({success:false, message: "product does not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error: err})

    })
});


// get - product count
router.get(`/get/count`, async (req, res)=>{
    const productCount = await Product.countDocuments({});
    if(!productCount){
        res.status(500).json({success: false});
    }
    res.send({
        productCount: productCount,
    });
})


// get - featured product //must included the limit
router.get(`/get/featured/:count`, async (req, res)=>{
    const count = req.params.count ? req.params.count : '0';
    const products = await Product.find({isFeatured: true}).limit(+count);
    if(!products){
        res.status(500).json({success: false});
    }
    res.send(products);
})



module.exports = router;  