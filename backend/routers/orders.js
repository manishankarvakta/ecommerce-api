const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res)=>{
    const orderList = await Order.find();
    
    res.send(orderList);
})
 


router.post(`/`, (req, res)=>{
    const Order = new Order({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });

    order.save().then((createdorder=>{
        res.status(201).json(createdorder);
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false,
        })
    })
});


module.exports = router; 