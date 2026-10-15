const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM inventory');//fetch all rows
        const inventory = result.rows;//get rows
        //create new pdf document
        const doc = new PDFDocument();
        //define the file path
        const filePath = path.join(__dirname, '../inventory_report.pdf');
        //create a write stream to save pdf file
        const writeStream = fs.createWriteStream(filePath);
        //pipe the pdf document to a file
        doc.pipe(writeStream);
        //add title to pdf
        doc.fontSize(20).text('Inventory Report', {align: 'center'});
        doc.moveDown();
        //add each sitter's info to pdf
        inventory.forEach(inventory => {
            doc.fontSize(12).text(`Item ID: ${inventory.item_id}`);
            doc.fontSize(12).text(`Item Name: ${inventory.item_name}`);
            doc.fontSize(12).text(`quantity: ${inventory.quantity}`);
            doc.fontSize(12).text(`Procured Date: ${inventory.procured_date}`);
            doc.fontSize(12).text(`Is_resale: ${inventory.is_resale}`);
            
        });
        //end the pdf document
        doc.end();
        //Once the pdf is saved, send a response to the client
        writeStream.on('finish', () => {
            res.send('Inventory report PDF generated successfully! You can dowload it from <a href="/inventory_report.pdf">here</a>.');
        })
        //download the pdf file
       // res.download(filePath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating inventory report pdf');
    }
});
        
module.exports = router;