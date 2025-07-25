
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Users, UserPlus, Settings, User, LogOut, Home, ArrowLeft } from 'lucide-react';
import AdminPages from './AdminPages';
import AssignedCustomers from './AssignedCustomers';
import CreateAccount from './CreateAccount';

import './BankingPortal.css'; 

// Configuration
const API_BASE_URL = 'http://localhost:3050';

// Utility Components
const ApiStatus = ({ isOnline }) => (
  <div className={`fixed top-2 right-2 px-3 py-1 rounded-full text-xs font-medium z-50 ${
    isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`}>
    {isOnline ? 'API Online' : 'API Offline'}
  </div>
);

const Message = ({ message, type }) => {
  if (!message) return null;
  
  return (
    <div className={`p-4 rounded-lg mb-4 text-center animate-pulse ${
      type === 'success' 
        ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white' 
        : 'bg-gradient-to-r from-pink-400 to-red-400 text-white'
    }`}>
      {message}
    </div>
  );
};

// Main App Component
const BankingPortal = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // API utility functions
  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Login`);
      setApiOnline(response.ok);
    } catch (error) {
      setApiOnline(false);
    }
  };

  const apiRequest = async (endpoint, method = 'GET', data = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const showLogin = (role) => {
    setCurrentRole(role);
    setMessage({ text: '', type: '' });
    setCurrentPage('login');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCurrentPage('home');
  };

  // Initialize
  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Page Components
 const HomePage = () => (
  <>
    <h1 className="portal-heading">Welcome to Banking Sector Portal</h1>
    <p className="portal-subtext">Select your role to continue:</p>
    <div className="button-grid">
      <button onClick={() => showLogin('admin')} className="portal-button">Admin</button>
      <button onClick={() => showLogin('employee')} className="portal-button">Employee</button>
      <button onClick={() => showLogin('customer')} className="portal-button">Customer</button>
      <button onClick={() => setCurrentPage('customer_register')} className="portal-button">New Customer Registration</button>
    </div>
  </>
);


  const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoginLoading(true);
      
      try {
        if (currentRole === 'admin') {
          if (username === 'admin' && password === 'admin123') {
            setCurrentUser({ username, role: 'admin' });
            setCurrentPage('admin_dashboard');
            showMessage('Login successful!', 'success');
          } else {
            showMessage('Invalid admin credentials!', 'error');
          }
        } else {
          const users = await apiRequest('/Login');
          const user = users.find(u => u.USERNAME === username && u.PASSWORD === password);
          
          if (user) {
            if (user.ROLE === currentRole) {
              setCurrentUser({ ...user, role: currentRole });
             if (currentRole === 'employee') {
            try {
              const employees = await apiRequest('/employees');
              const employee = employees.find(emp => emp.USER_ID === user.USER_ID);
              if (employee) {
                setCurrentUser({ 
                  ...user, 
                  role: currentRole, 
                  EMPLOYEE_ID: employee.EMPLOYEE_ID,
                  FULL_NAME: employee.FULL_NAME
                });
              } else {
                setCurrentUser({ ...user, role: currentRole });
              }
            } catch (empError) {
              console.log('Could not fetch employee details, using USER_ID');
              setCurrentUser({ ...user, role: currentRole });
            }
            setCurrentPage('employee_dashboard');
          } else if (currentRole === 'customer') {
            setCurrentUser({ ...user, role: currentRole });
            setCurrentPage('customer_dashboard');
          }
          showMessage('Login successful!', 'success');
        } else {
          showMessage(`This user is not registered as ${currentRole}!`, 'error');
        }
      } else {
        showMessage('Invalid credentials!', 'error');
      }
    }
  } catch (error) {
    showMessage('Login failed. Please check your connection.', 'error');
    console.error('Login error:', error);
  }
  
  setLoginLoading(false);
};

    return (
      <div>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {currentRole?.charAt(0).toUpperCase() + currentRole?.slice(1)} Login
        </h2>
        <Message message={message.text} type={message.type} />
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  };

 // Updated CustomerRegisterPage component - replace your existing one

const CustomerRegisterPage = () => {
  const [formData, setFormData] = useState({
    FULLNAME: '',         // Matches backend API
    DOB: '',
    GENDER: '',
    NATIONALITY: '',
    OCCUPATION: '',
    ADDRESS: '',
    PHONENUMBER: '',      // Matches backend API
    EMAIL_ADDRESS: '',    // Matches backend API
    AADHAR_NUMBER: '',    // Matches backend API
    UTILITY_BILL: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Make sure the API endpoint matches your backend
      console.log('Submitting registration data:', formData); // Debug log
      
      const response = await apiRequest('/customer/register', 'POST', formData);
      
      // Log the response to see what's returned
      console.log('Registration response:', response);
      
      showMessage('Registration submitted successfully!', 'success');
      
      // Reset form
      setFormData({
        FULLNAME: '',
        DOB: '',
        GENDER: '',
        NATIONALITY: '',
        OCCUPATION: '',
        ADDRESS: '',
        PHONENUMBER: '',
        EMAIL_ADDRESS: '',
        AADHAR_NUMBER: '',
        UTILITY_BILL: ''
      });
      
    } catch (error) {
      showMessage('Registration failed. Please try again.', 'error');
      console.error('Registration error:', error);
      
      // Log more details about the error
      if (error.response) {
        console.error('Error response:', error.response);
      }
    }
    
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={() => setCurrentPage('home')}
        className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Customer Registration</h2>
      <Message message={message.text} type={message.type} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="FULLNAME"
            value={formData.FULLNAME}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select
            name="GENDER"
            value={formData.GENDER}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nationality</label>
          <input
            type="text"
            name="NATIONALITY"
            value={formData.NATIONALITY}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Occupation</label>
          <input
            type="text"
            name="OCCUPATION"
            value={formData.OCCUPATION}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Address</label>
          <input
            type="text"
            name="ADDRESS"
            value={formData.ADDRESS}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            name="PHONENUMBER"
            value={formData.PHONENUMBER}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input
            type="email"
            name="EMAIL_ADDRESS"
            value={formData.EMAIL_ADDRESS}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Aadhar Number</label>
          <input
            type="text"
            name="AADHAR_NUMBER"
            value={formData.AADHAR_NUMBER}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Utility Bill Amount</label>
          <input
            type="number"
            step="0.01"
            name="UTILITY_BILL"
            value={formData.UTILITY_BILL}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
};
  const AdminDashboard = () => (
    <div>
      <button
        onClick={logout}
        className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm"
      >
        <LogOut size={16} /> Logout
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setCurrentPage('create_employee')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <UserPlus size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Create Employee</h3>
          <p className="text-sm opacity-90">Add new employees to the system</p>
        </div>
        <div
          onClick={() => setCurrentPage('manage_customers')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <Users size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Manage Customers</h3>
          <p className="text-sm opacity-90">View pending customer registrations</p>
        </div>
        <div
          onClick={() => setCurrentPage('assign_employee')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <Settings size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Assign Employee</h3>
          <p className="text-sm opacity-90">Assign employees to customers</p>
        </div>
        <div
          onClick={() => setCurrentPage('view_employees')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <User size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">View Employees</h3>
          <p className="text-sm opacity-90">Manage employee accounts</p>
        </div>
      </div>
    </div>
  );

  const EmployeeDashboard = () => (
    <div>
      <button
        onClick={logout}
        className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm"
      >
        <LogOut size={16} /> Logout
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Employee Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setCurrentPage('assigned_customers')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <Users size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Assigned Customers</h3>
          <p className="text-sm opacity-90">View and manage your assigned customers</p>
        </div>
        <div
          onClick={() => setCurrentPage('create_account')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <UserPlus size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Create Account</h3>
          <p className="text-sm opacity-90">Create bank accounts for customers</p>
        </div>
      </div>
    </div>
  );

  const CustomerDashboard = () => (
    <div>
      <button
        onClick={logout}
        className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm"
      >
        <LogOut size={16} /> Logout
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Welcome, {currentUser?.FULL_NAME || 'Customer'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setCurrentPage('profile')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <User size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Profile</h3>
          <p className="text-sm opacity-90">View and update your profile</p>
        </div>
        <div
          onClick={() => setCurrentPage('customer_support')}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        >
          <AlertCircle size={32} className="mx-auto mb-2" />
          <h3 className="text-xl font-medium mb-2">Customer Support</h3>
          <p className="text-sm opacity-90">Get help and support</p>
        </div>
      </div>
    </div>
  );

const renderPage = () => {
  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'login':
      return <LoginPage />;
    case 'customer_register':
      return <CustomerRegisterPage />;

    // Admin views
    case 'admin_dashboard':
    case 'create_employee':
    case 'manage_customers':
    case 'assign_employee':
    case 'view_employees':
      return <AdminPages currentPage={currentPage} setCurrentPage={setCurrentPage} />;

    // Employee views
    case 'employee_dashboard':
      return <EmployeeDashboard />;
    case 'assigned_customers':
      
   // Try EMPLOYEE_ID first, then fall back to USER_ID
      const employeeId = currentUser?.EMPLOYEE_ID || currentUser?.USER_ID;
      console.log('AssignedCustomers employeeId =', employeeId);
      console.log('Current user:', currentUser);
      return (
        <AssignedCustomers 
          employeeId={employeeId}
          setCurrentPage={setCurrentPage}
        />
      );
    case 'create_account':
      return <CreateAccount setCurrentPage={setCurrentPage} />;
    case 'create_account':
      return <CreateAccount />;

    // Customer view
    case 'customer_dashboard':
      return <CustomerDashboard />;

    default:
      return <HomePage />;
  }
};


  return (
  <div className="bank-portal-container">
    <ApiStatus isOnline={apiOnline} />
    <div className="portal-card">
      {renderPage()}
    </div>
  </div>
);


};

export default BankingPortal;
