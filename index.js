//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


//initialise express app
const app = express();
const port = 3000;



//Middleware
app.use(cors());

//app.use(bodyParser.json());//for json
app.use(bodyParser.urlencoded({ extended: true }));//for html files
app.use(express.json());//for json
app.use(express.static(path.join(__dirname, 'public')));//Serve HTML,CSS,JS files


//EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





//call routes
//PDF ROUTES

const sitters_pay_pdfRoutes = require ('./routes/sitters_pay_pdf');
app.use('/sitters_pay_pdf', sitters_pay_pdfRoutes);

const sales_pdfRoutes = require ('./routes/sales_pdf');
app.use('/sales_pdf', sales_pdfRoutes);

const payments_pdfRoutes = require ('./routes/payments_pdf');
app.use('/payments_pdf', payments_pdfRoutes);

const sitters_pdfRoutes = require ('./routes/sitters_pdf');
app.use('/sitters_pdf', sitters_pdfRoutes);

const babies_pdfRoutes = require ('./routes/babies_pdf');
app.use('/babies_pdf', babies_pdfRoutes);

const inventory_pdfRoutes = require ('./routes/inventory_pdf');
app.use('/inventory_pdf', inventory_pdfRoutes);

//REPORT ROUTES

const sitters_pay_reportRoutes = require ('./routes/sitter_pay_report');
app.use('/sitter_pay_report', sitters_pay_reportRoutes);

const sales_reportRoutes = require ('./routes/sales_report');
app.use('/sales_report', sales_reportRoutes);

const payments_reportRoutes = require ('./routes/payments_report');
app.use('/payments_report', payments_reportRoutes);

const inventory_reportRoutes = require ('./routes/inventory_report');
app.use('/inventory_report', inventory_reportRoutes);

const babies_reportRoutes = require ('./routes/babies_report');
app.use('/babies_report', babies_reportRoutes);

const sitters_reportRoutes = require ('./routes/sitters_report');
app.use('/sitters_report', sitters_reportRoutes);


//API ROUTES
const inventory1Routes = require ('./routes/inventory1');
app.use('/inventory1', inventory1Routes);


const sitterRoutes = require ('./routes/sitters');
app.use('/sitters', sitterRoutes);

const babiesRoutes = require ('./routes/babies');
app.use('/babies', babiesRoutes);

const payments1Routes = require ('./routes/payments1');
app.use('/payments1', payments1Routes);



//DOLL SALES
//search doll
const Pool = require('./db');
app.get('/api/dolls',async (req, res) => {
    const {keyword} = req.query;
    try {
        const result = await Pool.query(`SELECT item_id, item_name, unit_price, quantity FROM inventory WHERE is_resale = true AND (item_name ILIKE $1 OR item_id::text ILIKE $1)`, [`%${keyword}%`]);
        res.json(result.rows);
    } catch (err) {
        console.error('error fetching dolls:', err);
        res.status(500).json({error:err.message});
    }
});

//save sale
// Endpoint to save sales record
app.post('/api/sales', async (req, res) => {
    const { doll_id, doll_name, quantity, unit_price, total_price, sale_date } = req.body;
    try {
      
      // Insert into sales table
      const result = await Pool.query(
        `INSERT INTO sales (doll_name, doll_id, quantity, unit_price, total_price, sale_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [doll_name, doll_id, quantity, unit_price, total_price, sale_date]
      );
      
  
      // Update inventory quantity
      await Pool.query(
        `UPDATE inventory SET quantity = quantity - $1 WHERE item_id = $2`,
        [quantity, doll_id]
      );
  
      //await client.query('COMMIT');
      //client.release();
      res.status(201).send('Sale recorded successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error processing sale');
    }
  });

  //BABIES DEPARTURE
  //babies departure
  app.get('/api/baby', async (req, res) => {
    const { keyword } = req.query;
  
    // Check if the keyword exists and is valid
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ error: 'Keyword is required to search.' });
    }
  
    try {
      // Use parameterized query to prevent SQL injection
      const query = `
        SELECT baby_id, name
        FROM babies
        WHERE name ILIKE $1
        LIMIT 10;
      `;
      const values = [`%${keyword}%`]; // Search keyword with wildcard
  
      // Execute the query
      const result = await Pool.query(query, values);
  
      // Return the results
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching baby data:', err);
      return res.status(500).json({ error: 'An error occurred while fetching baby data.' });
    }
  });

  app.post('/api/update-departure', async (req, res) => {
    const { baby_id, person_taking, time_of_departure, comment } = req.body;
  
    // Validate input
    if (!baby_id || !person_taking || !time_of_departure) {
      return res.status(400).json({ error: 'All fields except comment are required.' });
    }
  
    try {
      // Update the babies table with departure details
      const query = `
        UPDATE babies
        SET person_taking = $1, time_of_departure = $2, comment = $3
        WHERE baby_id = $4;
      `;
      const values = [person_taking, time_of_departure, comment || null, baby_id];
  
      await Pool.query(query, values);
      res.status(200).json({ message: 'Departure details updated successfully.' });
    } catch (err) {
      console.error('Error updating departure details:', err);
      res.status(500).json({ error: 'An error occurred while updating departure details.' });
    }
  });


  //SITTERS_PAY
//sitter_pay
  app.get('/api/sitter-data', async (req, res) => {
    const { name } = req.query;
  
    try {
      const result = await Pool.query(
        `SELECT sitter_id FROM sitters WHERE name = $1`,
        [name]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Sitter not found" });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get('/api/total-children', async (req, res) => {
    const { sitter_id, date } = req.query;
  
    try {
      const result = await Pool.query(
        `SELECT COUNT(*) AS total_children
         FROM babies
         WHERE assigned_sitter = (
           SELECT name FROM sitters WHERE sitter_id = $1
         ) AND date = $2`,
        [sitter_id, date]
      );
  
      const totalChildren = parseInt(result.rows[0].total_children, 10) || 0;
      const paymentAmount = totalChildren * 4000;
  
      res.json({ total_children: totalChildren, payment_amount: paymentAmount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  app.post('/submit-sitter-pay', async (req, res) => {
    const { sitter_id, sitter_name, total_children, payment_amount, payment_date } = req.body;
  
    try {
      await Pool.query(
        `INSERT INTO sitters_pay (sitter_id, sitter_name, total_children, payment_amount, payment_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [sitter_id, sitter_name, total_children, payment_amount, payment_date]
      );
  
      res.json({ message: "Sitter payment recorded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //Get All Sitters payments
  app.get('/sitter_payments', async (req, res) => {
  try {
      const result = await Pool.query('SELECT * FROM sitters_pay');
      res.json(result.rows);
  } catch (err) {
      res.status(500).json({error:err.message});
  }
});

  

    //serve static for homepage
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/html/login.html');
    });
    //serve static for reports pdf
    app.use('/sitter_pay_report.pdf', express.static(path.join(__dirname, 'sitter_pay_report.pdf')));
    app.use('/sales_report.pdf', express.static(path.join(__dirname, 'sales_report.pdf')));
    app.use('/sitters_report.pdf', express.static(path.join(__dirname, 'sitters_report.pdf')));
    app.use('/payments_report.pdf', express.static(path.join(__dirname, 'payments_report.pdf')));
    app.use('/babies_report.pdf', express.static(path.join(__dirname, 'babies_report.pdf')));
    app.use('/inventory_report.pdf', express.static(path.join(__dirname, 'inventory_report.pdf')));

    //add endpoints
    const listEndpoints = require('express-list-endpoints');
    console.log(listEndpoints(app));
    //start server
    app.listen(port,()=> {
        
        console.log(`Nana DayCare app listening on port ${port}`);
    });
