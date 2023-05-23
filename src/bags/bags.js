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

router.post('/filter', async (req, res) => {
  const { colorIds, brandIds, styleIds } = req.body;
  const filteredBags = await prisma.bags.findMany({
    where: {
      color_id: { in: colorIds.length ? colorIds : undefined },
      brand_id: { in: brandIds.length ? brandIds : undefined },
      type_id: { in: styleIds.length ? styleIds : undefined },
    },
    include: { colors: true, brands: true, types: true },
  });
  res.json(filteredBags);
});

router.get('/colors/:id', async (req, res) => {
  const { id } = req.params;
  const bagsOfSpecificColor = await prisma.colors.findUnique({
    where: { color_id: Number(id) },
    include: { bags: true },
  });
  res.json(bagsOfSpecificColor);
});

router.get('/colors', async (req, res) => {
  let colors = await prisma.colors.findMany();
  colors = colors.map((item) => {
    return {
      id: item.color_id,
      name: item.color_name,
    };
  });
  res.json(colors);
});

router.get('/brands', async (req, res) => {
  let brands = await prisma.brands.findMany();
  brands = brands.map((item) => {
    return {
      id: item.brand_id,
      name: item.brand_name,
    };
  });
  res.json(brands);
});

router.get('/types', async (req, res) => {
  let types = await prisma.types.findMany();
  types = types.map((item) => {
    return {
      id: item.type_id,
      name: item.type_name,
    };
  });
  res.json(types);
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
