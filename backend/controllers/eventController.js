import Event from '../models/Event.js';
import Rsvp from '../models/Rsvp.js';
import mongoose from 'mongoose';

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res, next) => {
    try {
        // Add createdBy to request body
        req.body.createdBy = req.user.id;

        // Create short description if not provided
        if (!req.body.shortDescription && req.body.description) {
            req.body.shortDescription = req.body.description.substring(0, 200) + '...';
        }

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            search, 
            status = 'upcoming',
            sort = 'dateTime',
            order = 'asc'
        } = req.query;
        
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get upcoming events (date >= now)
        if (status === 'upcoming') {
            query.dateTime = { $gte: new Date() };
        }
        
        // Get past events
        if (status === 'past') {
            query.dateTime = { $lt: new Date() };
        }
        
        // Calculate start index for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        // Sort options
        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;
        
        // Execute query with pagination
        const events = await Event.find(query)
            .sort(sortOptions)
            .skip(startIndex)
            .limit(parseInt(limit))
            .populate('createdBy', 'name avatar');
        
        // Get total documents
        const total = await Event.countDocuments(query);
        
        // Pagination result
        const pagination = {};
        
        if (endIndex < total) {
            pagination.next = {
                page: parseInt(page) + 1,
                limit: parseInt(limit)
            };
        }
        
        if (startIndex > 0) {
            pagination.prev = {
                page: parseInt(page) - 1,
                limit: parseInt(limit)
            };
        }
        
        res.status(200).json({
            success: true,
            count: events.length,
            pagination,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name avatar email');
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Check if user is attending (if authenticated)
        let isAttending = false;
        if (req.user) {
            const rsvp = await Rsvp.findOne({
                event: event._id,
                user: req.user.id,
                status: 'attending'
            });
            isAttending = !!rsvp;
        }
        
        res.status(200).json({
            success: true,
            data: {
                ...event.toObject(),
                isAttending
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Make sure user is event owner
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }
        
        // Update event
        event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Make sure user is event owner
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }
        
        // Delete all RSVPs for this event first
        await Rsvp.deleteMany({ event: event._id });
        
        // Delete the event
        await event.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get events created by current user
// @route   GET /api/events/user/my-events
// @access  Private
export const getMyEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name avatar');
        
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get events user is attending
// @route   GET /api/events/user/attending
// @access  Private
export const getAttendingEvents = async (req, res, next) => {
    try {
        const rsvps = await Rsvp.find({ 
            user: req.user.id,
            status: 'attending'
        }).populate({
            path: 'event',
            populate: {
                path: 'createdBy',
                select: 'name avatar'
            }
        });
        
        const events = rsvps.map(rsvp => rsvp.event);
        
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
};