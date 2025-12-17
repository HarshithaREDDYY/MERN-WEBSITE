# Backend API Integration Guide

This guide provides detailed instructions for integrating a MERN stack backend with MongoDB to the Event Management Platform.

---

## Table of Contents
1. [Backend Architecture](#backend-architecture)
2. [MongoDB Schema Design](#mongodb-schema-design)
3. [API Endpoints](#api-endpoints)
4. [Authentication Flow](#authentication-flow)
5. [RSVP System](#rsvp-system)
6. [Frontend Integration](#frontend-integration)
7. [Environment Setup](#environment-setup)

---

## Backend Architecture

### Tech Stack
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### Project Structure
```
/backend
├── /config
│   └── db.js                 # MongoDB connection
├── /models
│   ├── User.js               # User model
│   ├── Event.js              # Event model
│   └── RSVP.js               # RSVP model
├── /routes
│   ├── auth.js               # Authentication routes
│   ├── events.js             # Event CRUD routes
│   └── rsvps.js              # RSVP routes
├── /controllers
│   ├── authController.js     # Auth logic
│   ├── eventController.js    # Event logic
│   └── rsvpController.js     # RSVP logic
├── /middleware
│   ├── auth.js               # JWT verification
│   └── errorHandler.js       # Error handling
├── /utils
│   └── validators.js         # Input validation
├── .env                      # Environment variables
├── server.js                 # Express server
└── package.json
```

---

## MongoDB Schema Design

### User Schema
```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcrypt');
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Event Schema
```javascript
// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Music', 'Art', 'Sports', 'Food', 'Business', 'Education', 'Other']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100000, 'Capacity cannot exceed 100,000']
  },
  attending: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  version: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ date: 1, category: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Virtual for seats left
eventSchema.virtual('seatsLeft').get(function() {
  return this.capacity - this.attending;
});

// Prevent attending from exceeding capacity
eventSchema.pre('save', function(next) {
  if (this.attending > this.capacity) {
    next(new Error('Cannot exceed event capacity'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
```

### RSVP Schema
```javascript
// models/RSVP.js
const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  additionalInfo: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['confirmed', 'waitlist', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate RSVPs
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
**Description**: Register a new user

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a5f1234567890abcdef123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  }
}
```

#### POST /api/auth/login
**Description**: Authenticate user

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Same as signup

#### GET /api/auth/me
**Description**: Get current user (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "64a5f1234567890abcdef123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  }
}
```

---

### Event Endpoints

#### GET /api/events
**Description**: Get all events with filters

**Query Parameters**:
- `search`: Search by title/description
- `category`: Filter by category
- `availability`: 'all', 'open', 'full'
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response**:
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  },
  "data": [
    {
      "id": "64a5f1234567890abcdef124",
      "title": "React Summit 2025",
      "description": "...",
      "date": "2025-03-15T00:00:00.000Z",
      "time": "10:00 AM",
      "location": "San Francisco, CA",
      "category": "Technology",
      "capacity": 500,
      "attending": 245,
      "image": "https://...",
      "organizer": {
        "id": "64a5f1234567890abcdef123",
        "name": "John Doe",
        "avatar": "https://..."
      }
    }
  ]
}
```

#### GET /api/events/:id
**Description**: Get single event by ID

**Response**: Single event object

#### POST /api/events
**Description**: Create new event (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "title": "React Summit 2025",
  "description": "A comprehensive event...",
  "date": "2025-03-15",
  "time": "10:00 AM",
  "location": "San Francisco, CA",
  "category": "Technology",
  "capacity": 500,
  "image": "https://..."
}
```

**Response**: Created event object

#### PUT /api/events/:id
**Description**: Update event (requires authentication + ownership)

**Headers**: `Authorization: Bearer <token>`

**Request Body**: Same as POST

**Response**: Updated event object

#### DELETE /api/events/:id
**Description**: Delete event (requires authentication + ownership)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### RSVP Endpoints

#### POST /api/rsvps
**Description**: RSVP to an event (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "eventId": "64a5f1234567890abcdef124",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "additionalInfo": "Looking forward to it!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "RSVP confirmed!",
  "rsvp": {
    "id": "64a5f1234567890abcdef125",
    "event": "64a5f1234567890abcdef124",
    "status": "confirmed"
  }
}
```

#### DELETE /api/rsvps/:eventId
**Description**: Cancel RSVP (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "RSVP cancelled successfully"
}
```

#### GET /api/rsvps/my-events
**Description**: Get user's RSVPs (requires authentication)

**Headers**: `Authorization: Bearer <token>`

**Response**: Array of events user is attending

---

## Authentication Flow

### JWT Token Generation
```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user
    user = await User.create({ name, email, password });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### JWT Verification Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
```

---

## RSVP System

### Race-Condition Safe Implementation
```javascript
// controllers/rsvpController.js
exports.createRSVP = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { eventId, name, email, phone, additionalInfo } = req.body;
    const userId = req.user._id;
    
    // Get event with pessimistic locking
    const event = await Event.findById(eventId)
      .session(session)
      .exec();
    
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check capacity
    if (event.attending >= event.capacity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity'
      });
    }
    
    // Check for duplicate RSVP
    const existingRSVP = await RSVP.findOne({
      user: userId,
      event: eventId
    }).session(session);
    
    if (existingRSVP) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You have already RSVPed to this event'
      });
    }
    
    // Create RSVP
    const rsvp = await RSVP.create([{
      user: userId,
      event: eventId,
      name,
      email,
      phone,
      additionalInfo
    }], { session });
    
    // Update event atomically using $inc
    await Event.findByIdAndUpdate(
      eventId,
      {
        $inc: { attending: 1 },
        $push: { attendees: userId }
      },
      { session }
    );
    
    // Commit transaction
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: 'RSVP confirmed!',
      rsvp: rsvp[0]
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};
```

---

## Frontend Integration

### API Service Layer
Create `/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Authentication
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  
  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeader()
    });
    return response.json();
  }
};

// Events
export const eventsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/events?${params}`);
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`);
    return response.json();
  },
  
  create: async (eventData) => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },
  
  update: async (id, eventData) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return response.json();
  }
};

// RSVPs
export const rsvpAPI = {
  create: async (rsvpData) => {
    const response = await fetch(`${API_URL}/rsvps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(rsvpData)
    });
    return response.json();
  },
  
  cancel: async (eventId) => {
    const response = await fetch(`${API_URL}/rsvps/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return response.json();
  },
  
  getMyEvents: async () => {
    const response = await fetch(`${API_URL}/rsvps/my-events`, {
      headers: getAuthHeader()
    });
    return response.json();
  }
};
```

### Update EventsContext
```javascript
// contexts/EventsContext.tsx
import { eventsAPI, rsvpAPI } from '../services/api';

export function EventsProvider({ children }: { children: ReactNode }) {
  // ... existing state ...
  
  const createEvent = async (eventData: Omit<Event, 'id' | 'attending' | 'attendees'>) => {
    try {
      const response = await eventsAPI.create(eventData);
      
      if (response.success) {
        setEvents((prev) => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };
  
  // Similar updates for updateEvent, deleteEvent, rsvpToEvent, etc.
}
```

---

## Environment Setup

### Backend .env
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventmanagement?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173

# Other
MAX_FILE_SIZE=5242880
```

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Event Management Platform
```

---

## Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables in platform dashboard
2. Ensure MongoDB Atlas whitelist includes deployment IP
3. Set `NODE_ENV=production`

### Frontend Deployment (Vercel)
1. Add environment variable: `VITE_API_URL=https://your-api.com/api`
2. Deploy from GitHub repository
3. Enable automatic deployments

---

## Testing Checklist

- [ ] User signup and login
- [ ] JWT token persistence
- [ ] Protected route access
- [ ] Event CRUD operations
- [ ] RSVP creation with capacity check
- [ ] Concurrent RSVP handling
- [ ] Event filtering and search
- [ ] User dashboard data loading
- [ ] Error handling for all endpoints
- [ ] CORS configuration
- [ ] Input validation
- [ ] Database indexing performance

---

This guide provides a complete blueprint for integrating a production-ready MERN backend with your Event Management Platform frontend.
