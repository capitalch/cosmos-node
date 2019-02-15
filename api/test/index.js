"use strict";
const router = require("express").Router();

// test.get('/api/test', (req, res) => {
//     console.log('/api/test');
// });

router.post("/test/genders", (req, res) => {
  const genders = {
    M: "Male",
    F: "Female",
    T: "Transgender"
  };
  res.json(genders);
});

router.get("/test/test", (req, res) => {
  res.json({ status: "Success" });
});

module.exports = router;
