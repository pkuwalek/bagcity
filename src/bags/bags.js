const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const bags = await prisma.bags.findMany({
    include: { colors: true, brands: true, types: true },
  });
  res.json(bags);
});

router.get('/colors/:id', async (req, res) => {
  const { id } = req.params;
  const bagsOfSpecificColor = await prisma.colors.findUnique({
    where: { color_id: Number(id) },
    include: { bags: true },
  });
  res.json(bagsOfSpecificColor);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const bagById = await prisma.bags.findUnique({
    where: { bag_id: Number(id) },
    include: { colors: true, brands: true, types: true },
  });
  res.json(bagById);
});

router.post('/', async (req, res) => {
  const { bag_name, price, brand_id, type_id, color_id } = req.body;
  const result = await prisma.bags.create({
    data: {
      bag_name,
      price,
      brands: { connect: { brand_id: Number(brand_id) } },
      types: { connect: { type_id: Number(type_id) } },
      colors: { connect: { color_id: Number(color_id) } },
    },
    include: {
      brands: true,
      colors: true,
      types: true,
    },
  });
  res.json(result);
});

module.exports = router;
