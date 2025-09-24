const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing backend connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/excel-chart-app', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  process.exit(0);
})
.catch(err => {
  console.log('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});
