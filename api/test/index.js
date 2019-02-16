"use strict";
const router = require("express").Router();

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

router.post('/test/test', (req, res) => {
  const ret = { test: 'ok' };
  res.json(ret);
})

module.exports = router;
