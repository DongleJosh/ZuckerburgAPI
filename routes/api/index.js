const router = require('express').Router();
const thoughtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');
//http://localhost:3001/api/thoughts
router.use('/thoughts', thoughtRoutes);
//http://localhost:3001/api/users
router.use('/users', userRoutes);

module.exports = router;