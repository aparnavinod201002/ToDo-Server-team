



//Add Task to employees and managers

router.post('/addTaskAllUsers',jwtMiddleware,taskController.addAllusersTask)
