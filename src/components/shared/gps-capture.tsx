'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';

interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface GPSCaptureProps {
  onCapture: (coords: GPSCoordinates) => void;
  label?: string;
}

export const GPSCapture = ({ onCapture, label = 'Capture GPS Location' }: GPSCaptureProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastCoords, setLastCoords] = useState<GPSCoordinates | null>(null);

  const captureGPS = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GPSCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setLastCoords(coords);
        onCapture(coords);
        setLoading(false);
      },
      (err) => {
        setError('Failed to get location: ' + err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const openInMaps = () => {
    if (lastCoords) {
      const url = 'https://www.google.com/maps?q=' + lastCoords.latitude + ',' + lastCoords.longitude;
      window.open(url, '_blank');
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {lastCoords && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <strong>{lastCoords.latitude.toFixed(6)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <strong>{lastCoords.longitude.toFixed(6)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <strong>±{lastCoords.accuracy.toFixed(0)}m</strong>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <strong>{new Date(lastCoords.timestamp).toLocaleTimeString()}</strong>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={captureGPS} disabled={loading} className="flex-1 gap-2">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <MapPin size={18} />
                  Capture Location
                </>
              )}
            </Button>
            {lastCoords && (
              <Button onClick={openInMaps} variant="outlined">
                Open in Maps
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Requires camera and location permissions
          </p>
        </div>
      </CardContent>
    </Card>
  );
};