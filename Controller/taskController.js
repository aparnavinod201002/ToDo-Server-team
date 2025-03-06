const Task = require('../Model/taskSchema')
//task added to all users


exports.addAllUserstask = async(req,res)=>{
    console.log("inside add task added function");
    const {title,description,priority,status,dueDate}=req.body
    const assignedTo = req.payload
    try{
        const existingTask = await Task.findOne({title,assignedTo})
        if(existingTask){
            res.status(406).json("task Already Assigned...")
        }else{
            const newTask = new Task({
                title,description,assignedTo,assignedBy:"Admin",priority,status,dueDate
            })
            await newTask.save()
            res.status(200).json(newTask)
        }
       

    }catch(err){
        res.status(401).json(err)
    }
    
}

//task added by manager


exports.addEmployeetask = async(req,res)=>{
    console.log("inside add task added function");

    const {title,description, priority,status,dueDate}=req.body
    const assignedTo = req.payload
    const assignedBy = req.params
    try{
        const existingTask = await Task.findOne({title,assignedTo})
        if(existingTask){
            res.status(406).json("task Already Assigned...")
        }else{
            const newTask = new Task({
                title,description,assignedTo,assignedBy,priority,status,dueDate
            })
            await newTask.save()
            res.status(200).json(newTask)
        }
       

    }catch(err){
        res.status(401).json(err)
    }
    
}

//get all task details by userid

exports.getAllUserTasks = async (req, res) => {
    try {
        const userId = req.payload; 
        const userTasks = await Task.find({ assignedTo: userId }); 
        res.status(200).json(userTasks);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};

//get all task assigned to managers and employees viewed by employee and manager


exports.getUserTasks = async (req, res) => {
    try {
        const userId = req.payload; 
        const userTasks = await Task.find({ assignedTo: userId }); 
        res.status(200).json(userTasks);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};


//task assigned  by manger to employee .view by manager


exports.getManagerAssignedTask = async (req, res) => {
    try {
        const userId = req.payload; 
        const TaksAdded = await Task.find({ assignedBy: userId }); 
        res.status(200).json(TaksAdded);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};


//task of employees

exports.getEmployeesTask = async (req, res) => {
    try {
        const userId = req.params; 
        const TaksAdded = await Task.find({ assignedTo: userId }); 
        res.status(200).json(TaksAdded);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};

//task assigned  by admin to manager  --manger side



exports.getManagerAssignedTaskByAdmin = async (req, res) => {
    try {
        const userId = req.param; 
        const TaksAdded = await Task.find({ assignedBy: userId }); 
        res.status(200).json(TaksAdded);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};



// Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true } 
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task status updated successfully", updatedTask });
    } catch (err) {
        res.status(500).json({ error: "Error updating task status", details: err });
    }
};

//edit task

exports.editTask= async(req,res)=>{

    const {title,description,priority,status,dueDate}=req.body
   
    

    const {id}=req.params
    try{
        const updateTask=await Task.findByIdAndUpdate({_id:id},{
            title,description,priority,status,dueDate
        },{new:true})
        await updateTask.save()
        res.status(200).json(updateTask)
    }catch(err){
        res.status(401).json(err)
    }
}

//delete
exports.deleteTask = async(req,res)=>{
    const {id} = req.params

    try{
        const deleteData = await task.findByIdAndDelete({_id:id})
        result.status(200).json(deleteData)
    }catch(err){
        res.status(401).json(err)
    }
}