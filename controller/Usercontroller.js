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

                const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '1d'});

                res.send({token: token});
            }catch(error){
                res.status(500).send({message: error.message});
            }

        }
    }
}