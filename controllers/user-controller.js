const { User } = require('../models');

const userController = {
  // GET all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single user by ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {
        // If no user is found, send 404 error
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST a new user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(500).json(err));
  },

  // PUT to update a user by ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(500).json(err));
  },

  // DELETE a user by ID
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        // Remove the user from any friend arrays
        User.updateMany({ _id: { $in: dbUserData.friends } }, { $pull: { friends: params.id } })
          .then(() => {
            // Remove associated thoughts
            Thought.deleteMany({ username: dbUserData.username })
              .then(() => {
                res.json({ message: 'User and associated thoughts deleted!' });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(err);
              });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST to add a new friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, { $addToSet: { friends: params.friendId } }, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // DELETE to remove a friend from a user's friend list
  deleteFriend({ params }, res) {
    User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
};

module.exports = userController;

