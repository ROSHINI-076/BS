import React, { useState } from 'react';
import AssignedCustomers from './AssignedCustomers';
import CreateAccount from './CreateAccount';

const EmployeePages = ({ employeeId }) => {
  const [currentPage, setCurrentPage] = useState('employee_dashboard');

  return (
    <div className="p-6">
      {currentPage === 'employee_dashboard' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome Employee</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentPage('assigned_customers')}
          >
            View Assigned Customers
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setCurrentPage('create_account')}
          >
            Create Account
          </button>
        </div>
      )}

      {currentPage === 'assigned_customers' && (
        <div>
          <button
            onClick={() => setCurrentPage('employee_dashboard')}
            className="text-sm text-blue-500 underline mb-4"
          >
            ← Back
          </button>
          <AssignedCustomers employeeId={employeeId} />
        </div>
      )}

      {currentPage === 'create_account' && (
        <div>
          <button
            onClick={() => setCurrentPage('employee_dashboard')}
            className="text-sm text-blue-500 underline mb-4"
          >
            ← Back
          </button>
          <CreateAccount />
        </div>
      )}
    </div>
  );
};

export default EmployeePages;
