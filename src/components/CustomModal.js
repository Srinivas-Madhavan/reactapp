import React from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const addToCart = (item) => {
  const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const existingItemIndex = existingItems.findIndex(
    (cartItem) => cartItem.dishName === item.dishName
  );
  
  if (existingItemIndex >= 0) {
    existingItems[existingItemIndex].quantity += 1;
  } else {
    existingItems.push({
      ...item,
      quantity: 1
    });
  }
  
  localStorage.setItem('cartItems', JSON.stringify(existingItems));
  // console.log(item);
  // alert(`Added to cart: ${item.dishName}\n${item.description}\nPrice: $${item.cost}`);


};

const CustomModal = ({ open, onClose, item}) => {
  console.log(item);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <p>{item.dishName}</p>
        <p>{item.description}</p>
        <p>{item.cost}</p>
        <img src={item.imageURL}/>
        <Button onClick={()=>
        {
          addToCart(item);
          onClose();
        }} 
        variant="contained" sx={{ mt: 2 }}>
          Add To Cart
        </Button>
        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;