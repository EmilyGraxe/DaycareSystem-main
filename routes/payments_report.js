const express = require('express');
const router = express.Router();
const Pool = require('../db');
//Generate Payment report
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM payments');//fetch all rows
        res.render('payments', {payments: result.rows});//pass rows to ejs
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating payment report');
    }
});
module.exports = router;