import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, User, Phone, Mail, MapPin, Calendar, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3050';

const AssignedCustomers = ({ employeeId }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchAssignedCustomers = async () => {
      if (!employeeId) {
        setError('Employee ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching customers for employee ID:', employeeId);
        
        // Use your API endpoint
        const customers = await apiRequest(`/employee/${employeeId}/customers`);
        
        console.log('Fetched customers:', customers);
        setCustomers(Array.isArray(customers) ? customers : []);
        
      } catch (error) {
        console.error('Error fetching assigned customers:', error);
        setError('Failed to load assigned customers. Please check if you have customers assigned.');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCustomers();
  }, [employeeId]);

  const goBack = () => {
    // This assumes there's a way to navigate back - you might need to pass setCurrentPage as a prop
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-400 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <span className="ml-4 text-gray-600">Loading customers...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-400 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goBack}
              className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm hover:transform hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">Assigned Customers</h2>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {!error && customers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Customers Assigned</h3>
              <p className="text-gray-500">You don't have any customers assigned to you yet.</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Debug Info:</strong> Employee ID: {employeeId || 'Not provided'}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Found {customers.length} assigned customer{customers.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer, index) => (
                  <div
                    key={customer.CUSTOMER_ID || index}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-transparent hover:border-indigo-300 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-500 text-white p-3 rounded-full">
                        <User size={24} />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">
                          {customer.FULLNAME}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Customer ID: {customer.CUSTOMER_ID}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {customer.EMAIL_ADDRESS && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={16} className="mr-2 text-indigo-500" />
                          <span>{customer.EMAIL_ADDRESS}</span>
                        </div>
                      )}
                      
                      {customer.PHONENUMBER && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={16} className="mr-2 text-indigo-500" />
                          <span>{customer.PHONENUMBER}</span>
                        </div>
                      )}

                      {/* Status indicator */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          customer.STATUS === 'approved' || customer.STATUS === 'active'
                            ? 'bg-green-100 text-green-800'
                            : customer.STATUS === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.STATUS || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug information - remove in production */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <strong>Debug Info:</strong>
            <br />Employee ID: {employeeId || 'Not provided'}
            <br />Customers loaded: {customers.length}
            <br />API Base URL: {API_BASE_URL}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedCustomers;