const express =require("express");
const router=express.Router();
const appointementController = require("../controllers/appointmentController");
const userController = require("../controllers/userController")
const demandeController = require("../controllers/demandDoctorController")

router.post('/createAppointment', appointementController.createAppointment);
router.get('/appointments/:doctorID', appointementController.getAppointmentByDoctorId);
router.get('/patientAppointments/:patientID' , appointementController.getAppointmentByPatientId);
router.get('/appointments/:doctorID/status', appointementController.getAppointmentsWithStatusDoctorID);
router.get('/appointments/:doctorID/type', appointementController.getAppointmentsWithTypeAndDoctorID);
router.put('/changeAppointmentStatus/:appointmentID', appointementController.updateAppointmentStatus);
router.delete('/deleteAppointment/:appointmentID', appointementController.deleteAppointmentByID);
router.get('/appointmentDetails/:appointmentID', appointementController.getAppointmentDetails);
router.put('/rescheduleAppoinment/:appointmentID', appointementController.rescheduleAppointmentById);
router.put('/updateAppointment/:appointmentID' , appointementController.updateAppointmentTypeById);
router.get('/getuserDetails/:id', userController.getUserWithAvailabilities);
router.get('/todayAppointment/:patientID', appointementController.getTodayAppointmentForPatient);
router.get('/todayAppointmentDoctor/:doctorID', appointementController.getTodayAppointmentForDoctor);
router.get('/doctorAvailibilties/:doctorID/date' , appointementController.getAppointmentWithDoctorIDAndDate);
router.put('/cancelAppointment/:appointmentID' , appointementController.cancelAppointmentPatient);
router.post('/scheduleAppointment/:doctor' , appointementController.creationAppointmentWithDoctorIDandPatinetEamil);
router.put('/changeDate/:appointmentID' , appointementController.updateDateAppointment);
//router.post('/create-meeting' , appointementController.createZoomMeeting);
router.get('/all/doctors/:specialityId' , demandeController.getDoctorsWithSpec);
router.get('/top-patients/:doctorId' ,appointementController.topTenPatient);
module.exports = router;