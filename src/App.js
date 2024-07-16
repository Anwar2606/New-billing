// // src/App.js
// import React, { useState } from 'react';
// import '../src/App.css';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import AddProduct from './pages/AddProduct';
// import ProductList from './pages/ProductList';
// import InvoicePDF from './pages/Invoice';
// import { db } from './pages/firebase';
// import BillingCalculator from './pages/BillingCalculator';

// const App = () => {
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [invoiceData, setInvoiceData] = useState(null);

//   const handleProductSelect = (product) => {
//     const existingProduct = selectedProducts.find(p => p.id === product.id);
//     if (existingProduct) {
//       setSelectedProducts(
//         selectedProducts.map(p =>
//           p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
//         )
//       );
//     } else {
//       setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
//     }
//   };

//   const handleGenerateInvoice = () => {
//     const products = selectedProducts.map(product => ({
//       ...product,
//       total: product.price * product.quantity * (1 - product.discount / 100) * 1.18, // Apply discount and GST
//     }));

//     const total = products.reduce((acc, product) => acc + product.total, 0);
//     setInvoiceData({ products, total });
//   };

//   return (
//     <Router>
//       <div>
//         <h1>POS System</h1>
//         <nav>
//           <ul>
//             <li>
//               <button className='glow-on-hover' ><Link to="/add" style={{color:"white",textDecoration:"none",fontWeight:"bolder"}}>Add Product</Link></button>
//             </li>
//             <li>
//               <Link to="/products">Products</Link>
//             </li>
//             <li>
//               <Link to="/bill">BillingCalculator</Link>
//             </li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/add" element={<AddProduct />} />
//           <Route path="/bill" element={<BillingCalculator />} />
//           <Route path="/products" element={
//             <>
//               <ProductList onSelect={handleProductSelect} />
//               <button onClick={handleGenerateInvoice}>Generate Invoice</button>
//               {invoiceData && <InvoicePDF invoiceData={invoiceData} />}
//             </>
//           } />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddProduct from './pages/Add Product/AddProduct';
import ProductList from './pages/ProductList/ProductList';
import InvoicePDF from './pages/Invoice';
import { db } from './pages/firebase';
import BillingCalculator from './pages/Dashboard/BillingCalculator';
import Navbar from './pages/Navbar/Navbar';
import './App.css';

const App = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);

  const handleProductSelect = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleGenerateInvoice = () => {
    const products = selectedProducts.map(product => ({
      ...product,
      total: product.price * product.quantity * (1 - product.discount / 100) * 1.18, // Apply discount and GST
    }));

    const total = products.reduce((acc, product) => acc + product.total, 0);
    setInvoiceData({ products, total });
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/add" element={<AddProduct />} />
          <Route path="/bill" element={<BillingCalculator />} />
          <Route path="/products" element={
            <>
              <ProductList onSelect={handleProductSelect} />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
