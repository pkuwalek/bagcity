const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

const findUserById = async (id) => {
  return prisma.users.findUnique({
    where: { user_id: Number(id) },
    select: {
      user_id: true,
      user_name: true,
      email: true,
    },
  });
};
exports.findUserById = findUserById;

const getUsersRefreshToken = async (id) => {
  return prisma.users.findUnique({
    where: { user_id: Number(id) },
    select: { refresh_token: true },
  });
};
exports.getUsersRefreshToken = getUsersRefreshToken;

const hashPassword = (userPassword) => {
  return argon2.hash(userPassword);
};

const createUser = async (params) => {
  const { name, email, password } = params;
  return prisma.users
    .create({
      data: {
        user_name: name,
        email,
        password_hash: await hashPassword(password),
      },
    })
    .then(() => true)
    .catch(() => false);
};
exports.createUser = createUser;

const pushNewRefreshToken = (id, refreshToken) => {
  return prisma.users
    .update({
      where: { user_id: Number(id) },
      data: { refresh_token: { push: refreshToken } },
    })
    .then(() => true)
    .catch(() => false);
};
exports.pushNewRefreshToken = pushNewRefreshToken;

const setRefreshedTokens = (id, refreshedTokens) => {
  return prisma.users
    .update({
      where: { user_id: Number(id) },
      data: { refresh_token: { set: refreshedTokens } },
    })
    .then(() => true)
    .catch(() => false);
};
exports.setRefreshedTokens = setRefreshedTokens;

const findUsersBags = async (id) => {
  return prisma.user_bag_relations.findMany({
    where: { user_id: Number(id) },
    include: {
      bags: {
        include: { colors: true, brands: true, types: true },
      },
    },
  });
};
exports.findUsersBags = findUsersBags;

const addBagToUser = async (user_id, bag_id) => {
  return prisma.user_bag_relations
    .create({
      data: {
        users: { connect: { user_id: Number(user_id) } },
        bags: { connect: { bag_id: Number(bag_id) } },
      },
      include: {
        users: true,
        bags: true,
      },
    })
    .then(() => true)
    .catch(() => false);
};
exports.addBagToUser = addBagToUser;

const removeBagFromUser = async (user_id, bag_id) => {
  return prisma.user_bag_relations
    .delete({
      where: {
        user_id_bag_id: {
          user_id: Number(user_id),
          bag_id: Number(bag_id),
        },
      },
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
exports.removeBagFromUser = removeBagFromUser;
