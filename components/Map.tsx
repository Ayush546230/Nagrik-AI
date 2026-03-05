"use client";

import { useEffect, useRef } from "react";

interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  severity?: number;
  category?: string;
  id?: string;
}

interface MapProps {
  markers: MapMarker[];
  height?: number;
  zoom?: number;
  center?: [number, number];
  onMarkerClick?: (id: string) => void;
}

export default function Map({ markers, height = 300, zoom = 13, center, onMarkerClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // If already initialized, destroy first
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }

      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const defaultCenter: [number, number] = center ??
        (markers.length > 0 ? [markers[0].lat, markers[0].lng] : [20.5937, 78.9629]);

      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      markers.forEach((marker) => {
        const color = marker.severity
          ? marker.severity >= 7 ? "#EF4444"
            : marker.severity >= 4 ? "#F59E0B"
              : "#22C55E"
          : "#06B6D4";

        const markerIcon = L.divIcon({
          className: "",
          html: `<div style="
            width: 28px; height: 28px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          "></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });

        const m = L.marker([marker.lat, marker.lng], { icon: markerIcon }).addTo(map);

        if (marker.label) {
          m.bindPopup(`
            <div style="
              font-family: DM Sans, sans-serif;
              font-size: 13px;
              color: #F9FAFB;
              background: #111827;
              padding: 8px 12px;
              border-radius: 8px;
              min-width: 150px;
            ">
              <strong>${marker.label}</strong>
              ${marker.severity ? `<br/><span style="color: ${color}">Severity: ${marker.severity}/10</span>` : ""}
            </div>
          `, { className: "dark-popup" });
        }

        if (onMarkerClick && marker.id) {
          m.on("click", () => onMarkerClick(marker.id!));
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{
        height, width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        background: "#0D1424",
      }} />
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background: #111827 !important;
          border: 1px solid #1F2937 !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
          border-radius: 10px !important;
          padding: 0 !important;
        }
        .dark-popup .leaflet-popup-tip {
          background: #111827 !important;
        }
        .dark-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-control-zoom a {
          background: #111827 !important;
          color: #F9FAFB !important;
          border-color: #1F2937 !important;
        }
      `}</style>
    </>
  );
}