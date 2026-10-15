const express = require('express');
const router = express.Router();
const Pool = require('../db');
//Generate sitter report
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM sitters');//fetch all rows
        res.render('sitters', {sitters: result.rows});//pass rows to ejs
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating sitter report');
    }
});
module.exports = router;