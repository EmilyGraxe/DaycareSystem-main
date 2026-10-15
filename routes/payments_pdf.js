const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM payments');//fetch all rows
        const payments = result.rows;//get rows
        //create new pdf document
        const doc = new PDFDocument();
        //define the file path
        const filePath = path.join(__dirname, '../payments_report.pdf');
        //create a write stream to save pdf file
        const writeStream = fs.createWriteStream(filePath);
        //pipe the pdf document to a file
        doc.pipe(writeStream);
        //add title to pdf
        doc.fontSize(20).text('Payments Report', {align: 'center'});
        doc.moveDown();
        //add each sitter's info to pdf
        payments.forEach(payment => {
            doc.fontSize(12).text(`Payment ID: ${payment.payment_id}`);
            doc.fontSize(12).text(`Type: ${payment.type}`);
            doc.fontSize(12).text(`Location: ${payment.amount}`);
            doc.fontSize(12).text(`Date of Birth: ${payment.sitter_id}`);
            doc.fontSize(12).text(`Gender: ${payment.baby_id}`);
            doc.fontSize(12).text(`Next of Kin: ${payment.payment_date}`);
           
        });
        //end the pdf document
        doc.end();
        //Once the pdf is saved, send a response to the client
        writeStream.on('finish', () => {
            res.send('Payments report PDF generated successfully! You can dowload it from <a href="/payments_report.pdf">here</a>.');
        })
        //download the pdf file
       // res.download(filePath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating payments report pdf');
    }
});
        
module.exports = router;