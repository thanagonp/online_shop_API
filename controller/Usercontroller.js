const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { info } = require('console');
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
        }
    }
}