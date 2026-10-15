const express = require('express');
const router = express.Router();
const pool = require('../db'); // Replace with your PostgreSQL pool configuration


// Search items by name
router.get('/api/inventory1/search', async (req, res) => {
  const { keyword } = req.query;

  try {
    const result = await pool.query(
      `SELECT item_id, item_name FROM inventory WHERE item_name ILIKE $1 LIMIT 10`,
      [`%${keyword}%`]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
});



// Add or Update Item
router.post('/inventory', async (req, res) => {
    const { mode, item_id, item_name, quantity, procured_date, is_resale, unit_price } = req.body;
  
    try {
      if (mode === 'add') {
        // Add new item
        const result = await pool.query(
          `INSERT INTO inventory (item_name, quantity, procured_date, is_resale, unit_price)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [item_name, quantity, procured_date, is_resale, unit_price]
        );
        return res.status(201).json({ message: 'Item added successfully', item: result.rows[0] });
      } else if (mode === 'update') {
        // Update existing item: Add new quantity to the existing quantity
        const result = await pool.query(
          `UPDATE inventory
           SET quantity = quantity + $1,
               unit_price = $2,
               procured_date = $3,
               is_resale = $4
           WHERE item_id = $5
           RETURNING *`,
          [quantity, unit_price, procured_date, is_resale, item_id]
        );
  
        // Check if the item was updated
        if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Item not found' });
        }
  
        return res.status(200).json({ message: 'Item updated successfully', item: result.rows[0] });
      } else {
        return res.status(400).json({ message: 'Invalid mode selected' });
      }
    } catch (err) {
      console.error('Error processing inventory request:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });

  //Get inventory items
router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM inventory');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
});
module.exports= router