const express = require('express');
const router = express.Router();
const Pool = require('../db');
//Generate Payment report
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM inventory');//fetch all rows
        res.render('inventory', {inventory: result.rows});//pass rows to ejs
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating inventory report');
    }
});
module.exports = router;