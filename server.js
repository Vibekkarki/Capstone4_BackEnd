const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Connect to MongoDB
mongoose.connect('mongodb+srv://bibekkarki92:<password>@capstonegroup4.a9twq.mongodb.net/CapstoneGroup4?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'capstone4_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
