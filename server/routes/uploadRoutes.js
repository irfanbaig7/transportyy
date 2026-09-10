const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

function uploadBufferToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: `chalo/${folder}`, resource_type: 'auto' },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });
}

// POST /api/upload/document  (form-data: file, field=docType e.g. license/rc/insurance/photo)
router.post('/document', protect, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(503).json({ error: 'File upload not configured. Set CLOUDINARY_* in server/.env.' });
    }

    const docType = req.body.docType || 'misc';
    const result = await uploadBufferToCloudinary(req.file.buffer, `documents/${req.user._id}`);

    res.json({ url: result.secure_url, docType });
});

module.exports = router;