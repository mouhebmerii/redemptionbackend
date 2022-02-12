const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const {check, validationResult, body} = require('express-validator');
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/* GET ALL products. */
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
    database.table('whitelist as w')
        .withFields([
            'w.id',
            'w.email',
            'w.full_name',
            'w.dname',
            'w.age',
            'w.steamlink',
            'w.server_kno',
            'w.caractere_name',
            'w.rp_exp',
            'w.q1',
            'w.q2',
            'w.q3',
            'w.q4',
            'w.q5',
            'w.q6',
            'w.q7',
            'w.q8',
            'w.q9',
            'w.q10',
            'w.status',
            'w.date',
            'w.type'
        ]).slice(startValue, endValue).sort({ id: -1 }).getAll().then(prods => {
        if (prods.length > 0) {
            res.status(200).json({
                count: prods.length,
                post: prods
            });

        } else {
            res.json({ message: 'No Whitelist founds' });
        }
    }).catch(err => console.log(err));







});

/* Get product we7ed*/
router.get('/:whitelistid', (req , res)=>{
    let whitelistID = req.params.whitelistid;
    // console.log(productId);


    database.table('whitelist as w')
        .withFields([ 'w.id',
            'w.id',
            'w.email',
            'w.full_name',
            'w.dname',
            'w.age',
            'w.steamlink',
            'w.server_kno',
            'w.caractere_name',
            'w.rp_exp',
            'w.q1',
            'w.q2',
            'w.q3',
            'w.q4',
            'w.q5',
            'w.q6',
            'w.q7',
            'w.q8',
            'w.q9',
            'w.q10',
            'w.status',
            'w.date',
            'w.type'
        ]).filter({'w.id':whitelistID})
        .get().then(prod => {
        if (prod) {
            res.status(200).json(prod);

        } else {
            res.json({ message: `No whitelist-app found with product id ${whitelistID}` });
        }
    }).catch(err => console.log(err));
});


router.get('/search/:discord', (req , res)=>{
    let discordname = req.params.discord;
    // console.log(productId);


    database.table('whitelist as w')
        .withFields([ 'w.id',
            'w.id',
            'w.email',
            'w.full_name',
            'w.dname',
            'w.age',
            'w.steamlink',
            'w.server_kno',
            'w.caractere_name',
            'w.rp_exp',
            'w.q1',
            'w.q2',
            'w.q3',
            'w.q4',
            'w.q5',
            'w.q6',
            'w.q7',
            'w.q8',
            'w.q9',
            'w.q10',
            'w.status',
            'w.type'
        ]).filter({'w.email':discordname})
        .get().then(prod => {
        if (prod) {
            res.status(200).json(prod);

        } else {
            res.json({ message: `No whitelist-app found with product id ${discordname}` });
        }
    }).catch(err => console.log(err));
});

//
// router.post('/newtest',(req,res) => {
//
//     let {iq,email, name, discord, age, rpverif, joinverif,caracverif, rpveerif,objecetverif,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12} =req.body
//     database.table('whitelist').insert(
//         {
//             email: email,
//             name: name,
//             discord: discord,
//             age: age,
//             rpverif: rpverif,
//             joinverif:joinverif,
//             caracverif:caracverif,
//             rpveerif:rpveerif,
//             objecetverif:objecetverif,
//             q1:q1,
//             q2:q2,
//             q3:q3,
//             q4:q4,
//             q5:q5,
//             q6:q6,
//             q7:q7,
//             q8:q8,
//             q9:q9,
//             q10:q10,
//             q11:q11,
//             q12:q12,
//             status:'pending'}
//     ).catch(err => res.json(err))
//
//
// });

router.post('/new', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    body('email').custom(value => {
        return helper.database.table('whitelist').filter({
            $or:
                [
                    {email: value}
                ]
        }).get().then(user => {
            if (user) {
                console.log(user);
                return Promise.reject('Email / already exists, choose another one.');
            }
        })
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {

        let {email, full_name, dname, age, steamlink, rp_exp,server_kno, caractere_name,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10} =req.body

        /**
         * ROLE 777 = ADMIN
         * ROLE 555 = CUSTOMER
         **/
        helper.database.table('whitelist').insert({
            email: email,
            full_name: full_name,
            dname: dname,
            age: age,
            steamlink: steamlink,
            rp_exp:rp_exp,
            server_kno:server_kno,
            caractere_name:caractere_name,
            q1:q1,
            q2:q2,
            q3:q3,
            q4:q4,
            q5:q5,
            q6:q6,
            q7:q7,
            q8:q8,
            q9:q9,
            q10:q10,
            status:'pending',
            type:'form'
        }).catch(err => res.status(433).json({error: err}));
    }
});


router.patch('/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('whitelist').filter({id: userId}).get();
    if (app) {

        let status = req.body.status;

        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('whitelist').filter({id: userId}).update({


            status: status !== undefined ? status : app.status
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});


router.post('/updatea/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('whitelist').filter({id: userId}).get();
    if (app) {


        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('whitelist').filter({id: userId}).update({


            status:"accepted"
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});




router.post('/updater/:userId', async (req, res) => {
    let userId = req.params.userId;     // Get the User ID from the parameter

    // Search User in Database if any
    let app = await database.table('whitelist').filter({id: userId}).get();
    if (app) {


        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('whitelist').filter({id: userId}).update({


            status:"refused"
        }).then(result => res.json('User updated successfully')).catch(err => res.json(err));
    }
});


router.delete('/delete/:newsid', (req , res)=>{
    let NewsId = req.params.newsid;
    // console.log(productId);

    database.table('whitelist')
        .filter({id: NewsId})
        .remove()
        .then(result => res.json('Post Deleted successfully')).catch(err => res.json(err));


});
module.exports = router;
