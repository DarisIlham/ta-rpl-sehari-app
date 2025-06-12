import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


import SignPage from '../src/Components/pages/Sign.jsx';
import DashPage from '../src/Components/pages/Dashboard.jsx';
import NewLogin from '../src/Components/pages/Newlogin.jsx';
import Profile from '../src/Components/pages/Profile.jsx';

import React from 'react';

function App() {
  return (
    <Router>
      <div className="h-fit">
        <Routes>
          <Route path="/login" element={<NewLogin />} />
          <Route path="/dash" element={<DashPage />} />
          <Route path="/sign" element={<SignPage />} />
          <Route path="/" element={<NewLogin />} />
          <Route path="/profile" element={<Profile />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

