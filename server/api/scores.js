// const express = require("express");
// const router = express.Router();
// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();

// // Gets all scores
// router.get("/", async (req, res) => {
//   try {
//     const score = await prisma.score_reading.findMany({
//       include: {
//         user: true,
//       },
//     });
//     res.send(score);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// module.exports = router;
