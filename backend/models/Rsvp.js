import mongoose from 'mongoose';

const RsvpSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['attending', 'maybe', 'not_attending'],
        default: 'attending'
    },
    guests: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    rsvpDate: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate RSVPs
RsvpSchema.index({ event: 1, user: 1 }, { unique: true });

// Create indexes for better query performance
RsvpSchema.index({ user: 1 });
RsvpSchema.index({ event: 1 });
RsvpSchema.index({ status: 1 });
RsvpSchema.index({ rsvpDate: -1 });

// Update timestamp before saving
RsvpSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Rsvp', RsvpSchema);