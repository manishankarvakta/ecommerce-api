const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken'); 
 
// get - user
router.get(`/`, async (req, res)=>{
    const userList = await User.find().select('-passwordHash');
    
    res.send(userList);
})
 
// get - user by id
router.get(`/:id`, async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({success: false, message: 'The user with the given id is not found!'})
    } 
    res.status(200).send(user);
})



// post - create user
router.post(`/`, async (req, res)=>{
    let user = await new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    user = await user.save();
    if(!user){
        return res.status(404).send('the user can not be created');
    }else{
        res.send(user);
    }
});


// post- login user
router.post(`/login`, async (req, res)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return res.status(404).send('The User not found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const secret = process.env.secret;
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret
            // {expiresIn: '1d'}
        )
        return res.status(200).send({
            user: user.email,
            token: token
        });
    }else{
        res.status(400).send('Password is wrong!');
    }

});


// post - register user
router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

// delete - user by id
router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


// get - user count
router.get(`/get/count`, async (req, res)=>{
    const userCount = await User.countDocuments({});
    if(!userCount){
        res.status(500).json({success: false});
    }
    res.send({
        userCount: userCount,
    });
})

module.exports = router; 