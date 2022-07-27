const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const singleUser = await prisma.users.findUnique({
    where: { user_id: Number(id) },
  });
  res.json(singleUser);
});

router.get('/:id/bags', async (req, res) => {
  const { id } = req.params;
  const usersAllBags = await prisma.user_bag_relations.findMany({
    where: { user_id: Number(id) },
    include: {
      users: true,
      bags: {
        include: { colors: true, brands: true, types: true },
      },
    },
  });
  res.json(usersAllBags);
});

// TODO: check if it works
router.get('/:id/bag', async (req, res) => {
  const { id } = req.params;
  const userAndBagData = await prisma.users.findMany({
    where: {
      user_id: Number(id),
      user_bag_relations: {
        some: { bag_id: true },
      },
    },
  });
  res.json(userAndBagData);
});

router.post('/bags', async (req, res) => {
  const { user_id, bag_id } = req.body;
  const result = await prisma.user_bag_relations.create({
    data: {
      users: { connect: { user_id: Number(user_id) } },
      bags: { connect: { bag_id: Number(bag_id) } },
    },
    include: {
      users: true,
      bags: true,
    },
  });
  res.json(result);
});

module.exports = router;
