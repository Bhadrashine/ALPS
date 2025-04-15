import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhZHJhLXRrbWNlIiwiYSI6ImNtOWk0NzVtaTBieDAyanNjaWJxMTc3NjYifQ.rH6PfrQLpZ57ZZ-oZaGL_w';

// Header Component
function Header() {
  return (
    <div className="header">
      <div className="title-container">
        <h1 className="badge-blue">ALPS</h1>
        <h2>Automated Landslide Prediction System</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fas fa-search search-icon"></i>
        <div className="search-container">
          <input type="text" placeholder="Search location..." className="search-bar" />
        </div>
      </div>
    </div>
  );
}

// Latitude/Longitude/Time Label Component
function LatLongTimeLabel({ lat, lng }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lat-long-time-label">
      <p><strong>Lat:</strong> {lat.toFixed(3)} | <strong>Long:</strong> {lng.toFixed(3)} | <strong>Time:</strong> {time}</p>
    </div>
  );
}

// Controls Component
function Controls({ onZoomIn, onZoomOut }) {
  return (
    <div className="controls">
      <button onClick={onZoomIn}>+</button>
      <button onClick={onZoomOut}>-</button>
    </div>
  );
}

// Custom Popup Component
function CustomPopup({ lat, lng, onClose }) {
  return (
    <div className="custom-popup">
      <button className="close-btn" onClick={onClose}>×</button>
      <strong>Location:</strong> Idukki<br />
      <strong>Lat:</strong> {lat.toFixed(3)}<br />
      <strong>Long:</strong> {lng.toFixed(3)}<br />
      <strong>Rainfall:</strong> 120mm<br />
      <strong>Soil:</strong> Clay<br />
      <strong>Status:</strong> <span style={{ color: '#ff4d4d' }}>High Risk</span>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ lat, lng }) {
  return (
    <div className="summary-card">
      <p><strong>Lat:</strong> {lat.toFixed(3)}</p>
      <p><strong>Long:</strong> {lng.toFixed(3)}</p>
      <p><strong>Rainfall:</strong> 120mm</p>
      <p><strong>Soil Type:</strong> Clay</p>
      <p><strong>Status:</strong> High Risk</p>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <div className="footer">
      <p>© 2025 ALPS - Automated Landslide Prediction System</p>
    </div>
  );
}

// Main App Component
function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [coords, setCoords] = useState({ lat: 9.85, lng: 76.95 });
  const [showPopup, setShowPopup] = useState(false);

  const handleZoomIn = () => {
    if (map.current) map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (map.current) map.current.zoomOut();
  };

  const handleMapClick = useCallback((e) => {
    const { lng, lat } = e.lngLat;
    setCoords({ lat, lng });
    setShowPopup(true);
  }, []);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [76.95, 9.85],
      zoom: 10,
    });

    map.current.on('click', handleMapClick);
  }, [handleMapClick]);

  return (
    <div className="app">
      <Header />
      <LatLongTimeLabel lat={coords.lat} lng={coords.lng} />
      <Controls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      <SummaryCard lat={coords.lat} lng={coords.lng} />
      <div ref={mapContainer} className="map-placeholder" />
      <Footer />

      {showPopup && (
        <CustomPopup
          lat={coords.lat}
          lng={coords.lng}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default App;
