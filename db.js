const mongoose = require('mongoose');
const DB_URL = 'mongodb://0.0.0.0/inotebook?readPreference=primary&directConnection=true';
const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

 
app.use(cors())

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB');
});
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
app.use(express.json());



app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost: ${port}`)
})

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/test');

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));


