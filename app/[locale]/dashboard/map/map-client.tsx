"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { Pharmacy } from "@/drizzle/schema";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

function GeolocationButton() {
  const map = useMap();
  const t = useTranslations("map");
  function centerOnUser() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        map.flyTo([p.coords.latitude, p.coords.longitude], 15);
      },
      () => {}
    );
  }
  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="h-11 w-11 rounded-full shadow-lg"
        onClick={centerOnUser}
        aria-label={t("centerOnMe")}
      >
        <MapPin className="h-5 w-5" />
      </Button>
    </div>
  );
}

function UserLocationMarker() {
  const t = useTranslations("map");
  const [pos, setPos] = useState<[number, number] | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]),
      () => setPos(null)
    );
  }, []);
  if (!pos) return null;
  return (
    <Marker position={pos}>
      <Popup>{t("yourLocation")}</Popup>
    </Marker>
  );
}

function PharmacyMarker({
  pharmacy,
  is24h,
  pharmacy24hLabel,
  openNowLabel,
}: {
  pharmacy: Pharmacy;
  is24h: boolean;
  pharmacy24hLabel: string;
  openNowLabel: string;
}) {
  const L = require("leaflet");
  /* Highlight open pharmacies, mute non-24h - principle 9 */
  const icon = is24h
    ? L.divIcon({
        className: "leaflet-marker-pharmacy-24h",
        html: '<div style="width:28px;height:28px;background:#22c55e;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })
    : L.divIcon({
        className: "leaflet-marker-pharmacy-muted",
        html: '<div style="width:16px;height:16px;background:rgba(100,100,100,0.5);border-radius:50%;border:1px solid rgba(255,255,255,0.2);opacity:0.6;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
  return (
    <Marker position={[pharmacy.latitude, pharmacy.longitude]} icon={icon}>
      <Popup>
        <div className="text-base">
          <p className="font-medium">{pharmacy.nameFa || pharmacy.name}</p>
          <p className="text-muted-foreground text-sm">{pharmacy.address}</p>
          {is24h && (
            <span className="mt-1 inline-block rounded bg-green-500/20 px-2 py-1 text-sm font-medium text-green-500">
              {openNowLabel}
            </span>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export function MapClient({ pharmacies: pharmaciesList }: { pharmacies: Pharmacy[] }) {
  const t = useTranslations("map");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  const L = require("leaflet");
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });

  const mapCenter: [number, number] = [48.2082, 16.3738]; // Vienna

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-full w-full"
        style={{ minHeight: 400 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <UserLocationMarker />
        {pharmaciesList.map((p) => (
          <PharmacyMarker key={p.id} pharmacy={p} is24h={p.is24h ?? false} pharmacy24hLabel={t("pharmacy24h")} openNowLabel={t("openNow")} />
        ))}
        <GeolocationButton />
      </MapContainer>
    </div>
  );
}
