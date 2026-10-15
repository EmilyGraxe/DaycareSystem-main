const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool configuration

// Route to record payments
router.post('/payments', async (req, res) => {
  const { baby_id, sitter_id, type, amount, payment_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO payments (type, amount, baby_id, payment_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [type, amount,baby_id, payment_date]
    );

    res.status(201).json({ message: 'Payment recorded successfully', payment: result.rows[0] });
  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Route to fetch baby names for search
router.get('/api/baby', async (req, res) => {
  const { keyword } = req.query;

  try {
    const result = await pool.query(
      `SELECT baby_id, name FROM babies WHERE name ILIKE $1`,
      [`%${keyword}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching baby names:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

//Get all payments
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM payments');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

module.exports = router;