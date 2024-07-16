import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/tamizha.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title"><img src={Logo} height={"60px"}/></h1>
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/add" className="navbar-link">Add Product</Link>
        </li>
        <li className="navbar-item">
          <Link to="/products" className="navbar-link">Products</Link>
        </li>
        <li className="navbar-item">
          <Link to="/bill" className="navbar-link">Billing Calculator</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
