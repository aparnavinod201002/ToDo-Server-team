const bcrypt = require('bcrypt');
const User = require('../Model/userSchema');
const jwt = require('jsonwebtoken');
const { response } = require('express');

// Register controller
exports.registerUserController = async (req, res) => {
    const { name, email, password, role, createdBy, assignedEmployees } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }else{

         // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name,email,password: hashedPassword, role,createdBy,assignedEmployees  });
        // Save user to database
        await newUser.save();
        res.status(200).json(newUser)
        console.log(newUser); 
        }

    } catch (error) {
        res.status(401).json({error});
    }
};


// login user
exports.loginUserController = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
  
    try {
      const existingUser = await User.findOne({email});
      if (!existingUser) {
        return res.status(404).json('User not found');
      }
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(406).json('Incorrect Password');
      }
      const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET || 'secretekey');
      res.status(200).json({ existingUser, token });
      console.log(token);
      
    } catch (error) {
      console.error(error);
      res.status(500).json('Server error');
    }
  };


  // to get manager so that they can be assigned to there employes
  exports.getManagers = async (req,res)=>{
    const searchKey = req.query.search
    console.log(searchKey);
    const query = {
      role:"Manager",
      name :{
        $regex : searchKey, $options : "i"
      }
    }
    try {
      const getallManager = await User.find(query)
      res.status(200).json(getallManager)
      
    } catch (error) {
      response.status(401).json(error)
    }
    
  }
  

 

  //get all users

  exports.getAllEmployeesAndManagerController = async (req, res) => {
    console.log("Inside getEmployeesController");
  
    try {
    
      const employees = await User.find({ 
        role: { $in: ["Employee", "Manager"] } // Fetch both roles
      });
  console.log(employees);
  
      res.status(200).json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


  