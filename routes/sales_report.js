const express = require('express');
const router = express.Router();
const Pool = require('../db');
//Generate sales report
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM sales');//fetch all rows
        res.render('sales', {sales: result.rows});//pass rows to ejs
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating sales report');
    }
});
module.exports = router;