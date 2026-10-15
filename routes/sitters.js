const express = require("express");
const router = express.Router();
const Pool = require('../db');


//Add a new sitter
router.post('/register', async (req, res) => {
    //const selectedDays = req.body.on_duty;
   // console.log(selectedDays);
    const { name, location, dob, gender, next_of_kin, nin, recommendor_name, religion, education_level, contact, on_duty } = req.body;
     
    try {
        //validate location
        if (location.toLowerCase() !== 'mengo') {
            return res.status(400).send('Location must be Mengo');
        }

        const query = `INSERT INTO sitters (name, location, dob, gender, next_of_kin, nin, recommendor_name, religion, education_level, contact, on_duty)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        const values = [name, location, dob, gender, next_of_kin, nin, recommendor_name, religion, education_level, contact, on_duty];
        const result = await Pool.query(query, values);
        res.status(201).send('Sitter registered successfully');
        
    } catch (error) {
        console.error('Error while registering sitter:', error);
        
        res.status(500).send('An error occured while registering sitter');
    }
});


//Get All Sitters
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM sitters');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
});



module.exports = router;