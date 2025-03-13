const express = require('express');
const { createOrUpdateHistory, getAllHistory, getHistoryByCustomerId, getNotifications, getAnalyticsData } = require('../controllers/historyController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.post('/history/create-or-update', isAuthenticatedUser, createOrUpdateHistory)
router.get('/history/get', isAuthenticatedUser, getAllHistory)
router.get('/history/get/:id', isAuthenticatedUser, getHistoryByCustomerId)
router.get('/history/notifications', isAuthenticatedUser, getNotifications)
router.get('/history/analytics', isAuthenticatedUser ,getAnalyticsData)

module.exports = router;