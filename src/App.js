// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfessionalBankingWebsite from './Home'; // Don't change this line
import BankingPortal from './BankingPortal';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfessionalBankingWebsite />} />
      <Route path="/banking-portal" element={<BankingPortal />} />
    </Routes>
  );
};

export default App;
