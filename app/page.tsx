"use client"
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('../component/Map'), {
  ssr: false,
});

const LocationPage = () => {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
            setLatitude(latitude);
            setLongitude(longitude);
            setLocationAllowed(true);
          },
          (error) => {
            console.log('Error occurred while retrieving geolocation:', error);
            setLocationAllowed(false);
          }
        );
      };

      updateLocation(); // Call immediately

      const interval = setInterval(updateLocation, 1000); // Call every second

      return () => clearInterval(interval); // Cleanup function to clear the interval
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLocationAllowed(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleAllowLocation = () => {
    if (!locationAllowed) {
      window.open('https://www.browsersettings.com/location', '_blank');
    }
  };

  const renderNotification = () => {
    if (!locationAllowed) {
      return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="mb-4">if you  alloed  access to your location the map will come.</p>
           {/*  <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAllowLocation}
            >
              Allow Access
            </button> */}
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {renderNotification()}
      {locationAllowed && (
        <>
           
          <DynamicMap latitude={latitude} longitude={longitude} />
        </>
      )}
    </div>
  );
};

export default LocationPage;