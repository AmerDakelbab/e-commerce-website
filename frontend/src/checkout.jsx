import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

function Checkout({ cartProducts, totalPrice }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      message.error("Please fill out all payment details.");
      return;
    }

    // Simulate successful checkout
    message.success("Payment Successful!");
    navigate('/');  // Redirect to the homepage or any other page after checkout
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-5 text-center">Checkout</h2>
        <div className="flex justify-between">
          <p className="font-bold">Total:</p>
          <p className="text-red-500 font-bold">${totalPrice}</p>
        </div>
        <div className="my-5">
          <Input 
            placeholder="Card Number" 
            value={cardNumber} 
            onChange={(e) => setCardNumber(e.target.value)} 
            maxLength={16}
          />
          <div className="flex justify-between my-5">
            <Input 
              placeholder="MM/YY" 
              value={expiryDate} 
              onChange={(e) => setExpiryDate(e.target.value)} 
              maxLength={5}
              className="w-1/2 mr-2"
            />
            <Input 
              placeholder="CVV" 
              value={cvv} 
              onChange={(e) => setCvv(e.target.value)} 
              maxLength={3}
              className="w-1/2"
            />
          </div>
          <Button type="primary" block onClick={handlePayment}>
            Confirm Payment
          </Button>
          <Button type="link" block onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;