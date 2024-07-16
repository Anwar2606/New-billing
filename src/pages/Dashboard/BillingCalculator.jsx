// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Import the initialized firebase instance
// import { collection, getDocs, addDoc } from 'firebase/firestore';
// import jsPDF from 'jspdf';
// import './BillingCalculator.css'; // Import the CSS file

// const BillingCalculator = () => {
//   const [products, setProducts] = useState([]);
//   const [billingDetails, setBillingDetails] = useState({
//     items: [],
//     totalAmount: 0,
//     discountPercentage: 0,
//     discountedTotal: 0,
//     taxPercentage: 0,
//     grandTotal: 0,
//   });

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsCollectionRef = collection(db, 'products');
//       try {
//         const querySnapshot = await getDocs(productsCollectionRef);
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setProducts(fetchedProducts);
//         initializeBillingDetails(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products: ', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const initializeBillingDetails = (fetchedProducts) => {
//     const initialItems = fetchedProducts.map(product => ({
//       productId: product.id,
//       name: product.name,
//       quantity: 0,
//       price: product.price,
//     }));
//     setBillingDetails(prevState => ({
//       ...prevState,
//       items: initialItems,
//     }));
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     const updatedItems = billingDetails.items.map(item =>
//       item.productId === productId ? { ...item, quantity } : item
//     );
//     updateBillingDetails(updatedItems);
//   };

//   const updateBillingDetails = (updatedItems) => {
//     const totalAmount = updatedItems.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     const discountPercentage = billingDetails.discountPercentage;
//     const discountedTotal = totalAmount * (1 - discountPercentage / 100);

//     const taxPercentage = billingDetails.taxPercentage;
//     const taxAmount = discountedTotal * (taxPercentage / 100);

//     const grandTotal = discountedTotal + taxAmount;

//     setBillingDetails(prevState => ({
//       ...prevState,
//       items: updatedItems,
//       totalAmount,
//       discountedTotal,
//       grandTotal,
//     }));
//   };

//   const handleDiscountChange = (event) => {
//     const discountPercentage = parseInt(event.target.value) || 0;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       discountPercentage,
//     }));
//   };

//   const handleTaxChange = (event) => {
//     const taxPercentage = parseInt(event.target.value) || 0;
//     setBillingDetails(prevState => ({
//       ...prevState,
//       taxPercentage,
//     }));
//   };

//   useEffect(() => {
//     updateBillingDetails(billingDetails.items);
//   }, [billingDetails.discountPercentage, billingDetails.taxPercentage]);

//   const handleSave = async () => {
//     const billingDocRef = collection(db, 'billing');
//     try {
//       await addDoc(billingDocRef, billingDetails);
//       console.log('Billing details saved successfully in Firestore');
//     } catch (error) {
//       console.error('Error saving billing details: ', error);
//     }

//     const doc = new jsPDF();

//     // Add Header
//     doc.setFontSize(18);
//     doc.text('Company Name', 10, 10);
//     doc.setFontSize(12);
//     doc.text('Company Address', 10, 20);
//     doc.text('Contact: 123-456-7890', 10, 30);
    
//     // Add Date
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 10);

//     // Add Table Headers
//     doc.setFontSize(14);
//     doc.text('Item', 10, 50);
//     doc.text('Quantity', 70, 50);
//     doc.text('Price', 120, 50);
//     doc.text('Total', 170, 50);
    
//     // Add Table Rows
//     const filteredItems = billingDetails.items.filter(item => item.quantity > 0);
//     filteredItems.forEach((item, index) => {
//       const y = 60 + index * 10;
//       doc.text(item.name, 10, y);
//       doc.text(item.quantity.toString(), 70, y);
//       doc.text(`₹${item.price.toFixed(2)}`, 120, y);
//       doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 170, y);
//     });

//     // Add Summary
//     const summaryStartY = 70 + filteredItems.length * 10;
//     doc.text(`Total Amount: ₹${billingDetails.totalAmount.toFixed(2)}`, 10, summaryStartY);
//     doc.text(`Discount: ${billingDetails.discountPercentage}%`, 10, summaryStartY + 10);
//     doc.text(`Discounted Total: ₹${billingDetails.discountedTotal.toFixed(2)}`, 10, summaryStartY + 20);
//     doc.text(`Tax: ${billingDetails.taxPercentage}%`, 10, summaryStartY + 30);
//     doc.text(`Tax Amount: ₹${((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}`, 10, summaryStartY + 40);
//     doc.text(`Grand Total: ₹${billingDetails.grandTotal.toFixed(2)}`, 10, summaryStartY + 50);

//     // Add Footer
//     doc.setFontSize(10);
//     doc.text('Thank you for your business!', 10, 290);
//     doc.text('Please contact us if you have any questions about this invoice.', 10, 300);

//     doc.save('billing_details.pdf');
//   };

//   return (
//     <div className="billing-page">
//       <div className="billing-container">
//         <h2>Billing Calculator</h2>
//         <ul className="billing-list">
//           {products.map(product => (
//             <li key={product.id}>
//               {product.name} - ₹{product.price.toFixed(2)} per unit
//               <input
//                 type="number"
//                 min="0"
//                 value={billingDetails.items.find(item => item.productId === product.id)?.quantity || 0}
//                 onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
//               />
//             </li>
//           ))}
//         </ul>
//         <div className="billing-details">
//           <label>Discount Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.discountPercentage}
//             onChange={handleDiscountChange}
//           />
//           %
//         </div>
//         <div className="billing-details">
//           <label>Tax Percentage:</label>
//           <input
//             type="number"
//             min="0"
//             max="100"
//             value={billingDetails.taxPercentage}
//             onChange={handleTaxChange}
//           />
//           %
//         </div>
//         <div className="billing-summary">
//           <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
//           <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
//           <p>Tax Amount: ₹{((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}</p>
//           <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
//         </div>
//         <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
//       </div>
//     </div>
//   );
// };

// export default BillingCalculator;
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the initialized firebase instance
import { collection, getDocs, addDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './BillingCalculator.css'; // Import the CSS file

const BillingCalculator = () => {
  const [products, setProducts] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    items: [],
    totalAmount: 0,
    discountPercentage: 0,
    discountedTotal: 0,
    taxPercentage: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(productsCollectionRef);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
        initializeBillingDetails(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  const initializeBillingDetails = (fetchedProducts) => {
    const initialItems = fetchedProducts.map(product => ({
      productId: product.id,
      name: product.name,
      quantity: 0,
      price: product.price,
    }));
    setBillingDetails(prevState => ({
      ...prevState,
      items: initialItems,
    }));
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedItems = billingDetails.items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    updateBillingDetails(updatedItems);
  };

  const updateBillingDetails = (updatedItems) => {
    const totalAmount = updatedItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const discountPercentage = billingDetails.discountPercentage;
    const discountedTotal = totalAmount * (1 - discountPercentage / 100);

    const taxPercentage = billingDetails.taxPercentage;
    const taxAmount = discountedTotal * (taxPercentage / 100);

    const grandTotal = discountedTotal + taxAmount;

    setBillingDetails(prevState => ({
      ...prevState,
      items: updatedItems,
      totalAmount,
      discountedTotal,
      grandTotal,
    }));
  };

  const handleDiscountChange = (event) => {
    const discountPercentage = parseInt(event.target.value) || 0;
    setBillingDetails(prevState => ({
      ...prevState,
      discountPercentage,
    }));
  };

  const handleTaxChange = (event) => {
    const taxPercentage = parseInt(event.target.value) || 0;
    setBillingDetails(prevState => ({
      ...prevState,
      taxPercentage,
    }));
  };

  useEffect(() => {
    updateBillingDetails(billingDetails.items);
  }, [billingDetails.discountPercentage, billingDetails.taxPercentage]);

  const handleSave = async () => {
    const billingDocRef = collection(db, 'billing');
    try {
      await addDoc(billingDocRef, billingDetails);
      console.log('Billing details saved successfully in Firestore');
    } catch (error) {
      console.error('Error saving billing details: ', error);
    }

    const doc = new jsPDF();

    // Add Header
    doc.setFontSize(18);
    doc.text('Company Name', 10, 10);
    doc.setFontSize(12);
    doc.text('Company Address', 10, 20);
    doc.text('Contact: 123-456-7890', 10, 30);
    
    // Add Date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 10);

    // Add Table
    doc.autoTable({
      startY: 40,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: billingDetails.items.filter(item => item.quantity > 0).map(item => [
        item.name,
        item.quantity.toString(),
        `₹${item.price.toFixed(2)}`,
        `₹${(item.price * item.quantity).toFixed(2)}`
      ]),
    });

    const finalY = doc.lastAutoTable.finalY || 40;

    // Add Summary
    doc.text(`Total Amount: ₹${billingDetails.totalAmount.toFixed(2)}`, 10, finalY + 10);
    doc.text(`Discount: ${billingDetails.discountPercentage}%`, 10, finalY + 20);
    doc.text(`Discounted Total: ₹${billingDetails.discountedTotal.toFixed(2)}`, 10, finalY + 30);
    doc.text(`Tax: ${billingDetails.taxPercentage}%`, 10, finalY + 40);
    doc.text(`Tax Amount: ₹${((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}`, 10, finalY + 50);
    doc.text(`Grand Total: ₹${billingDetails.grandTotal.toFixed(2)}`, 10, finalY + 60);

    // Add Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 10, finalY + 80);
    doc.text('Please contact us if you have any questions about this invoice.', 10, finalY + 90);

    doc.save('billing_details.pdf');
  };

  return (
    <div className="billing-page">
      <div className="billing-container">
        <h2>Billing Calculator</h2>
        <ul className="billing-list">
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ₹{product.price.toFixed(2)} per unit
              <input
                type="number"
                min="0"
                value={billingDetails.items.find(item => item.productId === product.id)?.quantity || 0}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
              />
            </li>
          ))}
        </ul>
        <div className="billing-details">
          <label>Discount Percentage:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={billingDetails.discountPercentage}
            onChange={handleDiscountChange}
          />
          %
        </div>
        <div className="billing-details">
          <label>Tax Percentage:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={billingDetails.taxPercentage}
            onChange={handleTaxChange}
          />
          %
        </div>
        <div className="billing-summary">
          <h3>Total Amount: ₹{billingDetails.totalAmount.toFixed(2)}</h3>
          <p>Discounted Total: ₹{billingDetails.discountedTotal.toFixed(2)}</p>
          <p>Tax Amount: ₹{((billingDetails.discountedTotal * billingDetails.taxPercentage) / 100).toFixed(2)}</p>
          <h3>Grand Total: ₹{billingDetails.grandTotal.toFixed(2)}</h3>
        </div>
        <button className="save-button" onClick={handleSave}>Save and Generate PDF</button>
      </div>
    </div>
  );
};

export default BillingCalculator;
