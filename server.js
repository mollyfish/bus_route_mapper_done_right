var mongoose = require('mongoose');
var express = require('express');
var app = express();
var busRoutes = require(__dirname + '/routes/busdata_routes');
var authRoutes = require(__dirname + '/routes/users_routes');
process.env.APP_SECRET = process.env.APP_SECRET || 'changemechangemechangeme';

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/busData');


// process.env.APP_SECRET = process.env.APP_SECRET || 'changemechangemechangeme';


app.use(express.static('public'));

app.use('/api', busRoutes);
app.use('/api', authRoutes);

app.listen(3000, function() {
  console.log('server listening on port 3000');
});
