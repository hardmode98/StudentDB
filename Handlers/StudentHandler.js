const express = require("express");
const router = express.Router();
const studentSchema = require('../models/Student');
const controller = require('../Functions/FunctionsHandler')

router.post('/addStudent' , controller.addStudent);
router.get('/' , controller.getStudents);
router.get('/topThreeSchools' , controller.topThreeSchools);
router.get('/topThreeStudents' , controller.topThreeStudents);
router.get('/topThreeSchoolsByDistrict' , controller.topThreeSchoolsByDistrict);
router.get('/top10StudentsByDistrict' , controller.topTenStudentsByDistrict);
router.get('/topStudentsInSchool' , controller.topTenStudentInSchool);
router.get('/bestStudent' , controller.BestStudent);
router.get('/bestStudentbysubject' , controller.BestStudentBySubject);



module.exports = router;
