const Task = require('../Model/taskSchema')
//task added to all users


exports.addAllUserstask = async(req,res)=>{
    console.log("inside add task added function");
    const {title,description,assignedTo,priority,status,dueDate}=req.body
    
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

    const {title,description,assignedTo, priority,status,dueDate}=req.body
    const assignedBy = req.payload
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

//get all task details 

exports.getAllUserTasks = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const userTasks = await Task.find({ assignedTo: userId }); 
        res.status(200).json(userTasks);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};

//get aal task assigned to managers 


exports.getUserTasks = async (req, res) => {
    try {
        const userId = req.payload; 
        const userTasks = await Task.find({ assignedTo: userId }); 
        res.status(200).json(userTasks);
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