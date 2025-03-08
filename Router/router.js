
const express = require('express');

const router = express.Router();

// import jwtmiddle ware
const jwtMiddleware = require('../middleware/jwtMiddleWare')

// import task controller 
const taskController = require('../Controller/taskController')

// import user controller 
const userController = require('../Controller/userController')

// Registration of user 
router.post('/register',userController.registerUserController)

// Login of users
router.post('/login',userController.loginUserController)

//get all users

router.get('/getAllUsers',userController.getAllEmployeesAndManagerController)

//add task by admin to manager and emolyees ,add task to manager to employees under them

router.post('/AssignTask',jwtMiddleware,taskController.addAllUserstask)

//get task by admin to manager and emolyees , manager assigned task to employees , get the manager assigned task to employees under them and view the admin assigned task to them , employees get the task assigned by both

router.get('/getTasks',jwtMiddleware,taskController.getAllUserTasks)

// get manager
router.get("/managers",jwtMiddleware, userController.getManagers);
//
router.delete('/managerAndemployee/remove/:id',userController.deleteUser)

//employees
router.get('/getEmployees',jwtMiddleware,userController.getManagersEmployees)

module.exports = router;
