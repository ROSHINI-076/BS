// CreateAccount.jsx
import React, { useState } from 'react';

const CreateAccount = () => {
  const [form, setForm] = useState({
    customer_id: '',
    account_type: '',
    initial_deposit: ''
  });
  

  const handleSubmit = async () => {
    if (!form.customer_id || !form.account_type || !form.initial_deposit) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3050/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      alert(data.message || 'Account created successfully');
      setForm({ customer_id: '', account_type: '', initial_deposit: '' });
    } catch (err) {
      console.error('Error creating account:', err);
      alert('Failed to create account');
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Create Bank Account</h2>

      <input
        type="text"
        placeholder="Customer ID"
        value={form.customer_id}
        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        value={form.account_type}
        onChange={(e) => setForm({ ...form, account_type: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="">Select Account Type</option>
        <option value="SAVINGS">Savings</option>
        <option value="CURRENT">Current</option>
        <option value="FIXED_DEPOSIT">Fixed Deposit</option>
      </select>

      <input
        type="number"
        placeholder="Initial Deposit"
        value={form.initial_deposit}
        onChange={(e) => setForm({ ...form, initial_deposit: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Create Account
      </button>
    </div>
  );
};

export default CreateAccount;
