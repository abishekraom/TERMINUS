import { create } from 'zustand';

export const useTelemetryStore = create((set) => ({
  vessels: [],
  aircraft: [],
  status: 'DISCONNECTED',
  setTelemetry: (data) => set((state) => ({
    vessels: data.vessels !== undefined ? data.vessels : state.vessels,
    aircraft: data.aircraft !== undefined ? data.aircraft : state.aircraft
  })),
  setStatus: (status) => set({ status })
}));
