const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');



/* GET ALL news. */
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
    database.table('news as n')
        .withFields([
            'n.id',
            'n.title',
            'n.body',
            'n.picture',
            'n.createdate'
        ]).slice(startValue, endValue).sort({ id: -1 }).getAll().then(news => {
        if (news.length > 0) {
            res.status(200).json({
                count: news.length,
                post: news
            });

        } else {
            res.json({ message: 'No news found!!!!' });
        }
    }).catch(err => console.log(err));







});

/* Get product we7ed*/
router.get('/:newsid', (req , res)=>{
    let NewsId = req.params.newsid;
    // console.log(productId);


    database.table('news as n')
        .withFields(['n.id',
            'n.title',
            'n.body',
            'n.picture',
            'n.createdate',

        ]).filter({'n.id':NewsId})
        .get().then(prod => {
        if (prod) {
            res.status(200).json(prod);

        } else {
            res.json({ message: `No news found with news id ${NewsId}` });
        }
    }).catch(err => console.log(err));
});

router.post('/new',(req,res) => {
    let {title,body,picture} =req.body

    database.table('news').insert(
        {
            title: title,
            body: body,
            picture: picture,

        }
    ).catch(err => res.json(err))
});


router.delete('/delete/:newsid', (req , res)=>{
    let NewsId = req.params.newsid;
    // console.log(productId);

        database.table('news')
        .filter({id: NewsId})
        .remove()
        .then(result => res.json('Post Deleted successfully')).catch(err => res.json(err));


});

router.post('/new',(req,res) => {
    let {title,body,picture} =req.body

    database.table('news').insert(
        {
            title: title,
            body: body,
            picture: picture,

        }
    ).catch(err => res.json(err))
});
module.exports = router;
