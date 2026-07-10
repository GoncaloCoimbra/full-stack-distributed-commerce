import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Polyline, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  timestamp?: string;
  speed?: number;
}

interface TrackingRoute {
  id: string;
  name: string;
  locations: Location[];
  status: 'completed' | 'in_progress' | 'pending';
  startTime?: string;
  endTime?: string;
}

interface TrackingMapProps {
  routes: TrackingRoute[];
  selectedRouteId?: string;
  onRouteSelect?: (_routeId: string) => void;
  animateSimulation?: boolean;
  simulationSpeed?: number;
}

const RoutePolyline = ({ route }: { route: TrackingRoute }) => {
  const locs = route.locations.map(l => [l.lat, l.lng] as [number, number]);
  
  if (locs.length < 2) return null;

  const colors: Record<TrackingRoute['status'], string> = {
    completed: '#10b981',
    in_progress: '#3b82f6',
    pending: '#f59e0b',
  };

  return (
    <Polyline
      positions={locs}
      color={colors[route.status]}
      weight={route.status === 'in_progress' ? 4 : 3}
      opacity={0.7}
      smoothFactor={1.0}
    />
  );
};

const RouteMarkers = ({ route }: { route: TrackingRoute }) => {
  if (route.locations.length === 0) return null;

  const startLoc = route.locations[0];
  const endLoc = route.locations[route.locations.length - 1];
  const validLocations = route.locations.filter(l => l.lat && l.lng);

  const startIcon = L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg">
      <span class="text-white text-xs font-bold">S</span>
    </div>`,
    iconSize: [32, 32],
    className: 'custom-start-icon',
  });

  const endIcon = L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg">
      <span class="text-white text-xs font-bold">F</span>
    </div>`,
    iconSize: [32, 32],
    className: 'custom-end-icon',
  });

  return (
    <>
      <Marker position={[startLoc.lat, startLoc.lng]} icon={startIcon}>
        <Popup>
          <div className="text-sm font-semibold">
            Start: {route.name}
            {startLoc.timestamp && (
              <div className="text-xs text-gray-600">
                {new Date(startLoc.timestamp).toLocaleTimeString('en-GB')}
              </div>
            )}
          </div>
        </Popup>
      </Marker>
      
      <Marker position={[endLoc.lat, endLoc.lng]} icon={endIcon}>
        <Popup>
          <div className="text-sm font-semibold">
            End: {route.name}
            {endLoc.timestamp && (
              <div className="text-xs text-gray-600">
                {new Date(endLoc.timestamp).toLocaleTimeString('en-GB')}
              </div>
            )}
          </div>
        </Popup>
      </Marker>

      {validLocations.slice(1, -1).map((loc, idx) => (
        <Circle
          key={`loc-${idx}`}
          center={[loc.lat, loc.lng]}
          radius={20}
          fillColor="#3b82f6"
          color="#1e40af"
          weight={1}
          opacity={0.4}
          fillOpacity={0.3}
        />
      ))}
    </>
  );
};

const MapCenterHandler = ({ routes, selectedRouteId }: { routes: TrackingRoute[], selectedRouteId?: string }) => {
  const map = useMap();

  useEffect(() => {
    if (routes.length === 0) return;

    const selectedRoute = selectedRouteId ? routes.find(r => r.id === selectedRouteId) : routes[0];
    if (!selectedRoute || selectedRoute.locations.length === 0) return;

    const locs = selectedRoute.locations.map(l => [l.lat, l.lng] as [number, number]);
    const bounds = L.latLngBounds(locs);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [routes, selectedRouteId, map]);

  return null;
};

const TrackingMap: React.FC<TrackingMapProps> = ({
  routes,
  selectedRouteId,
  onRouteSelect: _onRouteSelect,
  animateSimulation: _animateSimulation = false,
  simulationSpeed: _simulationSpeed = 1,
}) => {
  // Normalizar e garantir que lat/lng sejam numbers
  const normalizeRoutes = (rs: TrackingRoute[]) => rs.map(r => ({
    ...r,
    locations: (r.locations || []).map(l => ({
      lat: Number(l.lat),
      lng: Number(l.lng),
      timestamp: l.timestamp,
      speed: l.speed,
    })).filter(l => !Number.isNaN(l.lat) && !Number.isNaN(l.lng)),
  }));

  const [displayedRoutes, setDisplayedRoutes] = useState<TrackingRoute[]>(normalizeRoutes(routes));

  useEffect(() => {
    setDisplayedRoutes(normalizeRoutes(routes));
  }, [routes]);

  const hasValidLocations = displayedRoutes.some(r => (r.locations || []).length > 0);

  if (!hasValidLocations) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg border border-slate-700">
        <p className="text-slate-400">No routes available for tracking</p>
      </div>
    );
  }

  // escolher centro inicial: primeiro ponto válido ou fallback para Portugal
  const firstRouteWithLoc = displayedRoutes.find(r => r.locations && r.locations.length > 0);
  const initialCenter: [number, number] = firstRouteWithLoc
    ? [firstRouteWithLoc.locations[0].lat, firstRouteWithLoc.locations[0].lng]
    : [39.5, -8.0];

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <MapContainer
        center={initialCenter}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        
        <MapCenterHandler routes={displayedRoutes} selectedRouteId={selectedRouteId} />

        {displayedRoutes.map(route => (
          <React.Fragment key={route.id}>
            <RoutePolyline route={route} />
            <RouteMarkers route={route} />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
