import L, { LatLngExpression } from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { getDistance } from 'geolib';

interface MapProps {
  latitude: number;
  longitude: number;
}

const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
  const [coord, setCoord] = useState<LatLngExpression>([latitude, longitude]);
  const [markers, setMarkers] = useState<LatLngExpression[]>([]);

  useEffect(() => {
    const calculateNearbyCoordinates = () => {
      const nearbyCoordinates: LatLngExpression[] = [];

      for (let i = 1; i <= 10; i++) {
        const distance = Math.floor(Math.random() * 10) * 0.01;
        const lat = latitude + distance;
        const lng = longitude + distance;
        nearbyCoordinates.push([lat, lng]);
      }

      setMarkers(nearbyCoordinates);
    };

    calculateNearbyCoordinates();
  }, [latitude, longitude]);

  const SearchLocation: React.FC = () => {
    return (
      <div className="search-location">
        <input type="text" placeholder="Search Location"  />
      </div>
    );
  };

  const GetMyLocation: React.FC = () => {
    const getMyLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCoord([position.coords.latitude, position.coords.longitude]);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    return (
      <div className="get-my-location">
        <button onClick={getMyLocation}>Get My Location</button>
      </div>
    );
  };
  const findNearestDistance = (): number => {
    const firstNode: any = coord;
    let nearestDistance = Infinity;
    const tolerance = 0.001; // Adjust the tolerance value as needed
  
    for (const markerCoord of markers as []) {
      const distance = getDistance(
        { latitude: firstNode[0], longitude: firstNode[1] },
        { latitude: markerCoord[0], longitude: markerCoord[1] }
      );
  
      // Subtract the radius of the circle from the distance
      const circleRadius = 100; // radius of the circle (adjust as needed)
      const distanceFromCircle = Math.max(distance - circleRadius, 0);
  
      // If the distance is very close to zero, consider it as zero
      const finalDistance = distanceFromCircle < tolerance ? 0 : distanceFromCircle;
  
      if (finalDistance < nearestDistance) {
        nearestDistance = finalDistance;
      }
    }
  
    return nearestDistance;
  };
  return (
    <div>
    {/*   <SearchLocation  /> */}
     {/*  <GetMyLocation /> */}
      <p>Nearest Distance: {findNearestDistance()} meters</p>
      <MapContainer
        style={{
          height: '100vh',
          width: '100vw'
        }}
        center={coord}
        zoom={13}
        attributionControl={false}
      /*   scrollWheelZoom={false} */
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render the initial marker */}
        <Marker
             icon={
                new L.Icon({
                /*   iconUrl: '/logo192.png', // Update the path to '/logo192.png' in the public folder
                  iconRetinaUrl: '/logo192.png', */
                  iconUrl: MarkerIcon.src,
                  iconRetinaUrl: MarkerIcon.src,
                  iconSize: [25, 41],
                  iconAnchor: [12.5, 41],
                  popupAnchor: [0, -41],
                  shadowUrl: MarkerShadow.src,
                  shadowSize: [41, 41],
                })
          }
          position={coord}
        >
          <Popup>
            yonas mulugeta<br />   asrar asrar .
          </Popup>
        </Marker>

        {/* Render the nearby markers */}
        {markers.map((markerCoord, index) => (
          <CircleMarker
            key={index}
            center={markerCoord}
            radius={100} // Set the radius to 10 (adjust as needed)
            fillColor="yellow"
            fillOpacity={0.4}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;