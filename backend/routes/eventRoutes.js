import express from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
    getAttendingEvents
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/user/my-events', protect, getMyEvents);
router.get('/user/attending', protect, getAttendingEvents);

export default router;