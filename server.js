// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const buses = [
  {
    id: '1',
    operator: 'APSRTC',
    route: 'Hyderabad to Vijayawada',
    time: '14:00 - 19:00',
    fare: 450,
    seats: Array(40).fill(null).map((_, i) => ({
      seatNo: i + 1,
      booked: i % 5 === 0
    }))
  },
  {
    id: '2',
    operator: 'TSRTC',
    route: 'Hyderabad to Guntur',
    time: '16:00 - 21:00',
    fare: 400,
    seats: Array(40).fill(null).map((_, i) => ({
      seatNo: i + 1,
      booked: i % 7 === 0
    }))
  }
];

app.get('/api/buses', (req, res) => {
  res.json(buses);
});

app.get('/api/buses/:id', (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (bus) {
    res.json(bus);
  } else {
    res.status(404).json({ error: 'Bus not found' });
  }
});

app.post('/api/book', (req, res) => {
  const { busId, seats, passenger } = req.body;
  const bus = buses.find(b => b.id === busId);
  if (bus) {
    seats.forEach(s => {
      const seat = bus.seats.find(seat => seat.seatNo === s);
      if (seat && !seat.booked) {
        seat.booked = true;
      }
    });
    res.json({
      success: true,
      bookingId: Math.floor(Math.random() * 100000),
      passenger,
      seats,
      bus
    });
  } else {
    res.status(404).json({ error: 'Bus not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
