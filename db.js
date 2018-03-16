const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.

// Connect to a single MongoDB instance. The connection string could be that of a remote server
// We assign the connection instance to a constant to be used later in closing the connection
mongoose.connect('mongodb://localhost:27017/kh-scheduler');