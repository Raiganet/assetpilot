'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Camera, CameraOff, CheckCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  label?: string;
}

export const BarcodeScanner = ({ onScan, label = 'Scan Barcode' }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const startScanning = async () => {
    try {
      setError('');
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (devices.length === 0) {
        setError('No camera found');
        return;
      }

      // Use back camera if available
      const deviceId = devices.find(d => d.label.toLowerCase().includes('back'))?.deviceId || devices[0].deviceId;

      if (videoRef.current) {
        await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
          if (result) {
            const text = result.getText();
            setLastResult(text);
            onScan(text);
            stopScanning();
          }
        });
        setIsScanning(true);
      }
    } catch (err) {
      setError('Failed to start camera: ' + (err as Error).message);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera size={20} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ display: isScanning ? 'block' : 'none' }}
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Camera is off</p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {lastResult && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Last scanned: <strong>{lastResult}</strong></span>
            </div>
          )}

          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1 gap-2">
                <Camera size={18} />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outlined" className="flex-1 gap-2">
                <CameraOff size={18} />
                Stop Scanning
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supports: Code128, QR Code, EAN-13, UPC, and more
          </p>
        </div>
      </CardContent>
    </Card>
  );
};