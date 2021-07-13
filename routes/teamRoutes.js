const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team');
const auth = require('../middleware/checkAuth');

// Team Api Endpoints
router.post('/createNewTeam', auth, TeamController.createNewTeam);
router.get('/getAllTeams', auth, TeamController.getAllTeams);
router.post('/getTeam', TeamController.getTeam);
router.post('/addMember', TeamController.addMember);
router.post('/deleteMember', TeamController.deleteMember);
router.post('/getAllMembers', TeamController.getAllMembers);
router.post('/leaveTeam', auth, TeamController.leaveTeam);


module.exports = router
