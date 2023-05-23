const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ZuckerburgAPI', {
});

module.exports = mongoose.connection;
