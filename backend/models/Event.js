import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot be more than 200 characters']
    },
    dateTime: {
        type: Date,
        required: [true, 'Please provide event date and time']
    },
    location: {
        type: String,
        required: [true, 'Please provide event location'],
        maxlength: [200, 'Location cannot be more than 200 characters']
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide event capacity'],
        min: [1, 'Capacity must be at least 1'],
        max: [10000, 'Capacity cannot exceed 10000']
    },
    currentAttendees: {
        type: Number,
        default: 0,
        min: 0
    },
    imageUrl: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/v1674571764/default-event.jpg'
    },
    category: {
        type: String,
        enum: ['Music', 'Sports', 'Art', 'Food', 'Tech', 'Business', 'Education', 'Health', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for available spots
EventSchema.virtual('availableSpots').get(function() {
    return Math.max(0, this.capacity - this.currentAttendees);
});

// Virtual field to check if event is full
EventSchema.virtual('isFull').get(function() {
    return this.currentAttendees >= this.capacity;
});

// Virtual field for days until event
EventSchema.virtual('daysUntil').get(function() {
    const now = new Date();
    const eventDate = new Date(this.dateTime);
    const diffTime = eventDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Update timestamp before saving
EventSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Auto-generate short description if not provided
    if (!this.shortDescription && this.description) {
        this.shortDescription = this.description.substring(0, 197) + '...';
    }
    
    // Update status based on date
    const now = new Date();
    if (this.dateTime <= now && this.status === 'upcoming') {
        this.status = 'ongoing';
    }
    
    next();
});

// Create indexes for better query performance
EventSchema.index({ dateTime: 1 });
EventSchema.index({ createdBy: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Event', EventSchema);