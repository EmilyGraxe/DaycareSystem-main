const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM sitters');//fetch all rows
        const sitters = result.rows;//get rows
        //create new pdf document
        const doc = new PDFDocument();
        //define the file path
        const filePath = path.join(__dirname, '../sitters_report.pdf');
        //create a write stream to save pdf file
        const writeStream = fs.createWriteStream(filePath);
        //pipe the pdf document to a file
        doc.pipe(writeStream);
        //add title to pdf
        doc.fontSize(20).text('Sitters Report', {align: 'center'});
        doc.moveDown();
        //add each sitter's info to pdf
        sitters.forEach(sitter => {
            doc.fontSize(12).text(`Sitter ID: ${sitter.sitter_id}`);
            doc.fontSize(12).text(`Name: ${sitter.name}`);
            doc.fontSize(12).text(`Location: ${sitter.location}`);
            doc.fontSize(12).text(`Date of Birth: ${sitter.dob}`);
            doc.fontSize(12).text(`Gender: ${sitter.gender}`);
            doc.fontSize(12).text(`Next of Kin: ${sitter.next_of_kin}`);
            doc.fontSize(12).text(`NIN: ${sitter.nin}`);
            doc.fontSize(12).text(`Recommender's Name: ${sitter.recommendor_name}`);
            doc.fontSize(12).text(`Religion: ${sitter.religion}`);
            doc.fontSize(12).text(`Education Level: ${sitter.education_level}`);
            doc.fontSize(12).text(`Sitter Number: ${sitter.sitter_number}`);
            doc.fontSize(12).text(`Contact: ${sitter.contact}`);
        
        });
        //end the pdf document
        doc.end();
        //Once the pdf is saved, send a response to the client
        writeStream.on('finish', () => {
            res.send('Sitter report PDF generated successfully! You can dowload it from <a href="/sitters_report.pdf">here</a>.');
        })
        //download the pdf file
       // res.download(filePath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating sitter report pdf');
    }
});
        
module.exports = router;