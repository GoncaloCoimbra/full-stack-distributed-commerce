import React from 'react';
import { render } from '@testing-library/react';

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => <>{children}</>,
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    demoLogin: jest.fn(),
    logout: jest.fn(),
    updateUserData: jest.fn(),
    isAuthenticated: false,
    isSuperAdmin: false,
    isAdmin: false,
    isOperator: false,
    isDemo: false,
  }),
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => <div />,
  Popup: ({ children }: any) => <div>{children}</div>,
  Polyline: () => <div />,
  Circle: () => <div />,
  Marker: () => <div />,
  useMap: () => ({
    fitBounds: jest.fn(),
  }),
}));

jest.mock('leaflet', () => ({
  latLng: (lat: number, lng: number) => ({ lat, lng }),
  latLngBounds: jest.fn(),
  divIcon: jest.fn().mockImplementation((opts: any) => ({ ...opts, options: opts })),
}));

import App from './App';

test('renders App without crashing', () => {
  expect(() => render(<App />)).not.toThrow();
});
