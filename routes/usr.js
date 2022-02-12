const express = require('express');
const {body} = require("express-validator");
const router = express.Router();
const {database} = require('../config/helpers')


/* GET all orders listing. */
router.get('/', function(req, res) {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit :100; //items per page
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit; //0, 10,20
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }
    database.table('users')
        .withFields([
            'username' ,
            'email',
            'fname',
            'lname',
            'role',
            'longid',
            'photoUrl',
            'type',
            'joindate',
            'longidchar'
        ]).slice(startValue, endValue).sort({ longid: -1 }).getAll().then(news => {
        if (news.length > 0) {
            res.status(200).json({
                count: news.length,
                user: news
            });

        } else {
            res.json({ message: 'No Accounts found!!!!' });
        }
    }).catch(err => console.log(err));







});

router.post('/new',(req,res) => {

    let {id, email, name, photorul, firstname, lastname, type,fullid, longidchar} =req.body
    database.table('users').insert(
        {
            longid: id,
            username: name,
            email: email,
            photoUrl: photorul,
            fname: firstname,
            lname: lastname,
            type:type,
            fullid:fullid,
            longidchar:longidchar
        }
    ).catch(err => res.json())


});


// REGISTER ROUTE
router.post('/register', [
    body('id').custom(value => {
        return database.table('user').filter({
            $or:
                [
                    {longid: value}
                ]
        }).get().then(user => {
            if (user) {
                // console.log(user);
                return Promise.reject('account already registred');
            }
        })
    })
], async (req, res) => {
    let {id,password, email, name, photorul, firstname, lastname} =req.body
    {
        database.table('user').insert({
            longid:id,
            username: name,
            email: email,
            photoUrl: photorul || null,
            fname: firstname || null,
            lname: lastname || null,
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({message: 'Registration successful.'});
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});




router.get('/:userId', (req, res) => {
    let userId = req.params.userId;
    database.table('users').filter({longid: userId})
        .withFields([ 'username' , 'email','fname', 'lname', 'role', 'longid', 'photoUrl', 'type', 'joindate' ])
        .get().then(user => {
        if (user) {
            res.json({user});
        } else {
            res.json({message: `NO USER FOUND WITH ID : ${userId}`});
        }
    }).catch(err => res.json(err) );
});




router.post('/updateadmin/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('users').filter({longid: userId}).get();
    if (app) {


        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('users').filter({longid: userId}).update({


            role:"admin"
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});



router.post('/updatemod/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('users').filter({longid: userId}).get();
    if (app) {


        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('users').filter({longid: userId}).update({


            role:"moderator"
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});


router.post('/updateuser/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('users').filter({longid: userId}).get();
    if (app) {


        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('users').filter({longid: userId}).update({


            role:"user"
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});
router.post('/updatesadmin/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('users').filter({longid: userId}).get();
    if (app) {


        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('users').filter({longid: userId}).update({


            role:"superadmin"
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});

module.exports = router;
