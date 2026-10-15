const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM sitters_pay');//fetch all rows
        const sitters_pay = result.rows;//get rows
        //create new pdf document
        const doc = new PDFDocument();
        //define the file path
        const filePath = path.join(__dirname, '../sitter_pay_report.pdf');
        //create a write stream to save pdf file
        const writeStream = fs.createWriteStream(filePath);
        //pipe the pdf document to a file
        doc.pipe(writeStream);
        //add title to pdf
        doc.fontSize(20).text('Sitters_pay Report', {align: 'center'});
        doc.moveDown();
        //add each sitter's info to pdf
        sitters_pay.forEach(sitters_pay => {

            doc.fontSize(12).text(`Pay ID: ${sitters_pay.pay_id}`);
            doc.fontSize(12).text(`Sitter ID: ${sitters_pay.sitter_id}`);
            doc.fontSize(12).text(`Sitter Name: ${sitters_pay.sitter_name}`);
            doc.fontSize(12).text(`total_children: ${sitters_pay.total_children}`);
            doc.fontSize(12).text(`Payment amount: ${sitters_pay.payment_amount}`);
            doc.fontSize(12).text(`Payment Date: ${sitters_pay.payment_date}`);
            
        });
        //end the pdf document
        doc.end();
        //Once the pdf is saved, send a response to the client
        writeStream.on('finish', () => {
            res.send('Sitters_pay report PDF generated successfully! You can dowload it from <a href="/sitter_pay_report.pdf">here</a>.');
        })
        //download the pdf file
       // res.download(filePath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating sitters_pay report pdf');
    }
});
        
module.exports = router;