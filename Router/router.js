
const express = require('express');
const { addAllUserstask } = require('../Controller/taskController');
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

//add all tasks
router.post('/addAllUsersTask',jwtMiddleware,taskController.addAllUserstask)

//add tasks from managers to employees

router.post('/addTaskToEmployees/:id',jwtMiddleware,taskController.addEmployeetask)
//get all task details 

router.get('/getAll Task/:id',jwtMiddleware,taskController.getAllUserTasks)

//get all task assigned to managers or employes

router.get('/getManagersTask/:id',jwtMiddleware,taskController.getAllUserTasks)

//task assigned  by manger to employee .view by manager

router.get('/getManagerAssignedTask/:id',jwtMiddleware,taskController.getManagerAssignedTask)

//task of employees
router.get('/getEmployeesTask',jwtMiddleware,taskController.getEmployeesTask)


//task assigned  by admin to manager  --manger side
router.get('/getManagerAssignedTaskByAdmin',jwtMiddleware,taskController.getManagerAssignedTaskByAdmin)

// Update task status
router.put('/status/edit/:id',jwtMiddleware,taskController.updateTaskStatus)

//edit task
router.put('/tasks/edit/:id',jwtMiddleware,taskController.editTask)

//delete
router.delete('/tasks/delete/:id',jwtMiddleware,taskController.deleteTask)
module.exports = router;
