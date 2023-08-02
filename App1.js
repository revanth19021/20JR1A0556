const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

// Replace this with the token received from the John Doe Railways Server
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

// Register the API endpoint to fetch real-time train schedules
app.get('/api/train-schedules', async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/train/schedules', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    // Filter and sort the train schedules based on the criteria
    const currentTime = new Date().getTime();
    const twelveHoursLater = currentTime + 12 * 60 * 60 * 1000;
    const filteredTrains = response.data.filter(
      (train) =>
        train.departureTime &&
        new Date(train.departureTime.Hours, train.departureTime.Minutes).getTime() >= currentTime &&
        new Date(train.departureTime.Hours, train.departureTime.Minutes).getTime() <= twelveHoursLater &&
        train.delayedBy <= 30
    );

    // Sort the trains based on the specified criteria
    filteredTrains.sort((a, b) => {
      // Sort by price (ascending order)
      const priceA = a.price.sleeper + a.price.AC;
      const priceB = b.price.sleeper + b.price.AC;
      if (priceA !== priceB) return priceA - priceB;

      // Sort by tickets available (descending order)
      const ticketsAvailableA = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
      const ticketsAvailableB = b.seatsAvailable.sleeper + b.seatsAvailable.AC;
      if (ticketsAvailableA !== ticketsAvailableB) return ticketsAvailableB - ticketsAvailableA;

      // Sort by departure time (descending order considering delays)
      const departureTimeA = new Date(a.departureTime.Hours, a.departureTime.Minutes, a.delayedBy).getTime();
      const departureTimeB = new Date(b.departureTime.Hours, b.departureTime.Minutes, b.delayedBy).getTime();
      return departureTimeB - departureTimeA;
    });

    res.json(filteredTrains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch train schedules' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
