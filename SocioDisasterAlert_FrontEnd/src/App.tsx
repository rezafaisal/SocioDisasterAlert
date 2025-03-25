import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { CardDashboard } from "./features/dashboard/pages/CardDashboard";

export const App = () => {
  // https://stackoverflow.com/questions/47723812/custom-marker-icon-with-react-leaflet How to change Icon Marker
  return (
    <>
      <CardDashboard />
      <div id="map">
        <MapContainer
          center={[-5.209316730158258, 116.36125760982009]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: 680 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[-7.732616613488328, 110.83513564785306]}>
            <Popup>Test</Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};
