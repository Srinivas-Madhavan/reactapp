import React from "react";
import classes from "./../styles/customModal.module.css";
import { ClassNames } from "@emotion/react";

const addToCart = (item) => {
  const existingItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingItemIndex = existingItems.findIndex(
    (cartItem) => cartItem.dishName === item.dishName
  );

  if (existingItemIndex >= 0) {
    existingItems[existingItemIndex].quantity += 1;
  } else {
    existingItems.push({
      ...item,
      quantity: 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(existingItems));
};

const CustomModal = ({ open, onClose, item }) => {
  let status = open ? null : classes.display;
  

  return (
    <div className={` ${status} ${classes.modal}`}>
      <div>
        <p>{item.dishName}</p>
        <p>{item.description}</p>
        <p>{item.cost}</p>
        <img src={item.imageURL} />
        <div className={classes.buttons}>
          <button
            onClick={() => {
              addToCart(item);
              onClose();
            }}
            className={classes.addtocart}
          >
            Add To Cart
          </button>
          <button onClick={onClose} className={classes.close}>Close</button>
        </div>
      </div>
      <div className={classes.overlay}></div>
    </div>
  );
};

export default CustomModal;
