const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ZuckerburgAPI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// log mongo queries being executed
mongoose.set('debug', true);

// Routes
app.use(require('./routes'));

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
