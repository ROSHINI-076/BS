const express = require('express'); 
const cors = require('cors'); 
const mysql = require('mysql'); 
const app = express(); 
const port = 3050; 

app.use(cors());
app.use(express.json()); // Parse JSON request bodies

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

// Get all login data
app.get('/Login', (req, res) => {   
  connection.query('SELECT * FROM LOGIN', (error, results) => {     
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error fetching user');     
    }     
    res.json(results);   
  }); 
});    

// Get login by username
app.get('/Login/by-username/:Username', (req, res) => {  
  const Username = req.params.Username;   
  connection.query('SELECT * FROM LOGIN WHERE USERNAME=?', [Username], (error, results) => {     
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error fetching user');     
    }     
    res.json(results);   
  }); 
});   

// Get username by user ID
app.get('/Login/by-userid/:USER_ID', (req, res) => {   
  const User_Id = req.params.USER_ID;   
  connection.query('SELECT USERNAME FROM LOGIN WHERE USER_ID=?', [User_Id], (error, results) => {     
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error fetching user');     
    }     
    res.json(results);   
  }); 
});  

// Get all bank accounts
app.get('/bankaccount', (req, res) => {   
  connection.query('SELECT * FROM BANKACCOUNT', (error, results) => {     
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error fetching accounts');     
    }     
    res.json(results);   
  }); 
});    

// Get all employees
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

/*Register customer
app.post('/customer/register', (req, res) => {
  const { FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION, ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL } = req.body;
  
  const query = `
    INSERT INTO CUSTOMER_DETAILS 
    (FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION, ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL, STATUS) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;
  
  connection.query(query, [FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION, ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL], (error, results) => {
    if (error) {
      console.error('Error registering customer:', error);
      return res.status(500).json({ error: 'Error registering customer' });
    }
    res.status(201).json({ message: 'Customer registered successfully', customerId: results.insertId });
  });
});*/

// Create employee login
app.post('/admin/create-employee', (req, res) => {
  const { USERNAME, PASSWORD, FULL_NAME, EMAIL, PHONE } = req.body;

  if (!USERNAME || !PASSWORD) {
    return res.status(400).json({ error: 'USERNAME and PASSWORD are required' });
  }

  const loginQuery = 'INSERT INTO LOGIN (USERNAME, PASSWORD, ROLE) VALUES (?, ?, ?)';
  connection.query(loginQuery, [USERNAME, PASSWORD, 'employee'], (error, loginResults) => {
    if (error) {
      console.error('Error creating login:', error);
      return res.status(500).json({ error: 'Error creating employee login' });
    }

    const userId = loginResults.insertId;

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

// View pending customers
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

//SHIVANI
//customers
app.get('/customers', (req, res) => {
  connection.query('SELECT * FROM CUSTOMER_DETAILS', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

//POST FOR APPROVAL
app.post('/customer/register', (req, res) => {
  const {
    FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION,
    ADDRESS, PHONE, EMAIL, AADHAR_NUMBER, UTILITY_BILL
  } = req.body;

  const query = `
    INSERT INTO CUSTOMER_DETAILS (
      FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION,
      ADDRESS, PHONENUMBER, EMAIL_ADDRESS, AADHAR_NUMBER, UTILITY_BILL, STATUS
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;

  const values = [
    FULLNAME, DOB, GENDER, NATIONALITY, OCCUPATION,
    ADDRESS, PHONE, EMAIL, AADHAR_NUMBER, UTILITY_BILL
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Customer registration failed:', err);
      return res.status(500).json({ error: 'Registration failed' });
    }
    res.status(201).json({ message: 'Customer registered successfully' });
  });
});


//APPROVE
app.post('/customer/approve/:id', (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE CUSTOMER_DETAILS SET STATUS = "verified" WHERE CUSTOMER_ID = ?';
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Approval failed' });
    res.json({ message: 'Approved successfully' });
  });
});
//REJECT
app.post('/customer/reject/:id', (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE CUSTOMER_DETAILS SET STATUS = "rejected" WHERE CUSTOMER_ID = ?';
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Rejection failed' });
    res.json({ message: 'Rejected successfully' });
  });
});

//GET customer by userid for profile(enter custid for profile)
  app.get('/customer/by-userid/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const query = `
    SELECT c.*, l.USERNAME
    FROM CUSTOMER_DETAILS c
    JOIN LOGIN l ON c.USER_ID = l.USER_ID
    WHERE c.USER_ID = ?
  `;
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching customer by user ID:', error);
      return res.status(500).json({ error: 'Error fetching customer info' });
    }
    res.json(results);
  });
});

//list customers to assign
app.get('/customer/list', (req, res) => {
  const query = 'SELECT CUSTOMER_ID,FULLNAME FROM CUSTOMER_DETAILS';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ error: 'Failed to fetch customers' });
    }
    res.json(results);  // returns name
  });
});

// Assign employee to customer
app.post('/admin/assign-customer', (req, res) => {
  const { EMPLOYEE_ID, CUSTOMER_ID } = req.body;

  if (!EMPLOYEE_ID || !CUSTOMER_ID) {
    return res.status(400).json({ error: 'EMPLOYEE_ID and CUSTOMER_ID are required' });
  }

  connection.query('SELECT * FROM CUSTOMER_DETAILS WHERE CUSTOMER_ID = ?', [CUSTOMER_ID], (checkError, customerResults) => {
    if (checkError) {
      console.error('Error checking customer:', checkError);
      return res.status(500).json({ error: 'Error validating customer' });
    }

    if (customerResults.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    connection.query('SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID = ?', [EMPLOYEE_ID], (empError, empResults) => {
      if (empError) {
        console.error('Error checking employee:', empError);
        return res.status(500).json({ error: 'Error validating employee' });
      }

      if (empResults.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

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

//employee
// GET Assigned Customers for an Employee
app.get('/employee/:id/customers', (req, res) => {
  const employeeId = req.params.id;

  const query = `
    SELECT cd.CUSTOMER_ID, cd.FULLNAME, cd.EMAIL_ADDRESS, cd.PHONENUMBER, cd.STATUS
    FROM CUSTOMER_DETAILS cd
    JOIN EMPLOYEE_CUSTOMER_ASSIGNMENT eca ON cd.CUSTOMER_ID = eca.CUSTOMER_ID
    WHERE eca.EMPLOYEE_ID = ?
  `;

  connection.query(query, [employeeId], (error, results) => {
    if (error) {
      console.error('Error fetching assigned customers:', error);
      return res.status(500).json({ error: 'Error fetching assigned customers' });
    }
    res.json(results);
  });
});

// POST Create New Bank Account
app.post('/account', (req, res) => {
  const { customer_id, account_type, initial_deposit } = req.body;

  const insertQuery = `
    INSERT INTO BANKACCOUNT (CUSTOMER_ID, ACCOUNT_TYPE, INITIAL_DEPOSIT, IFSC_CODE, DATE_OF_CREATION)
    VALUES (?, ?, ?, 'BANK000123', CURDATE())
  `;

  connection.query(insertQuery, [customer_id, account_type, initial_deposit], (error, result) => {
    if (error) {
      console.error('Error creating account:', error);
      return res.status(500).json({ error: 'Error creating account' });
    }

    res.status(201).json({ message: 'Account created successfully', accountId: result.insertId });
  });
});

app.listen(port, () => {     
  console.log(`Server listening at http://localhost:${port}`); 
});

