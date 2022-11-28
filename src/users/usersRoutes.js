const express = require('express');
const { findUserById, findUsersBags, addBagToUser, removeBagFromUser, getUsersBagsIds } = require('./usersController');

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

router.get('/:id/bagsid', (req, res) => {
  const { id } = req.params;
  getUsersBagsIds(id)
    .then((bags) => {
      res.status(200).send(bags);
    })
    .catch(() => {
      res.status(500).send('Unable to get bags.');
    });
});

router.post('/bags', (req, res) => {
  const { user_id } = req.user;
  const { bag_id } = req.body;
  addBagToUser(user_id, bag_id)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(() => {
      res.status(500).send('Unable to add bag.');
    });
});

router.delete('/bags', (req, res) => {
  const { user_id } = req.user;
  const { bag_id } = req.body;
  removeBagFromUser(user_id, bag_id)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(() => {
      res.status(500).send('Unable to remove bag.');
    });
});

module.exports = router;
