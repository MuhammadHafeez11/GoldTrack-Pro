const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const sharp = require('sharp');

const app = express();

app.use(express.json());

const uploadsBaseDirectory = path.join(__dirname, '..', 'Uploads');

// Function to ensure a directory exists, create if not
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Multer configuration for book uploads (cover image + PDF)
const uploadCNICImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const cnicDir = path.join(uploadsBaseDirectory, 'CNIC_IMAGE');
            ensureDirectoryExists(cnicDir);
            cb(null, cnicDir);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 3 * 1024 * 1024, // File size limit for images (3MB)
    },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
}).fields([
    { name: 'CNICFront' }, 
    { name: 'CNICBack' } 
]);

module.exports = {
    uploadCNICImage
};