
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardMedia, Grid, Typography, Container, Box} from '@mui/material';
import CustomModal from './CustomModal';


const Home = () => {

  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentItem,setCurrentItem]=useState({});

  useEffect(() => {
    // Fetch the food data from db.json
    const fetchFoods = async () => {
      try {
        const response = await fetch('http://localhost:5000/foods');
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
    console.log('Close button clicked'); // Debug log
    setIsModalOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100%',
        width: '100%',
        maxWidth: 'none !important',
        padding: { xs: '10px', sm: '20px' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f4f4f4',
        margin: 0,
      }}
    >


      <CustomModal 
      open={isModalOpen}
      onClose={handleClose} 
      item={currentItem}
      >
      </CustomModal>


      <header>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ marginBottom: '30px' }}
        >
          <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Food Ordering App
          </Typography>
          <Box display="flex" gap="20px" justifyContent="center">
            <Button onClick={() => navigate('/order-confirm')} variant="outlined">🛒</Button>
            <Button onClick={() => navigate('/order-tracking')} variant="outlined">📍</Button>
            <Button onClick={() => navigate('/settings')} variant="outlined">⚙️</Button>
            <Button variant="outlined">🛍️</Button>
          </Box>
        </Box>
      </header>

      <Box sx={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search Food / Restaurant"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        />
      </Box>

      <Grid container spacing={4} sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <Grid key={food.id} item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={food.imageUrl}
                  alt={food.dishName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{food.restaurant}</Typography>
                  <Typography variant="body2" color="textSecondary">{food.dishName}</Typography>
                  <Typography variant="body2" color="textSecondary">{food.description}</Typography>
                  <Typography variant="body2" color="textSecondary">Rating: {food.rating} | Cost: ${food.cost}</Typography>
                </CardContent>
                <Box sx={{ padding: '16px' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() =>{
                      setCurrentItem(
                        {
                          dishName: food.dishName,
                          description: food.description,
                          cost: food.cost,
                          imageUrl: food.imageUrl,
                        }
                      );
                      handleOpen();                      
                      // console.log(currentItem);

                    }                      
                    }
                  >
                    Add to Cart
                  </Button>
                  <Button fullWidth variant="contained" color="secondary" sx={{ marginTop: '8px' }}>
                    Place Order
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
            No matching results found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
