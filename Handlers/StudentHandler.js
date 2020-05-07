const express = require("express");
const router = express.Router();
const studentSchema = require('../models/Student');
const controller = require('../Functions/FunctionsHandler')

router.post('/addStudent' , controller.addStudent);
router.get('/' , controller.getStudents);
router.get('/getAllAnalytics' , controller.getAllAnalytics);

module.exports = router;
