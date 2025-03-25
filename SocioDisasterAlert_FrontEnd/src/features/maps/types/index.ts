import { Icon } from "leaflet";

export type Tweets = {
  tweet_id: number;
  full_text: string;
  tweet_date: string;
  year: string;
  image_url: string;
  location: string;
  latitude: string;
  longitude: string;
  username: string;
  url_profile: string;
  disaster: string;
  category: string;
  province_id: number;
};

export type TweetsForm = {
  tweet_id?: number;
  full_text: string;
  tweet_date: string;
  year: string;
  image_url: string;
  location: string;
  latitude: string;
  longitude: string;
  username: string;
  url_profile: string;
  disaster: string;
  category: string;
  province_id: number;
};

export type keyword = {
  keyword_id: number;
  keyword: string;
};
export type keywordForm = {
  keyword_id?: number;
  keyword: string;
};

export const floodIcon = new Icon({
  iconUrl: "/banjir.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [17, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -35], // point from which the popup should open relative to the iconAnchor
});
export const earthQuakeIcon = new Icon({
  iconUrl: "/gempa.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [17, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -35], // point from which the popup should open relative to the iconAnchor
});
export const forestIcon = new Icon({
  iconUrl: "/kebakaran.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [17, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -35], // point from which the popup should open relative to the iconAnchor
});
export const EyeIcon = new Icon({
  iconUrl: "/saksi.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [17, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -35], // point from which the popup should open relative to the iconAnchor
});
export const defaultIcon = new Icon({
  iconUrl: "/defaultMarker.svg",
  iconSize: [35, 35], // size of the icon
  iconAnchor: [17, 35], // point of the icon which will correspond to marker's location
  popupAnchor: [-0, -35], // point from which the popup should open relative to the iconAnchor
});
