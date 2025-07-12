const express = require('express'); 
const cors = require('cors'); 
const mysql = require('mysql'); 
const app = express(); 
const port = 3050; 

app.use(cors());
app.use(express.json()); // Add this to parse JSON request bodies

const connection = mysql.createConnection({   
  host: 'localhost',   
  user: 'root',   
  password: 'manager',   
  database: 'banking_sector' 
});   

connection.connect((err) => {   
  if (err) {     
    console.error('Error connecting to MySQL:', err.stack);     
    return;   
  }   
  console.log('Connected to MySQL as id ' + connection.threadId); 
});  

// Existing endpoints - Updated to match your schema
app.get('/Login', (req, res) => {   
  connection.query('SELECT * FROM LOGIN', (error, results) => {     
    if (error) {       
      console.error('Error executing query:', error);       
      res.status(500).send('Error fetching user');       
      return;     
    }     
    res.json(results);   
  }); 
});    

app.get('/Login/by-username/:Username', (req, res) => {  
  const Username = req.params.Username;   
  connection.query('SELECT * FROM LOGIN WHERE USERNAME=?', [Username], (error, results) => {     
    if (error) {       
      console.error('Error executing query:', error);       
      res.status(500).send('Error fetching user');       
      return;     
    }     
    res.json(results);   
  }); 
});   

app.get('/Login/by-userid/:USER_ID', (req, res) => {   
  const User_Id = req.params.USER_ID;   
  connection.query('SELECT USERNAME FROM LOGIN WHERE USER_ID=?', [User_Id], (error, results) => {     
    if (error) {       
      console.error('Error executing query:', error);       
      res.status(500).send('Error fetching user');       
      return;     
    }     
    res.json(results);   
  }); 
});  

app.get('/bankaccount', (req, res) => {   
  connection.query('SELECT * FROM BANKACCOUNT', (error, results) => {     
    if (error) {       
      console.error('Error executing query:', error);       
      res.status(500).send('Error fetching accounts');       
      return;     
    }     
    res.json(results);   
  }); 
});    

// Get all employees - MOVED TO CORRECT POSITION
app.get('/employees', (req, res) => {
  const query = 'SELECT e.*, l.USERNAME FROM EMPLOYEE e JOIN LOGIN l ON e.USER_ID = l.USER_ID';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching employees:', error);
      return res.status(500).json({ error: 'Error fetching employees' });
    }
    res.json(results);
  });
});

// Customer registration
app.post('/customer/register', (req, res) => {
  const { FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION, ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL } = req.body;
  
  const query = `INSERT INTO CUSTOMER_DETAILS (FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION, ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL, STATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`;
  
  connection.query(query, [FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION, ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL], (error, results) => {
    if (error) {
      console.error('Error registering customer:', error);
      return res.status(500).json({ error: 'Error registering customer' });
    }
    res.status(201).json({ message: 'Customer registered successfully', customerId: results.insertId });
  });
});

// NEW ADMIN APIs

// 1. Create employee login - POST /admin/create-employee
app.post('/admin/create-employee', (req, res) => {
  const { USERNAME, PASSWORD, FULL_NAME, EMAIL, PHONE } = req.body;
  
  // Validate required fields
  if (!USERNAME || !PASSWORD) {
    return res.status(400).json({ error: 'USERNAME and PASSWORD are required' });
  }
  
  // Insert into LOGIN table
  const loginQuery = 'INSERT INTO LOGIN (USERNAME, PASSWORD, ROLE) VALUES (?, ?, ?)';
  connection.query(loginQuery, [USERNAME, PASSWORD, 'employee'], (error, loginResults) => {
    if (error) {
      console.error('Error creating login:', error);
      return res.status(500).json({ error: 'Error creating employee login' });
    }
    
    const userId = loginResults.insertId;
    
    // Insert into EMPLOYEE table
    const employeeQuery = 'INSERT INTO EMPLOYEE (USER_ID, FULL_NAME, EMAIL, PHONE) VALUES (?, ?, ?, ?)';
    connection.query(employeeQuery, [userId, FULL_NAME, EMAIL, PHONE], (empError, empResults) => {
      if (empError) {
        console.error('Error creating employee record:', empError);
        return res.status(500).json({ error: 'Error creating employee record' });
      }
      
      res.status(201).json({ 
        message: 'Employee login created successfully',
        userId: userId,
        employeeId: empResults.insertId
      });
    });
  });
});

// 2. View pending customers - GET /customer/pending
app.get('/customer/pending', (req, res) => {
  const query = `
    SELECT 
      cd.CUSTOMER_ID,
      cd.FULLNAME,
      cd.DOB,
      cd.GENDER,
      cd.NATIONALITY,
      cd.OCCUPATION,
      cd.ADDRESS,
      cd.PHONENUMBER,
      cd.EMAIL_ADDRESS,
      cd.AADHAR_NUMBER,
      cd.UTILITY_BILL,
      cd.STATUS,
      cd.KYC_SUBMITTED,
      ba.ACCOUNT_NO,
      ba.INITIAL_DEPOSIT,
      ba.ACCOUNT_TYPE,
      ba.IFSC_CODE,
      ba.DATE_OF_CREATION
    FROM CUSTOMER_DETAILS cd 
    LEFT JOIN BANKACCOUNT ba ON cd.CUSTOMER_ID = ba.CUSTOMER_ID 
    WHERE cd.STATUS = 'pending'
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching pending customers:', error);
      return res.status(500).json({ error: 'Error fetching pending customers' });
    }
    
    res.json(results);
  });
});

// 3. Assign employee to customer - POST /admin/assign-customer
app.post('/admin/assign-customer', (req, res) => {
  const { EMPLOYEE_ID, CUSTOMER_ID } = req.body;
  
  // Validate required fields
  if (!EMPLOYEE_ID || !CUSTOMER_ID) {
    return res.status(400).json({ error: 'EMPLOYEE_ID and CUSTOMER_ID are required' });
  }
  
  // First check if customer exists and is pending
  connection.query('SELECT * FROM CUSTOMER_DETAILS WHERE CUSTOMER_ID = ?', [CUSTOMER_ID], (checkError, customerResults) => {
    if (checkError) {
      console.error('Error checking customer:', checkError);
      return res.status(500).json({ error: 'Error validating customer' });
    }
    
    if (customerResults.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Check if employee exists
    connection.query('SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID = ?', [EMPLOYEE_ID], (empError, empResults) => {
      if (empError) {
        console.error('Error checking employee:', empError);
        return res.status(500).json({ error: 'Error validating employee' });
      }
      
      if (empResults.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      // Insert into EMPLOYEE_CUSTOMER_ASSIGNMENT table
      const assignQuery = `
        INSERT INTO EMPLOYEE_CUSTOMER_ASSIGNMENT (EMPLOYEE_ID, CUSTOMER_ID) 
        VALUES (?, ?)
      `;
      
      connection.query(assignQuery, [EMPLOYEE_ID, CUSTOMER_ID], (error, results) => {
        if (error) {
          console.error('Error assigning customer to employee:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Customer already assigned to this employee' });
          }
          return res.status(500).json({ error: 'Error assigning customer to employee' });
        }
        
        res.status(201).json({ 
          message: 'Customer assigned to employee successfully',
          employeeId: EMPLOYEE_ID,
          customerId: CUSTOMER_ID,
          customerInfo: customerResults[0],
          employeeInfo: empResults[0]
        });
      });
    });
  });
});

app.listen(port, () => {     
  console.log(`Server listening at http://localhost:${port}`); 
});