require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 2000;
const axios = require('axios');


const url = `https://api-ledger.onrender.com/api/customers`;



const interval = 30000;

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}

setInterval(reloadWebsite, interval);

//

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: 'GET,POST',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api', customerRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
