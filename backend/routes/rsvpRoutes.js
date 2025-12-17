import express from 'express';
import {
    rsvpToEvent,
    cancelRsvp,
    getMyRsvps,
    checkRsvp,
    getEventAttendees
} from '../controllers/rsvpController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// RSVP routes
router.post('/:eventId', rsvpToEvent);
router.delete('/:eventId', cancelRsvp);
router.get('/my-rsvps', getMyRsvps);
router.get('/check/:eventId', checkRsvp);
router.get('/:eventId/attendees', getEventAttendees);

export default router;