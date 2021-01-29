const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5bab316ce0a7c75f783cb8a8')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const cors = require('cors') // Place this with other requires (like 'path' and 'express')
const corsOptions = {
    origin: "https://calm-shore-77478.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://Admin:Rn2084562369@cse341cluster-3dwlw.mongodb.net/test?retryWrites=true&w=majority";

mongoose
    .connect(
        'mongodb+srv://Admin:Rn2084562369@cluster0.ct0vm.mongodb.net/Cluster0?retryWrites=true&w=majority'
    )
    .then(result => {
        // This should be your user handling code implement following the course videos
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });