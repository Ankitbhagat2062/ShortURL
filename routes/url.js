import express from 'express';
import { body } from 'express-validator';
import {
    redirectToUrl,
    createShortUrl,
    getAnalytics,
    getAllUrls,
    deleteUrls,
    trackVisit
} from '../controllers/url.js';

const router = express.Router();

// Validation middleware
const urlValidation = [
    body('url')
        .isURL({ 
            protocols: ['http', 'https'],
            require_protocol: true,
            allow_query_components: true
        })
        .withMessage('Please provide a valid URL')
];

// Routes
router.get('/:shortId', redirectToUrl);
router.post('/shorten', createShortUrl);
router.get('/analytics/:shortId', getAnalytics);
router.get('/admin/all/:userId', getAllUrls);
router.delete('/deleteUrl/:shortId', deleteUrls);
router.post('/track-visit', trackVisit);

export default router;



