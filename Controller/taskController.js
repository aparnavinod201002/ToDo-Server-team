const Task = require('../Model/taskSchema')
const User = require('../Model/userSchema')



//Assign task by admin to managers and managers to employees 



exports.addAllUserstask = async (req, res) => {
    console.log("Inside add task function");

    const { title, priority, assignedTo,dueDate } = req.body;
    const { role, userId } = req.payload; // Extracting role and userId from token payload
console.log(title, priority, assignedTo,dueDate,role, userId  );

    try {
        // Check if assignedTo user exists
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }

        // Role-based validation
        if (role === "Admin") {
            // Admin can assign tasks only to Managers and Employees
            if (assignedUser.role !== "Manager" && assignedUser.role !== "Employee") {
                return res.status(403).json({ message: "Admins can only assign tasks to Managers and Employees" });
            }
        } else if (role === "Manager") {
            // Manager can only assign tasks to Employees under them
            const manager = await User.findById(userId);
            if (!manager || !manager.assignedEmployees.includes(assignedTo)) {
                return res.status(403).json({ message: "Managers can only assign tasks to Employees under them" });
            }
            if (assignedUser.role !== "Employee") {
                return res.status(403).json({ message: "Managers can only assign tasks to Employees" });
            }
        } else if (role === "Employee") {
            // Employees are not allowed to assign tasks
            return res.status(403).json({ message: "Employees are not allowed to assign tasks" });
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        // Check if the task with the same title is already assigned to the same person
        const existingTask = await Task.findOne({ title, assignedTo });
        if (existingTask) {
            return res.status(409).json({ message: "Task with this title is already assigned to the user" });
        }

        // Create a new task
        const newTask = new Task({
            title,
            assignedTo,
            assignedBy: userId, // Track who assigned the task
            priority,
            status: "Pending",
            dueDate,
        });

        await newTask.save();
        res.status(200).json({ message: "Task successfully created", task: newTask });

    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


//get all task details





exports.getAllUserTasks = async (req, res) => {
    try {
        console.log("get the details  to admin");
        
        const { role, userId } = req.payload; // Extract role and userId from token payload
       
       console.log(role, userId);
       
        let userTasks;

        if (role === "Admin") {
            // Admin can view tasks assigned by them to Managers and Employees
            userTasks = await Task.find({ assignedBy: userId });

            // Also, Admin can view tasks assigned by Managers to their Employees
            const managers = await User.find({ role: "Manager" }).select("_id");
            const managerIds = managers.map(manager => manager._id);

            const managerAssignedTasks = await Task.find({ assignedBy: { $in: managerIds } });
            userTasks = [...userTasks, ...managerAssignedTasks];

        } else if (role === "Manager") {
            // Manager can view tasks assigned by Admin to them
            const adminAssignedTasks = await Task.find({ assignedTo: userId});

            // Also, Manager can view tasks they assigned to Employees under them
            const employeeTasks = await Task.find({ assignedBy: userId });

            userTasks = [...adminAssignedTasks, ...employeeTasks];

        } else if (role === "Employee") {
            // Employee can only view tasks assigned to them
            userTasks = await Task.find({ assignedTo: userId });

        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(userTasks);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user tasks", details: err });
    }
};

//update tsak

exports.updateUserTask = async (req, res) => {
    console.log("Inside update task function");

    const { taskId } = req.params;
    const { title, description, priority, status, dueDate } = req.body;
    const { role, userId } = req.payload; // Extracting role and userId from token payload
console.log(taskId,role, userId,status );

    try {
        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Find the assigned user
        const assignedUser = await User.findById(task.assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }

        if (role === "Admin") {
            // Admin can update only tasks assigned to Managers and Employees
            if (assignedUser.role !== "Manager" && assignedUser.role !== "Employee") {
                return res.status(403).json({ message: "Admin can only update tasks assigned to Managers and Employees" });
            }
        } else if (role === "Manager") {
            // Manager can only update tasks assigned to Employees under them
            const isEmployeeUnderManager = await User.findOne({ assignedEmployees: assignedUser._id, _id: userId });
            if (!isEmployeeUnderManager) {
                return res.status(403).json({ message: "Manager can only update tasks for Employees under them" });
            }
        } else if (role === "Employee") {
            // Employees can only update the status of their assigned tasks
            if (task.assignedTo.toString() !== userId) {
                return res.status(403).json({ message: "You can only update your own tasks" });
            }
            await Task.findByIdAndUpdate(taskId, { status }, { new: true });
            return res.status(200).json({ message: "Task status updated successfully" });
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        // Update task details for Admins and Managers
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, priority, status, dueDate },
            { new: true }
        );

        res.status(200).json(updatedTask);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//delete task

exports.deleteUserTask = async (req, res) => {
    console.log("Inside delete task function");

    const { taskId } = req.params;
    const { role, userId } = req.payload; // Extracting role and userId from token payload

    try {
        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Find the assigned user
        const assignedUser = await User.findById(task.assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }

        if (role === "Admin") {
            // Admin can delete tasks assigned to Managers and Employees
            if (assignedUser.role !== "Manager" && assignedUser.role !== "Employee") {
                return res.status(403).json({ message: "Admin can only delete tasks assigned to Managers and Employees" });
            }
        } else if (role === "Manager") {
            // Manager can only delete tasks assigned to Employees under them
            const isEmployeeUnderManager = await User.findOne({ assignedEmployees: assignedUser._id, _id: userId });
            if (!isEmployeeUnderManager) {
                return res.status(403).json({ message: "Manager can only delete tasks for Employees under them" });
            }
        } else {
            // Employees cannot delete tasks
            return res.status(403).json({ message: "Employees cannot delete tasks" });
        }

        // Delete the task
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
