const express=require('express');
const app=express();

// routes
const authrouter=require('./routes/authRoutes');
const prouductrouter=require('./routes/productRoutes');
const cartrouter=require('./routes/cartRoutes');
const couponrouter=require('./routes/couponRoutes');
const orderrouter=require('./routes/orderRoutes');






app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

const cors = require('cors');
app.use(cors());


// db
const mongoose=require('mongoose');

//.env file 
require('dotenv').config();
const port =process.env.PORT;
app.listen(port,()=>{
    console.log(`server Run on Port ${port}`); 
})


app.use(express.json());

// routers
app.use('/api/auth',authrouter); // login & register
app.use('/api/products',prouductrouter);
app.use('/api/cart',cartrouter);
app.use('/api/coupon',couponrouter);
app.use('/api/orders',orderrouter);







mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Cannot connect to MongoDB Atlas:", err);
  });







