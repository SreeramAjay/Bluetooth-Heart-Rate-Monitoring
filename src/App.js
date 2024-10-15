import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [heartRate, setHeartRate] = useState(null);
  const [deviceName, setDeviceName] = useState(null);
  const [status, setStatus] = useState('Disconnected');

  const connectBluetoothDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
      });
      setDeviceName(device.name);
      setStatus('Connecting...');

      const server = await device.gatt.connect();
      setStatus('Connected');

      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic(
        'heart_rate_measurement'
      );

      characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleHeartRateChanged);
    } catch (error) {
      console.error('Bluetooth connection failed', error);
      setStatus('Connection failed');
    }
  };

  const handleHeartRateChanged = (event) => {
    const value = event.target.value;
    const heartRateValue = value.getUint8(1); // Heart rate data is in the second byte
    setHeartRate(heartRateValue);
  };

  return (
    <div className="App">
      {/* Add the heart icon above the heading */}
      <FontAwesomeIcon icon={faHeart} className="heart-icon" />
      
      <h1>Bluetooth Heart Rate Monitor</h1>
      
      <button onClick={connectBluetoothDevice}>Connect to Heart Monitor</button>

      <div>
        <p>Status: {status}</p>
        {deviceName && <p>Connected to: {deviceName}</p>}
        {heartRate !== null && (
          <p>
            Heart Rate: <FontAwesomeIcon icon={faHeart} className="heart-icon" /> {heartRate} bpm
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
