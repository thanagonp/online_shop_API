const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const prisma = new PrismaClient();

dotenv.config();

module.exports = { 
    UserController : {
        signin: async (req, res) => {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        username: req.body.username,
                        password: req.body.password,
                        status: 'active'
                    }
                });

                if(!user){
                    res.status(401).send({message: "Invalid username or password"});
                    return;
                }

                const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '2d'});

                res.send({token: token});
            }catch(error){
                res.status(500).send({message: error.message});
            }

        },
        info: async (req, res) => {
            try {
                const headers = req.headers.authorization;
                const token = headers.split(' ')[1];
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const user = await prisma.user.findFirst({
                    where: {
                        id: decoded.id
                    },
                    select: {
                        name: true,
                        username: true,
                        level: true,
                    }
                });
                res.send(user);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        update : async (req, res) => {
            try {
                const headers = req.headers.authorization;
                const token = headers.split(' ')[1];
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const oldPassword = await prisma.user.findFirst({
                    where: {
                        id: decoded.id
                    },
                    select: {
                        password: true
                    }
                });
                const newPassword = req.body.password !== "" ? req.body.password : oldPassword.password;
                await prisma.user.update({
                    where: {
                        id: decoded.id
                    },
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: newPassword
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        list : async (req, res) => {
            try {
                const users = await prisma.user.findMany({
                    orderBy: {
                        id: 'desc'
                    },
                    where : {
                        status : 'active'
                    }
                });
                res.json(users);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        create : async (req, res) => {
            try {
                await prisma.user.create({
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: req.body.password,
                        level: req.body.level,
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        updateUser : async (req, res) => {
            try {
                const oldPassword = await prisma.user.findFirst({
                    where: {
                        id: req.params.id
                    }
                })
                const newPassword = req.body.password !== "" ? req.body.password : oldPassword.password;

                await prisma.user.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: newPassword,
                        level: req.body.level
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        remove : async (req, res) => {
            try {
                await prisma.user.update({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        status: 'inactive'
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    }
}