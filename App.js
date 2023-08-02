// Explanation:  For Showing the train details and schedule of the train
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    axios.get('/api/train-schedules').then((response) => {
      setTrains(response.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Train Schedules</h1>
      <table>
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Train Number</th>
            <th>Departure Time</th>
            <th>Sleeper Seats Available</th>
            <th>AC Seats Available</th>
            <th>Total Tickets Available</th>
            <th>Price</th>
            <th>Delayed By (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.trainNumber}>
              <td>{train.trainName}</td>
              <td>{train.trainNumber}</td>
              <td>
                {train.departureTime.Hours}:{train.departureTime.Minutes}
              </td>
              <td>{train.seatsAvailable.sleeper}</td>
              <td>{train.seatsAvailable.AC}</td>
              <td>{train.seatsAvailable.sleeper + train.seatsAvailable.AC}</td>
              <td>{train.delayedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
