const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const Pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await Pool.query('SELECT * FROM babies');//fetch all rows
        const babies = result.rows;//get rows
        //create new pdf document
        const doc = new PDFDocument();
        //define the file path
        const filePath = path.join(__dirname, '../babies_report.pdf');
        //create a write stream to save pdf file
        const writeStream = fs.createWriteStream(filePath);
        //pipe the pdf document to a file
        doc.pipe(writeStream);
        //add title to pdf
        doc.fontSize(20).text('Babies Report', {align: 'center'});
        doc.moveDown();
        //add each baby's info to pdf
        babies.forEach(baby => {
            doc.fontSize(12).text(`Baby ID: ${baby.baby_id}`);
            doc.fontSize(12).text(`Name: ${baby.name}`);
            doc.fontSize(12).text(`Gender: ${baby.gender}`);
            doc.fontSize(12).text(`Age: ${baby.age}`);
            doc.fontSize(12).text(`Location: ${baby.location}`);
            doc.fontSize(12).text(`Brought By: ${baby.brought_by}`);
            doc.fontSize(12).text(`Time of Arrival: ${baby.time_of_arrival}`);
            doc.fontSize(12).text(`Parents Names: ${baby.parents_names}`);
            doc.fontSize(12).text(`Fee: ${baby.fee}`);
            doc.fontSize(12).text(`Period of Stay: ${baby.period_of_stay}`);
            doc.fontSize(12).text(`Baby Number: ${baby.baby_number}`);
            doc.fontSize(12).text(`Status: ${baby.status}`);
            doc.fontSize(12).text(`Person Taking: ${baby.person_taking}`);
            doc.fontSize(12).text(`Departure Time: ${baby.time_of_departure}`);
            doc.fontSize(12).text(`Comment: ${baby.comment}`);
           
        });
        //end the pdf document
        doc.end();
        //Once the pdf is saved, send a response to the client
        writeStream.on('finish', () => {
            res.send('Babies report PDF generated successfully! You can dowload it from <a href="/babies_report.pdf">here</a>.');
        })
        //download the pdf file
       // res.download(filePath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error generating baby report pdf');
    }
});
        
module.exports = router;