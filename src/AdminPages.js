import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, CheckCircle, XCircle, Clock, UserCheck, Eye } from 'lucide-react';
import './AdminPages.css'; 






// Configuration
const API_BASE_URL = 'http://localhost:3050';

// Utility Components
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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// Menu Items Configuration
const menuItems = [
  {
    id: 'create_employee',
    title: 'Create Employee',
    description: 'Add new employees to the system',
    icon: UserPlus,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'manage_customers',
    title: 'Manage Customers',
    description: 'View and manage customer registrations',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'assign_employee',
    title: 'Assign Employee',
    description: 'Assign employees to customers',
    icon: UserCheck,
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'view_employees',
    title: 'View Employees',
    description: 'View all system employees',
    icon: Eye,
    gradient: 'from-orange-500 to-red-500'
  }
];

// Admin Pages Component
const AdminPages = ({ currentPage: initialPage, setCurrentPage: setMainPage }) => {
  const [currentPage, setCurrentPage] = useState(initialPage || 'admin_dashboard');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleBackToMain = () => {
    setMainPage('home');
  };

  // API utility function
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

  // Admin Dashboard Component
 // Replace your AdminDashboard component with this fixed version:

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Manage your banking system</p>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} rounded-2xl p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl group min-h-[200px] flex flex-col justify-between`}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                
                {/* Card Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-4">
                    <IconComponent className="w-8 h-8 text-white mr-3 flex-shrink-0" />
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-white text-opacity-90 mb-6 flex-grow">{item.description}</p>
                  
                  {/* Access Button */}
                  <div className="flex items-center text-white font-semibold mt-auto">
                    <span className="mr-2">Access</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Main Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleBackToMain}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Back to Main
          </button>
        </div>
      </div>
    </div>
  );
};

  // Create Employee Page
  const CreateEmployeePage = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      fullname: '',
      email: '',
      phone: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async () => {
      setLoading(true);
      
      try {
        const employeeData = {
          USERNAME: formData.username,
          PASSWORD: formData.password,
          FULL_NAME: formData.fullname,
          EMAIL: formData.email,
          PHONE: formData.phone
        };
        
        await apiRequest('/admin/create-employee', 'POST', employeeData);
        showMessage('Employee created successfully!', 'success');
        setFormData({
          username: '',
          password: '',
          fullname: '',
          email: '',
          phone: ''
        });
      } catch (error) {
        showMessage('Failed to create employee. Please try again.', 'error');
        console.error('Create employee error:', error);
      }
      
      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('admin_dashboard')}
            className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm hover:from-pink-500 hover:to-red-500 transition-all"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Create New Employee</h2>
            <Message message={message.text} type={message.type} />
            <div className="space-y-6">
              <div>
                <label className="block text-gray-200 font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white placeholder-gray-300"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-200 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white placeholder-gray-300"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-200 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white placeholder-gray-300"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-200 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white placeholder-gray-300"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-200 font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white placeholder-gray-300"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Employee...' : 'Create Employee'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Manage Customers Page
  const ManageCustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] = useState(false);

    const loadPendingCustomers = async () => {
      setCustomersLoading(true);
      
      try {
        const customerData = await apiRequest('/customer/pending');
        setCustomers(customerData);
      } catch (error) {
        showMessage('Error loading customers. Please try again.', 'error');
        console.error('Load customers error:', error);
      }
      
      setCustomersLoading(false);
    };

    useEffect(() => {
      loadPendingCustomers();
    }, []);

    const getStatusIcon = (status) => {
      switch (status?.toLowerCase()) {
        case 'approved':
          return <CheckCircle className="text-green-500" size={16} />;
        case 'rejected':
          return <XCircle className="text-red-500" size={16} />;
        default:
          return <Clock className="text-yellow-500" size={16} />;
      }
    };

    const getStatusClass = (status) => {
      switch (status?.toLowerCase()) {
        case 'approved':
          return 'text-green-600 font-semibold';
        case 'rejected':
          return 'text-red-600 font-semibold';
        default:
          return 'text-yellow-600 font-semibold';
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentPage('admin_dashboard')}
            className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm hover:from-pink-500 hover:to-red-500 transition-all"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Manage Customer Registrations</h2>
            
            {customersLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-2 text-gray-200">Loading...</span>
              </div>
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Account Info</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 divide-opacity-30">
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-200">
                            No pending customers found
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer, index) => (
                          <tr key={index} className="hover:bg-white hover:bg-opacity-10 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-200">{customer.FULLNAME}</td>
                            <td className="px-6 py-4 text-sm text-gray-200">{customer.EMAIL_ADDRESS}</td>
                            <td className="px-6 py-4 text-sm text-gray-200">{customer.PHONENUMBER}</td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(customer.STATUS)}
                                <span className={getStatusClass(customer.STATUS)}>
                                  {customer.STATUS?.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-200">
                              {customer.ACCOUNT_NO ? (
                                <div>
                                  <div>Account: {customer.ACCOUNT_NO}</div>
                                  <div>Type: {customer.ACCOUNT_TYPE || 'N/A'}</div>
                                  <div>Deposit: ₹{customer.INITIAL_DEPOSIT || 0}</div>
                                </div>
                              ) : (
                                'No Account'
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Assign Employee Page
  const AssignEmployeePage = () => {
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);

    const loadAssignmentData = async () => {
      setLoading(true);
      
      try {
        // Load customers
        const customerData = await apiRequest('/customer/pending');
        setCustomers(customerData);

        // Load employees
        const employeeData = await apiRequest('/employees');
        setEmployees(employeeData);
      } catch (error) {
        showMessage('Error loading assignment data. Please try again.', 'error');
        console.error('Load assignment data error:', error);
      }
      
      setLoading(false);
    };

    const handleAssign = async () => {
      if (!selectedCustomer || !selectedEmployee) {
        showMessage('Please select both customer and employee.', 'error');
        return;
      }

      setAssignLoading(true);
      
      try {
        const assignmentData = {
          CUSTOMER_ID: selectedCustomer,
          EMPLOYEE_ID: selectedEmployee
        };
        
        await apiRequest('/admin/assign-customer', 'POST', assignmentData);
        showMessage('Employee assigned successfully!', 'success');
        setSelectedCustomer('');
        setSelectedEmployee('');
      } catch (error) {
        showMessage('Failed to assign employee. Please try again.', 'error');
        console.error('Assign employee error:', error);
      }
      
      setAssignLoading(false);
    };

    useEffect(() => {
      loadAssignmentData();
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('admin_dashboard')}
            className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm hover:from-pink-500 hover:to-red-500 transition-all"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Assign Employee to Customer</h2>
            <Message message={message.text} type={message.type} />
            
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-2 text-gray-200">Loading...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-200 font-medium mb-2">Select Customer</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white"
                    required
                  >
                    <option value="" className="text-gray-900">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.CUSTOMER_ID} value={customer.CUSTOMER_ID} className="text-gray-900">
                        {customer.FULLNAME}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-2">Select Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors text-white"
                    required
                  >
                    <option value="" className="text-gray-900">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.EMPLOYEE_ID} value={employee.EMPLOYEE_ID} className="text-gray-900">
                        {employee.FULL_NAME} ({employee.USERNAME})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssign}
                  disabled={assignLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {assignLoading ? 'Assigning Employee...' : 'Assign Employee'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // View Employees Page
  const ViewEmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);

    const loadEmployees = async () => {
      setEmployeesLoading(true);
      
      try {
        const employeeData = await apiRequest('/employees');
        setEmployees(employeeData);
      } catch (error) {
        showMessage('Error loading employees. Please try again.', 'error');
        console.error('Load employees error:', error);
      }
      
      setEmployeesLoading(false);
    };

    useEffect(() => {
      loadEmployees();
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentPage('admin_dashboard')}
            className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg mb-4 inline-flex items-center gap-2 text-sm hover:from-pink-500 hover:to-red-500 transition-all"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">View Employees</h2>
            
            {employeesLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="ml-2 text-gray-200">Loading...</span>
              </div>
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Username</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Full Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 divide-opacity-30">
                      {employees.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-200">
                            No employees found
                          </td>
                        </tr>
                      ) : (
                        employees.map((employee, index) => (
                          <tr key={index} className="hover:bg-white hover:bg-opacity-10 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-200">{employee.EMPLOYEE_ID}</td>
                            <td className="px-6 py-4 text-sm text-gray-200">{employee.USERNAME}</td>
                            <td className="px-6 py-4 text-sm text-gray-200">{employee.FULL_NAME}</td>
                            <td className="px-6 py-4 text-sm text-gray-200">{employee.EMAIL}</td>
                            <td className="px-6 py-4 text-sm text-gray-200">{employee.PHONE}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'create_employee':
        return <CreateEmployeePage />;
      case 'manage_customers':
        return <ManageCustomersPage />;
      case 'assign_employee':
        return <AssignEmployeePage />;
      case 'view_employees':
        return <ViewEmployeesPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return renderCurrentPage();
};

export default AdminPages;

