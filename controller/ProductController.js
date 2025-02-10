const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


module.exports = {
    ProductController: {
        create: async (req, res) => {
            try {
                const quantity = req.body.quantity;

                if(quantity > 100) {
                    res.status(400).json({ error: "Quantity must be less than 100" });
                    return;
                }

                for(let i = 0; i < quantity; i++) {
                    await prisma.product.create({
                        data:{
                            serialNumber: req.body.serialNumber,
                            productName: req.body.productName,
                            productModel: req.body.productModel,
                            color: req.body.color,
                            price: req.body.price,
                            customerName: req.body.customerName,
                            customerPhone: req.body.customerPhone,
                            customerAddress: req.body.customerAddress,
                            remark: req.body.remark ?? ''
                        }
                    });
                }

                res.json({message: "success"});
            } catch (error) {
                res.status(500).json({ error: error.message });
            }    
        },
        list : async (req, res) => {
            try {
                const products = await prisma.product.findMany({
                    orderBy: {
                        id: 'desc'
                    },
                    where: {
                        status:{
                            not: 'delete'
                        }
                    }
                });
                res.json(products);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }    
        },
        update : async (req, res) => {
            try {
                await prisma.product.update({
                    where: {
                        id: req.params.id
                    },
                    data:{
                        serialNumber: req.body.serialNumber,
                        productName: req.body.productName,
                        productModel: req.body.productModel,
                        color: req.body.color,
                        price: req.body.price,
                        customerName: req.body.customerName,
                        customerPhone: req.body.customerPhone,
                        customerAddress: req.body.customerAddress,
                        remark: req.body.remark ?? ''
                    }
                });
                res.json({message: "success"});
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        //เก็บข้อมูลไว้ โดยเปลี่ยนสเตตัส
        remove : async (req, res) => {
            try {
                await prisma.product.update({
                    where: {
                        id: req.params.id,
                        
                    },
                    data: {
                        status: 'delete'
                    }
                });
                res.json({message: "success"});
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    }
    
}