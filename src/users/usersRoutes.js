const express = require('express');
const { findUserById, findUsersBags, addBagToUser } = require('./usersController');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  findUserById(id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send('No user found');
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get('/:id/bags', (req, res) => {
  const { id } = req.params;
  findUsersBags(id)
    .then((bags) => {
      res.status(200).send(bags);
    })
    .catch(() => {
      res.status(500).send('Unable to get bags.');
    });
});

// SPRAWDZIĆ, BO COŚ NIE GRA
router.post('/bags', (req, res) => {
  const { user_id } = req.user;
  const { bag_id } = req.body;
  const result = addBagToUser(user_id, bag_id)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(() => {
      res.status(500).send('Unable to add bag.');
    });
  res.json(result);
});

module.exports = router;
