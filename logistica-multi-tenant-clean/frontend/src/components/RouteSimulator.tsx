import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  timestamp?: string;
  speed?: number;
}

interface RouteSimulation {
  id: string;
  name: string;
  locations: Location[];
  startTime: string;
  endTime: string;
  currentLocationIndex: number;
  isPlaying: boolean;
  speed: number;
}

interface RouteSimulatorProps {
  route: {
    id: string;
    name: string;
    origin: string;
    destination: string;
    locations: Location[];
    startTime: string;
    endTime: string;
    status: 'completed' | 'in_progress' | 'pending';
  };
  onSimulationUpdate?: (progress: number, location: Location) => void;
  onSimulationComplete?: () => void;
}

const RouteSimulator: React.FC<RouteSimulatorProps> = ({
  route,
  onSimulationUpdate,
  onSimulationComplete,
}) => {
  const [simulation, setSimulation] = useState<RouteSimulation>({
    id: route.id,
    name: route.name,
    locations: route.locations,
    startTime: route.startTime,
    endTime: route.endTime,
    currentLocationIndex: 0,
    isPlaying: false,
    speed: 1,
  });

  useEffect(() => {
    if (!simulation.isPlaying || simulation.locations.length === 0) return;

    const interval = setInterval(() => {
      setSimulation(prev => {
        if (prev.currentLocationIndex >= prev.locations.length - 1) {
          clearInterval(interval);
          onSimulationComplete?.();
          return { ...prev, isPlaying: false };
        }

        const nextIndex = prev.currentLocationIndex + 1;
        const progress = (nextIndex / prev.locations.length) * 100;
        const location = prev.locations[nextIndex];

        onSimulationUpdate?.(progress, location);

        return {
          ...prev,
          currentLocationIndex: nextIndex,
        };
      });
    }, 1000 / (simulation.speed || 1));

    return () => clearInterval(interval);
  }, [simulation.isPlaying, simulation.speed, simulation.locations.length, onSimulationUpdate, onSimulationComplete]);

  const currentLocation = simulation.locations[simulation.currentLocationIndex] || simulation.locations[0];
  const totalDistance = simulation.locations.length;
  const progress = ((simulation.currentLocationIndex + 1) / totalDistance) * 100;

  const startTime = new Date(simulation.startTime);
  const endTime = new Date(simulation.endTime);
  const totalDuration = (endTime.getTime() - startTime.getTime()) / 1000;
  const elapsedTime = (simulation.currentLocationIndex / simulation.locations.length) * totalDuration;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-white">{route.name}</h4>
          <p className="text-sm text-slate-400">
            {route.origin} → {route.destination}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Time Decorrido</p>
          <p className="text-sm font-bold text-white font-mono">
            {formatTime(elapsedTime)} / {formatTime(totalDuration)}
          </p>
        </div>
      </div>

      {/* Informações da Localização Atual */}
      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">Localização Atual</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-slate-400">Latitude</p>
            <p className="text-white font-mono">{currentLocation.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-slate-400">Longitude</p>
            <p className="text-white font-mono">{currentLocation.lng.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-slate-400">Speed</p>
            <p className="text-white font-mono">{currentLocation.speed || 0} km/h</p>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400">Progresso da Route</span>
          <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setSimulation(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            simulation.isPlaying
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          }`}
        >
          {simulation.isPlaying ? (
            <>
              <Pause size={16} /> Pausar
            </>
          ) : (
            <>
              <Play size={16} /> Reproduzir
            </>
          )}
        </button>

        <button
          onClick={() =>
            setSimulation(prev => ({
              ...prev,
              currentLocationIndex: 0,
              isPlaying: false,
            }))
          }
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
        >
          <RotateCcw size={16} /> Reiniciar
        </button>

        <select
          value={simulation.speed}
          onChange={e => setSimulation(prev => ({ ...prev, speed: Number(e.target.value) }))}
          className="px-2 py-2 rounded-lg text-sm bg-slate-700 text-slate-300 border border-slate-600 focus:border-red-500 focus:outline-none"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
          <option value={8}>8x</option>
        </select>

        <button
          onClick={() => setSimulation(prev => ({ ...prev, currentLocationIndex: prev.locations.length - 1, isPlaying: false }))}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all ml-auto"
        >
          <FastForward size={16} /> Para o Fim
        </button>
      </div>

      {/* Info de Debug */}
      <p className="text-xs text-slate-500">
        Ponto {simulation.currentLocationIndex + 1} de {simulation.locations.length}
      </p>
    </div>
  );
};

export default RouteSimulator;

