import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        console.log('📡 Attempting MongoDB Atlas connection...');
        console.log(`Connection string: ${process.env.MONGODB_URI?.substring(0, 50)}...`);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,  // 10 second timeout for server selection
            socketTimeoutMS: 45000,            // 45 second timeout for socket operations
            connectTimeoutMS: 10000,           // 10 second timeout for connection
            retryWrites: true,
            maxPoolSize: 10,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error(`Error Code: ${error.code}`);
        console.error('Please check:');
        console.error('1. MONGODB_URI is correct in .env file');
        console.error('2. MongoDB Atlas IP whitelist includes your IP');
        console.error('3. Network connectivity to MongoDB Atlas');
        console.error('4. Credentials are valid');
        
        // Retry connection after 5 seconds instead of exiting
        console.log('⏳ Retrying connection in 5 seconds...');
        setTimeout(() => connectDB(), 5000);
    }
};

export default connectDB;