require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const eventRoutes = require('./src/events/event.routes');
app.use('/api/events', eventRoutes);
    
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('AIDLink server is running successfully!');
});

// API Routes
app.use('/api/events', eventRoutes);

// Seed route (for development only)
app.get('/api/seed/events', async (req, res) => {
  try {
    const { seedEvents } = require('./src/events/event.seed');
    const events = await seedEvents();
    res.status(200).json({
      success: true,
      message: `Successfully seeded ${events.length} events`,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding events',
      error: error.message
    });
  }
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`AIDLink server listening on port ${port}`);
  });
});
