import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal";
import classes from "./../styles/home.module.css";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    // Fetch the food data from db.json
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/foods");
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter(
    (food) =>
      food.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    console.log("Close button clicked"); // Debug log
    setIsModalOpen(false);
  };

  return (
    <div className={classes.main}>
      <CustomModal
        open={isModalOpen}
        onClose={handleClose}
        item={currentItem}
      ></CustomModal>

      <header>
        <p className={classes.header}>Food ordering app</p>
        <div className={classes.headerComponent}>
          <button onClick={() => navigate("/order-confirm")} variant="outlined">
            ORDER-CONFIRM
          </button>
          <button
            onClick={() => navigate("/order-tracking")}
            variant="outlined"
          >
            ORDER-TRACKING
          </button>
          <button onClick={() => navigate("/settings")} variant="outlined">
            SETTINGS
          </button>
          <button onClick={() => navigate("/")} variant="outlined">
            LOGOUT
          </button>
        </div>
      </header>

      <input
        type="text"
        placeholder="Search Food / Restaurant"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchInput}
      />
      <div className={classes.foodItemContainer}>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div className={classes.foodItem} key={food.id}>
              <img src={food.imageUrl}></img>
              <p>{food.restaurant}</p>
              <p>{food.dishName}</p>
              <p>{food.description}</p>
              <p>
                Rating: {food.rating} | Cost: ${food.cost}
              </p>
              <div className={classes.buttons}>
                <button
                  onClick={() => {
                    setCurrentItem({
                      dishName: food.dishName,
                      description: food.description,
                      cost: food.cost,
                      imageUrl: food.imageUrl,
                    });
                    handleOpen();
                    // console.log(currentItem);
                  }}
                  className={classes.addtocart}
                >
                  Add to Cart
                </button>
                <button className={classes.order}>Place Order</button>
              </div>
            </div>
          ))
        ) : (
          <p>No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
