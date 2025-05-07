import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AeroportList from './AeroportList';
import ZborList from './ZborList';
import BiletList from './BiletList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AeroportList />} />
                <Route path="/flights" element={<ZborList />} />
                <Route path="/tickets" element={<BiletList />} />
            </Routes>
        </Router>
    );
}

export default App;
