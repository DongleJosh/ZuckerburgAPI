const router = require('express').Router();
const { User } = require('../../models');

// GET all users
//http://localhost:3001/api/users/
router.get('/', async (req, res) => {
  try {
    const userData = await User.find().select('-__v -password');
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//http://localhost:3001/api/users/1
// GET a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findById(req.params.id).select('-__v -password');
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//http://localhost:3001/api/users/
// POST a new user
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//http://localhost:3001/api/users/2
// PUT update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-__v -password');
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//http://localhost:3001/api/users/3
// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.findByIdAndDelete(req.params.id).select('-__v -password');
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
