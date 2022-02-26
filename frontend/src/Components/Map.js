import { MapContainer, TileLayer } from "react-leaflet";
export default function Map() {
  return (
    <MapContainer center={[52.2, 0.12]} zoom={12} scrollWheelZoom={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}
