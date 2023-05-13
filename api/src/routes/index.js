const { Router } = require("express");
const doctors = require("./doctors");
const patients = require("./patients");
const socialSecurity = require("./socialSecurity");
const specialties = require("./specialties");
const opinions = require("./opinions");
const clinicHistory = require("./clinicHistory");
const payments = require("./payments");
const horarios = require("./horarios");
const appointments = require("./appointments")

//!fake data
const { createFakeData } = require("../fakeData/fakeData");

const router = Router();

router.post("/fake", async (req, res) => {
  try {
    await createFakeData();
    return res.status(200).send("data created");
  } catch (error) {
    return res.status(404).send(error.message);
  }
});
router.use("/doctors", doctors);
router.use("/patients", patients);
router.use("/socialSecurity", socialSecurity);
router.use("/specialties", specialties);
router.use("/opinions", opinions);
router.use("/clinicHistory", clinicHistory);
router.use("/payments", payments);
router.use('/appointments', appointments);




//! en prueba
router.use("/horarios", horarios);



module.exports = router;