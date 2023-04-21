const router = require('express').Router();
const { Thought, User } = require('../../models');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughtData = await Thought.find().populate({ path: 'reactions', select: '-__v' }).select('-__v');
    res.json(thoughtData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET a single thought by ID
router.get('/:id', async (req, res) => {
  try {
    const thoughtData = await Thought.findById(req.params.id).populate({ path: 'reactions', select: '-__v' }).select('-__v');
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thoughtData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const thoughtData = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thoughtData._id } });
    res.json(thoughtData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT update a thought by ID
router.put('/:id', async (req, res) => {
  try {
    const thoughtData = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate({ path: 'reactions', select: '-__v' }).select('-__v');
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thoughtData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a thought by ID
router.delete('/:id', async (req, res) => {
  try {
    const thoughtData = await Thought.findByIdAndDelete(req.params.id).populate({ path: 'reactions', select: '-__v' }).select('-__v');
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    await User.findByIdAndUpdate(thoughtData.userId, { $pull: { thoughts: thoughtData._id } });
    res.json(thoughtData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// POST a new reaction to a thought
router.post('/:id/reactions', async (req, res) => {
  try {
    const thoughtData = await Thought.findByIdAndUpdate(req.params.id, { $push: { reactions: req.body } }, { new: true, runValidators: true }).populate({ path: 'reactions', select: '-__v' }).select('-__v');
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thoughtData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a reaction to a thought
router.delete('/:id/reactions/:reactionId', async (req, res) => {
    try {
      const thoughtData = await Thought.findByIdAndUpdate(req.params.id, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true, runValidators: true }).populate({ path: 'reactions', select: '-__v' }).select('-__v');
      if (!thoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
