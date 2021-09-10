const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

// get
router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

// get by id
router.get(`/:id`, async (req, res) =>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({success: false, message: 'The category with the given id is not found!'})
    } 
    res.status(200).send(category);
})

// post
router.post(`/`, async (req, res)=>{
    let category = await new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });

    category = await category.save();
    if(!category){
        return res.status(404).send('the category can not be created');
    }else{
        res.send(category);
    }
});


// update
router.put(`/:id`, async (req, res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        {
            new: true,
        }
    );

    if(!category){
        return res.status(404).send('The category can not be updated!');
    }else{
        res.send(category);
    }
});
 


// delete
router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(Category){
            return res.status(200).json({success: true, message:'The categotu has been deleted!'});
        }else{
            return res.status(404).json({success:false, message: "Category does not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error: err})

    })
})

module.exports = router; 