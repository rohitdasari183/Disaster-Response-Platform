const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const disasterRoutes = require('./routes/disasterRoutes');
const socialRoutes = require('./routes/socialRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const updatesRoutes = require('./routes/updatesRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const geocodeRoutes = require('./routes/geocodeRoutes');
const initSockets = require('./socket');
const reportRoutes = require('./routes/reportRoutes');



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors(
  {
    origin:["disaster-response-platform-frontend-ten.vercel.app"],
    methods:["POST","GET","PUT","DELETE"],
    credentials:true
  }
));
app.use(express.json());

// Routes
app.get('/',(req,res)=>{
  res.json("Welcome");
}
)
app.use('/disasters', disasterRoutes(io));
app.use('/social-media', socialRoutes(io));
app.use('/resources', resourceRoutes(io));
app.use('/official-updates', updatesRoutes(io));
app.use('/verify-image', verifyRoutes(io));
app.use('/geocode', geocodeRoutes(io));
app.use('/reports', reportRoutes);
app.use('/resources', resourceRoutes(io))


// Socket.IO setup
initSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
