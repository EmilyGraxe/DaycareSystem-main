const express = require('express');
const router = express.Router();
const Pool = require('../db');




//FETCH SITTERS
router.get('/sitters-on-duty', async (req, res) => {
    const {day} = req.query;
    try {
        const result = await Pool.query('SELECT sitter_id, name FROM sitters WHERE $1 = ANY(on_duty)', [day]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error while fetching sitters:', error);
        res.status(500).send('An error occured while fetching sitters');
    }
});
//Search for a baby
router.get('/search-baby', (req, res) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const searchQuery = `SELECT baby_id, name FROM babies WHERE name = ILIKE $1 LIMIT 10`;
    Pool.query(searchQuery, [`%${name}%`], (err, result) => {
        if (err) {
            console.error('Error while searching for baby:', err);
            return res.status(500).json({ error: 'An error occured while searching for baby' });
        }
        res.json(result.rows);
    })
});
//Register a baby
router.post('/register', async (req, res) => {
    const{name, gender, age, location, brought_by,time_of_arrival,  parents_names, fee,date, assigned_sitter} = req.body;
    if (!assigned_sitter || assigned_sitter.length > 1) {
        return res.status(400).send('You can only assign one sitter');
        
    }
    //wrap it to array
    let sitters = assigned_sitter;
    //join
    if(Array.isArray(sitters)){
        sitters = sitters.join(',');
    }

        try {
            const query =
                `INSERT INTO babies (name, gender, age, location, brought_by,time_of_arrival, parents_names, fee,date, assigned_sitter)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
              const values = [name, gender, age,  location, brought_by,time_of_arrival, parents_names, fee,date, sitters];
            
            const result = await Pool.query(query, values);
            res.status(201).send('Baby registered successfully');
        } catch (error) {
            console.error('Error while registering baby:', error);
            res.status(500).send('An error occured while registering baby');
        }
    
});

//Get all babies
router.get('/', async (req, res) => {
    try{
        const result = await Pool.query('SELECT * FROM babies WHERE status = TRUE');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
    });
    //Record baby departure
    router.put('/:id/departure', async (req, res) => {
        const {baby_id} = req.params.id;//by id
        const {person_taking, time_of_departure, comment,}  = req.body;//from the request body
        if (!baby_id || !person_taking || !time_of_departure || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        try {
            const result = await Pool.query(
                `UPDATE babies SET  person_taking = $1, time_of_departure = $2, comment =$3 WHERE baby_id =$4 RETURNING *`,
                [person_taking, time_of_departure, comment, baby_id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Baby not found' });
            }
            res.status(200).json({ message: 'Baby departure recorded successfully', baby: result.rows[0] });
        } catch (error) {
            console.error('Error while recording baby departure:', error);
            res.status(500).json({ error: error.message });
        }
    });
     
module.exports = router;