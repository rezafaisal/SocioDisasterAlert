import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PopUpMaps } from "./PopUpMaps";
import {
  EyeIcon,
  Tweets,
  defaultIcon,
  earthQuakeIcon,
  floodIcon,
  forestIcon,
} from "../types"; // Import witnessIcon
import React from "react";
import { Loader } from "@mantine/core";

type props = {
  data?: Tweets[];
  isLoading: boolean;
  isError: boolean;
};

export const Maps: React.FC<props> = ({ data, isError, isLoading }: props) => {
  if (isError || isLoading || data?.length === 0) {
    return (
      <div className="flex justify-start items-center">
        <Loader type="dots" />
      </div>
    );
  }

  const getIcon = (disaster: string, category: string) => {
    if (category === "Saksi Mata") {
      return EyeIcon;
    }

    switch (disaster) {
      case "Banjir":
        return floodIcon;
      case "Gempa Bumi":
        return earthQuakeIcon;
      case "Kebakaran Hutan":
        return forestIcon;
      default:
        return defaultIcon; // default icon if disaster type doesn't match
    }
  };

  return (
    <div id="map">
      <MapContainer
        center={[-5.209316730158258, 116.36125760982009]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: 800, zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data?.map((marker, index) => (
          <Marker
            key={index}
            position={[Number(marker.latitude), Number(marker.longitude)]}
            icon={getIcon(marker.disaster, marker.category)}
          >
            <Popup>
              <PopUpMaps data={marker} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
