const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    SellController: {
        create: async (req, res) => {
            try {
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({
                    where: {
                        serialNumber: serial,
                        status: 'instock'
                    }
                });

                if (!product) {
                    res.status(404).json({ error: "Product not found" });
                    return;
                }

                await prisma.sell.create({
                    data: {
                       productId: product.id,
                       price:req.body.price,
                       payDate: new Date()
                    },
                });

                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        list : async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'pending'
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    select: {
                        product: {
                            select: {
                                serialNumber: true,
                                productName: true
                            }
                        },
                        id: true,
                        price: true
                    }
                });
                res.json(sells);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        remove : async (req, res) => {
            try {
                await prisma.sell.delete({
                    where: {
                        id: req.params.id
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        confirm : async (req, res) => {
            try {

                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'pending'
                    }
                });

                for (const sell of sells) {
                    await prisma.product.update({
                        where: {
                            id: sell.productId
                        },
                        data: {
                            status: 'sold'
                        }
                    });
                }

                await prisma.sell.updateMany({
                    where: {
                        id: req.params.id
                    },
                    data: {
                        status: 'complete',
                        payDate: new Date()
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        dashboard : async (req, res) => {
            try {

             const income = await prisma.sell.aggregate({
                _sum: {
                  price: true
                },where: {
                  status: 'complete'
                }
              });   
              
              const coutRepair = await prisma.service.count();

              const countSell = await prisma.sell.count({
                where: {
                  status: 'complete'
                }
              });

              return res.json({
                totalIncome: income._sum.price,
                totalRepair: coutRepair,
                totalSell: countSell
              });
              
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    },
};