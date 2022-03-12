const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.post('/bags', async (req, res) => {
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
    }
  })
  res.json(result);
});

app.post('/users/bags', async (req, res) => {
  const { user_id, bag_id } = req.body;
  const result = await prisma.user_bag_relations.create({
    data: {
      users: { connect: { user_id: Number(user_id) } },
      bags: { connect: { bag_id: Number(bag_id) } },
    },
    include: {
      users: true,
      bags: true,
    }
  })
  res.json(result);
});

app.get('/users', async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  const singleUser = await prisma.users
    .findUnique({
      where: { user_id: Number(id) }
    });
    res.json(singleUser);
});

app.get('/bags', async (req, res) => {
  const bags = await prisma.bags.findMany();
  res.json(bags);
});

app.get('/bags/colors/:id', async (req, res) => {
  const { id } = req.params;
  const bagsOfSpecificColor = await prisma.colors
    .findUnique({
      where: { color_id: Number(id) },
      include: { bags: true }
  })
  res.json(bagsOfSpecificColor);
});

app.get('/users/:id/bags', async (req, res) => {
  const { id } = req.params;
  const usersAllBags = await prisma.user_bag_relations
    .findMany({
      where: { user_id: Number(id) },
      include: { users: true },
      include: {
        bags: {
          include: { colors: true, brands: true, types: true },
        },
      },
    })
    res.json(usersAllBags);
});

app.get('/users/:id/bag', async (req, res) => {
  const { id } = req.params;
  const userAndBagData = await prisma.users
    .findMany({
      where: {
        user_id: Number(id),
        user_bag_relations: {
          some: { bag_id: true }
        }
      },
    })
});

// async function main() {
//   // ... you will write your Prisma Client queries here
//   const allUsers = await prisma.users.findMany()
//   console.log(allUsers)
// }

// main()
//   .catch((e) => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

const server = app.listen(3000, () =>
  console.log('Server is ready - localhost:3000')
);