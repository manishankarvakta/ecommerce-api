const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

// file uplode - product images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type.');

        if(isValid){
            uploadError = null;
        }

      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName =  file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  })
  
  const uploadOptions = multer({ storage: storage })


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
router.post(`/`, uploadOptions.single('image'), async (req, res)=>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalide category');

    const file = req.file;
    if(!file) return res.status(400).send('There is no product image in this request');
 
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
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

// update - gallery image
router.put(`/gallery-images/:id`,uploadOptions.array('images', 5), async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalide Product Id');
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files){
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`);
        })
    }


    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths,
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

module.exports = router;  