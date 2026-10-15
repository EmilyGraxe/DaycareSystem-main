const express = require('express');
const router = express.Router();
const Pool = require('../db');
//Generate sitter report
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM babies');//fetch all rows
        res.render('babies', {babies: result.rows});//pass rows to ejs
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating babies report');
    }
});
module.exports = router;