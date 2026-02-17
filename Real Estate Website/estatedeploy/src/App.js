import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { DataProvider } from "./DataContext";
import Home from "./Home";
import Search from "./Search";
import PropertyDetail from "./PropertyDetail";
import Account from "./Account";
import EditProperty from "./EditProperty";
import AddProperty from "./AddProperty";
import "./styles.css";

const Navbar = () => (
    <nav className="navbar">
        <div className="logo-container">
            <img src="/logo.png" alt="Company Logo" className="navbar-logo" />
        </div>
        <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/search" className="nav-link">Search</Link></li>
            <li><Link to="/account" className="nav-link">My Account</Link></li>
        </ul>
    </nav>
);

const App = () => (
    <DataProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/account" element={<Account />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/edit-property/:id" element={<EditProperty />} />
            </Routes>
        </Router>
    </DataProvider>
);

export default App;
