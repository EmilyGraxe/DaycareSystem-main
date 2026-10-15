const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM sales');//fetch all rows
        const sales = result.rows;//get rows
        //create new pdf document
        const doc = new PDFDocument();
        //define the file path
        const filePath = path.join(__dirname, '../sales_report.pdf');
        //create a write stream to save pdf file
        const writeStream = fs.createWriteStream(filePath);
        //pipe the pdf document to a file
        doc.pipe(writeStream);
        //add title to pdf
        doc.fontSize(20).text('Sales Report', {align: 'center'});
        doc.moveDown();
        //add each sitter's info to pdf
        sales.forEach(sale => {
            doc.fontSize(12).text(`Sale ID: ${sale.sale_id}`);
            doc.fontSize(12).text(`Doll Name: ${sale.doll_name}`);
            doc.fontSize(12).text(`Quantity: ${sale.quantity}`);
            doc.fontSize(12).text(`unit price: ${sale.unit_price}`);
            doc.fontSize(12).text(`total price: ${sale.total_price}`);
            doc.fontSize(12).text(`sale date: ${sale.sale_date}`);
           
        });
        //end the pdf document
        doc.end();
        //Once the pdf is saved, send a response to the client
        writeStream.on('finish', () => {
            res.send('Sales report PDF generated successfully! You can dowload it from <a href="/sales_report.pdf">here</a>.');
        })
        //download the pdf file
       // res.download(filePath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating payments report pdf');
    }
});
        
module.exports = router;