import Event from '../models/Event.js';
import Rsvp from '../models/Rsvp.js';
import mongoose from 'mongoose';

// @desc    RSVP to event (WITH TRANSACTION FOR CONCURRENCY)
// @route   POST /api/rsvp/:eventId
// @access  Private
export const rsvpToEvent = async (req, res, next) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        
        const { eventId } = req.params;
        const userId = req.user.id;
        
        // Validate event exists
        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Check if already RSVP'd (within transaction)
        const existingRsvp = await Rsvp.findOne({
            event: eventId,
            user: userId
        }).session(session);
        
        if (existingRsvp) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'You have already RSVP\'d to this event'
            });
        }
        
        // Check capacity with atomic update (CRITICAL FOR CONCURRENCY)
        if (event.currentAttendees >= event.capacity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Event is at full capacity',
                availableSpots: 0
            });
        }
        
        // ATOMIC OPERATION: Increment attendees and create RSVP
        // Using findOneAndUpdate to ensure atomicity
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                currentAttendees: { $lt: event.capacity } // Extra safety check
            },
            {
                $inc: { currentAttendees: 1 }
            },
            {
                new: true,
                session: session
            }
        );
        
        if (!updatedEvent) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Failed to RSVP due to capacity constraint'
            });
        }
        
        // Create RSVP record
        const rsvp = await Rsvp.create([{
            event: eventId,
            user: userId,
            status: 'attending'
        }], { session: session });
        
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        
        res.status(200).json({
            success: true,
            message: 'Successfully RSVP\'d to the event',
            data: {
                rsvp: rsvp[0],
                event: {
                    id: updatedEvent._id,
                    title: updatedEvent.title,
                    currentAttendees: updatedEvent.currentAttendees,
                    capacity: updatedEvent.capacity,
                    availableSpots: updatedEvent.capacity - updatedEvent.currentAttendees
                }
            }
        });
        
    } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        session.endSession();
        
        // Handle duplicate key error (unique constraint)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already RSVP\'d to this event'
            });
        }
        
        next(error);
    }
};

// @desc    Cancel RSVP
// @route   DELETE /api/rsvp/:eventId
// @access  Private
export const cancelRsvp = async (req, res, next) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        
        const { eventId } = req.params;
        const userId = req.user.id;
        
        // Find and delete RSVP
        const rsvp = await Rsvp.findOneAndDelete({
            event: eventId,
            user: userId
        }).session(session);
        
        if (!rsvp) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'RSVP not found'
            });
        }
        
        // Decrement event attendees count
        await Event.findByIdAndUpdate(
            eventId,
            {
                $inc: { currentAttendees: -1 }
            },
            { session: session }
        );
        
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        
        res.status(200).json({
            success: true,
            message: 'RSVP cancelled successfully'
        });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

// @desc    Get user's RSVPs
// @route   GET /api/rsvp/my-rsvps
// @access  Private
export const getMyRsvps = async (req, res, next) => {
    try {
        const rsvps = await Rsvp.find({ user: req.user.id })
            .populate({
                path: 'event',
                select: 'title description dateTime location capacity currentAttendees imageUrl category status',
                populate: {
                    path: 'createdBy',
                    select: 'name avatar'
                }
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: rsvps.length,
            data: rsvps
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if user has RSVP'd to an event
// @route   GET /api/rsvp/check/:eventId
// @access  Private
export const checkRsvp = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        
        const rsvp = await Rsvp.findOne({
            event: eventId,
            user: userId
        });
        
        res.status(200).json({
            success: true,
            isAttending: !!rsvp,
            data: rsvp
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get event attendees
// @route   GET /api/rsvp/:eventId/attendees
// @access  Private (Event owner only)
export const getEventAttendees = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        
        // Verify user owns the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view attendees'
            });
        }
        
        const attendees = await Rsvp.find({ event: eventId, status: 'attending' })
            .populate('user', 'name email avatar')
            .select('user status rsvpDate');
        
        res.status(200).json({
            success: true,
            count: attendees.length,
            data: attendees
        });
    } catch (error) {
        next(error);
    }
};