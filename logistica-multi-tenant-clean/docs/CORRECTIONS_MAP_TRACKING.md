# 🗺️ Corrections: Tracking Map - Braga to Lisbon

## 📋 Identified Problems

1. **Map showing America instead of Portugal**
   - Coordinates were hardcoded for New York (40.7128, -74.0060)
   - Result: when selecting route Braga → Lisbon, the map showed America

2. **Problem with transport selection with order**
   - Transport was not found in tracking routes
   - History page was not being activated automatically
   - Lack of logging for debug

## ✅ Implemented Solutions

### 1. Backend - Add city mapping to GPS coordinates

**File:** `backend-nest/src/modules/transports/transports.service.ts`

#### New Method: `getCityCoordinates()`
- Maps city names (ex: "Braga", "Lisboa", "Porto") to real GPS coordinates
- Supports spelling variations (ex: "Covilhã" and "Covilha")
- Fallback to Lisbon if city not found
- Coordinates included:
  - Braga: 41.5455, -8.4268
  - Lisboa: 38.7223, -9.1393
  - Porto: 41.1579, -8.6291
  - Covilhã: 40.2848, -7.5025
  - And 13 more Portuguese cities

#### Updated Method: `getTrackingRoutes()`
- Uses `getCityCoordinates()` to get real coordinates
- Calculates intermediate points between origin and destination
- Generates realistic locations along the route

**Before:**
```typescript
locations: [
  { lat: 40.7128, lng: -74.0060, ... }, // New York
  { lat: 40.7354, lng: -73.9445, ... }, // Middle of New York
  { lat: 40.7580, lng: -73.9855, ... }  // Another part of New York
]
```

**After:**
```typescript
locations: [
  { lat: 41.5455, lng: -8.4268, ... }, // Braga
  { lat: 40.1339, lng: -8.7831, ... }, // Middle of the way
  { lat: 38.7223, lng: -9.1393, ... }  // Lisbon
]
```

### 2. Frontend - Improve transport selection

**File:** `frontend/src/pages/LiveTrackingAndRouteOptimization.tsx`

#### Updated Effect: Route selection by transport

**Changes:**
- Search for transport now compares IDs as strings
- Automatically switches to "historico" tab when transport is found
- Better logging for debug
- Support for vehicleId passed as parameter

**Before:**
```typescript
const match = trackingRoutes.find(r => r.id === transportId || (r as any).transportId === transportId);
if (match) {
  setSelectedTrackingRoute(match.id);
  alert('Simulating transport route started'); // Only alert
}
```

**After:**
```typescript
const match = trackingRoutes.find(r => String(r.id) === String(transportId));
if (match) {
  setSelectedTrackingRoute(match.id);
  setAbaAtiva('historico'); // Switch to tracking tab
  // Detailed logging for debug
  console.log('📍 Origin:', match.origin, '→ Destination:', match.destination);
  console.log('📊 Locations:', match.locations?.length);
}
```

## 🧪 How to Test

1. **Create transport Braga → Lisbon on Transports page:**
   - Origin: Braga
   - Destination: Lisbon
   - Select a vehicle
   - Click "New Transport"

2. **Simulate the route:**
   - Click the "Simular" button of the transport
   - Will be redirected to Tracking page
   - The "History" tab will be activated automatically
   - The Leaflet map will correctly show Portugal (Braga → Lisbon)

3. **Verificar coordinates:**
   - Na console do navegador (Dev Tools)
   - Procurar por logs como:
     ```
     🎏 Found transport route for simulation: transport-id
     📄 Origin: Braga → Destination: Lisbon
     📊 Localizações: 3
     ```

## 📈 Supported Cities

**Portugal Continental:**
- Lisboa, Braga, Porto, Covilhã, Aveiro
- Évora, Leiria, Santarém, Castelo Branco, Guarda
- Belmonte, Viseu, Vila Real, Bragança
- Funchal (Madeira), Ponta Delgada (Açores)
- Amadora, Barreiro, Carcavelos, Cascais
- Caparica, Loures, Oeiras, Setúbal, Almada
- Cacém, Alcântara, Belém, Azambuja, Alcochete

## ⚠️ Important Notes

1. **Spelling Variations:** The system removes accents and converts to lowercase, so "Covilhã", "Covilha" and "COVILHÃ" all work

2. **Fallback:** If a city is not found, the system uses Lisbon as fallback and logs a warning

3. **Boundary Validation:** All coordinates are validated to be in continental Portugal (latitude 36-43, longitude -11 to -5)

## 🔧 Next Improvements (Future)

- [ ] Integration with real geolocation API (Google Maps, Mapbox)
- [ ] Support for complete addresses, not just cities
- [ ] Dynamic calculation of more realistic routes
- [ ] Coordinate caching for performance

---

**Date:** February 27, 2026
**Status:** ✅ Ready for Testing
