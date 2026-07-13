const mongoose = require('mongoose');
const net = require('net');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seed = require('../seed');

// Helper function to check if port is open
const checkPort = (port, host) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
};

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pandacoders';
    
    // Parse port and host from connection string to check if it's running
    const match = dbUri.match(/mongodb:\/\/(.+?):(\d+)/);
    let isLocalMongoRunning = false;
    
    if (match) {
      const host = match[1];
      const port = parseInt(match[2], 10);
      isLocalMongoRunning = await checkPort(port, host);
    }
    
    let uriToConnect = dbUri;
    let usingInMemoryDb = false;
    
    if (!isLocalMongoRunning && !dbUri.includes('+srv')) {
      console.log('Local MongoDB port 27017 is closed. Initializing in-memory MongoDB fallback...');
      const mongoServer = await MongoMemoryServer.create();
      uriToConnect = mongoServer.getUri();
      usingInMemoryDb = true;
      console.log(`In-memory MongoDB started at: ${uriToConnect}`);
    } else {
      console.log(`Connecting to MongoDB at: ${dbUri}...`);
    }

    const conn = await mongoose.connect(uriToConnect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    if (usingInMemoryDb) {
      console.log('Seeding initial data into the in-memory database...');
      await seed(false);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Please ensure MongoDB is running or the MONGODB_URI is set correctly in your environment variables.');
    process.exit(1);
  }
};

module.exports = connectDB;
