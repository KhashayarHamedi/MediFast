"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
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
}: {
  pharmacy: Pharmacy;
  is24h: boolean;
  pharmacy24hLabel: string;
}) {
  const L = require("leaflet");
  const icon = is24h
    ? L.divIcon({
        className: "leaflet-marker-pharmacy-24h",
        html: '<div style="width:24px;height:24px;background:#22c55e;border-radius:50%;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
    : undefined;
  return (
    <Marker position={[pharmacy.latitude, pharmacy.longitude]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <p className="font-medium">{pharmacy.nameFa || pharmacy.name}</p>
          <p className="text-muted-foreground">{pharmacy.address}</p>
          {is24h && (
            <span className="mt-1 inline-block rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
              {pharmacy24hLabel}
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

  const tehranCenter: [number, number] = [35.6892, 51.389];

  return (
    <MapContainer
      center={tehranCenter}
      zoom={12}
      className="h-full w-full"
      style={{ minHeight: 400 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserLocationMarker />
      {pharmaciesList.map((p) => (
        <PharmacyMarker key={p.id} pharmacy={p} is24h={p.is24h ?? false} pharmacy24hLabel={t("pharmacy24h")} />
      ))}
    </MapContainer>
  );
}
