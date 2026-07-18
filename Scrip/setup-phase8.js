// setup-phase8.js - AssetPilot Phase 8 Setup Script
const fs = require('fs');
const path = require('path');

function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('📁 Created: ' + dirPath);
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirp(dir);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created: ' + filePath);
}

console.log('🚀 Starting AssetPilot Phase 8 Setup...\n');

// ============================================
// PWA MANIFEST
// ============================================
const manifest = `{
  "name": "AssetPilot - EDC Asset Management",
  "short_name": "AssetPilot",
  "description": "Enterprise Asset Lifecycle Management System",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`;

writeFile('public/manifest.json', manifest);

// ============================================
// SERVICE WORKER
// ============================================
const serviceWorker = `const CACHE_NAME = 'assetpilot-v1';
const urlsToCache = [
  '/',
  '/login',
  '/globals.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});`;

writeFile('public/sw.js', serviceWorker);

// ============================================
// BARCODE SCANNER COMPONENT
// ============================================
const barcodeScanner = `'use client';

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
};`;

writeFile('src/components/shared/barcode-scanner.tsx', barcodeScanner);

// ============================================
// GPS CAPTURE COMPONENT
// ============================================
const gpsCapture = `'use client';

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
};`;

writeFile('src/components/shared/gps-capture.tsx', gpsCapture);

// ============================================
// PHOTO CAPTURE COMPONENT
// ============================================
const photoCapture = `'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/hooks/use-toast';

interface PhotoCaptureProps {
  label?: string;
  bucket?: string;
  onUpload?: (url: string) => void;
  maxFiles?: number;
}

export const PhotoCapture = ({ 
  label = 'Capture Photo', 
  bucket = 'photos',
  onUpload,
  maxFiles = 1 
}: PhotoCaptureProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const supabase = createClient();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        const file = files[i];
        
        // Compress image if needed
        const compressedFile = await compressImage(file);
        
        const fileExt = file.name.split('.').pop();
        const fileName = Date.now() + '-' + Math.random().toString(36).substring(2) + '.' + fileExt;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        setPhotos(prev => [...prev, publicUrl]);
        onUpload?.(publicUrl);
        toast.success('Photo uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                } else {
                  reject(new Error('Failed to compress image'));
                }
              },
              'image/jpeg',
              0.8
            );
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple={maxFiles > 1}
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full gap-2"
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={'Photo ' + (index + 1)}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Images are automatically compressed and uploaded to Supabase Storage
          </p>
        </div>
      </CardContent>
    </Card>
  );
};`;

writeFile('src/components/shared/photo-capture.tsx', photoCapture);

// ============================================
// GOOGLE SHEETS SYNC SERVICE
// ============================================
const googleSheetsService = `import { createClient } from '@/lib/supabase/server';

const GOOGLE_SHEETS_API_URL = process.env.GOOGLE_SHEETS_API_URL;

interface SheetData {
  sheet: string;
  headers: string[];
  rows: any[][];
}

export class GoogleSheetsService {
  static async syncToSheets(data: SheetData): Promise<boolean> {
    try {
      if (!GOOGLE_SHEETS_API_URL) {
        console.warn('Google Sheets API URL not configured');
        return false;
      }

      const response = await fetch(GOOGLE_SHEETS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to sync to Google Sheets');
      }

      return true;
    } catch (error) {
      console.error('Google Sheets sync error:', error);
      return false;
    }
  }

  static async syncDashboard(): Promise<boolean> {
    const supabase = await createClient();

    try {
      const { data: stats } = await supabase
        .from('assets')
        .select('status')
        .eq('status', 'ready_stock');

      const data: SheetData = {
        sheet: 'Dashboard',
        headers: ['Metric', 'Value', 'Timestamp'],
        rows: [
          ['Ready Stock', (stats || []).length.toString(), new Date().toISOString()],
        ],
      };

      return await this.syncToSheets(data);
    } catch (error) {
      console.error('Dashboard sync error:', error);
      return false;
    }
  }

  static async syncWorkOrders(): Promise<boolean> {
    const supabase = await createClient();

    try {
      const { data: workOrders } = await supabase
        .from('work_orders')
        .select('wo_number, merchant_id, status, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      const data: SheetData = {
        sheet: 'Work Orders',
        headers: ['WO Number', 'Merchant ID', 'Status', 'Created At'],
        rows: (workOrders || []).map(wo => [
          wo.wo_number,
          wo.merchant_id,
          wo.status,
          wo.created_at,
        ]),
      };

      return await this.syncToSheets(data);
    } catch (error) {
      console.error('Work Orders sync error:', error);
      return false;
    }
  }

  static async syncAssets(): Promise<boolean> {
    const supabase = await createClient();

    try {
      const { data: assets } = await supabase
        .from('assets')
        .select('asset_id, asset_type, brand, model, serial_number, status, condition')
        .order('created_at', { ascending: false })
        .limit(100);

      const data: SheetData = {
        sheet: 'Assets',
        headers: ['Asset ID', 'Type', 'Brand', 'Model', 'Serial Number', 'Status', 'Condition'],
        rows: (assets || []).map(asset => [
          asset.asset_id,
          asset.asset_type,
          asset.brand,
          asset.model,
          asset.serial_number,
          asset.status,
          asset.condition,
        ]),
      };

      return await this.syncToSheets(data);
    } catch (error) {
      console.error('Assets sync error:', error);
      return false;
    }
  }
}`;

writeFile('src/lib/services/google-sheets.service.ts', googleSheetsService);

// ============================================
// GOOGLE SHEETS API ROUTE
// ============================================
const googleSheetsApi = `import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/services/google-sheets.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { syncType } = body;

    let success = false;

    switch (syncType) {
      case 'dashboard':
        success = await GoogleSheetsService.syncDashboard();
        break;
      case 'work_orders':
        success = await GoogleSheetsService.syncWorkOrders();
        break;
      case 'assets':
        success = await GoogleSheetsService.syncAssets();
        break;
      default:
        return NextResponse.json({ error: 'Invalid sync type' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ message: 'Sync successful' });
    } else {
      return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}`;

writeFile('src/app/api/google-sheets-sync/route.ts', googleSheetsApi);

// ============================================
// WITHDRAWAL FORM WITH ALL FEATURES
// ============================================
const withdrawalForm = `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/forms/form-field';
import { FormSelect } from '@/components/forms/form-select';
import { BarcodeScanner } from '@/components/shared/barcode-scanner';
import { GPSCapture } from '@/components/shared/gps-capture';
import { PhotoCapture } from '@/components/shared/photo-capture';
import { useToast } from '@/lib/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

export const WithdrawalForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    edc_barcode: '',
    sim_barcode: '',
    gps_latitude: '',
    gps_longitude: '',
    gps_address: '',
    google_maps_link: '',
    photo_front: '',
    photo_back: '',
    photo_serial: '',
    photo_merchant: '',
    merchant_signature: '',
    remarks: '',
  });
  const [isComplete, setIsComplete] = useState(false);
  const toast = useToast();

  const handleBarcodeScan = (type: 'edc' | 'sim', result: string) => {
    setFormData(prev => ({
      ...prev,
      [type + '_barcode']: result,
    }));
    toast.success(type.toUpperCase() + ' barcode scanned: ' + result);
  };

  const handleGPSCapture = (coords: { latitude: number; longitude: number }) => {
    setFormData(prev => ({
      ...prev,
      gps_latitude: coords.latitude.toString(),
      gps_longitude: coords.longitude.toString(),
      google_maps_link: 'https://www.google.com/maps?q=' + coords.latitude + ',' + coords.longitude,
    }));
    toast.success('GPS location captured');
  };

  const handlePhotoUpload = (type: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      ['photo_' + type]: url,
    }));
    toast.success('Photo uploaded');
  };

  const handleSubmit = async () => {
    // Validate all required fields
    const required = [
      'edc_barcode',
      'gps_latitude',
      'gps_longitude',
      'photo_front',
      'photo_back',
      'photo_serial',
      'photo_merchant',
    ];

    const missing = required.filter(field => !formData[field as keyof typeof formData]);

    if (missing.length > 0) {
      toast.error('Please complete all required fields: ' + missing.join(', '));
      return;
    }

    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Withdrawal submitted successfully');
        setIsComplete(true);
      } else {
        toast.error('Failed to submit withdrawal');
      }
    } catch (error) {
      toast.error('Failed to submit withdrawal');
    }
  };

  if (isComplete) {
    return (
      <Card variant="glass">
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Withdrawal Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Asset has been successfully withdrawn and recorded.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold \${
              s <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }\`}>
              {s}
            </div>
            {s < 4 && (
              <div className={\`w-16 h-1 mx-2 \${s < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}\`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Scan Barcodes */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 1: Scan Barcodes</h3>
          <BarcodeScanner
            label="Scan EDC Barcode"
            onScan={(result) => handleBarcodeScan('edc', result)}
          />
          <BarcodeScanner
            label="Scan SIM Card Barcode"
            onScan={(result) => handleBarcodeScan('sim', result)}
          />
          <Button onClick={() => setStep(2)} className="w-full">
            Next: Capture GPS
          </Button>
        </div>
      )}

      {/* Step 2: GPS Location */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 2: Capture GPS Location</h3>
          <GPSCapture onCapture={handleGPSCapture} />
          <div className="flex gap-2">
            <Button onClick={() => setStep(1)} variant="outlined" className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1">
              Next: Take Photos
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 3: Take Photos</h3>
          <PhotoCapture
            label="Front Photo"
            onUpload={(url) => handlePhotoUpload('front', url)}
          />
          <PhotoCapture
            label="Back Photo"
            onUpload={(url) => handlePhotoUpload('back', url)}
          />
          <PhotoCapture
            label="Serial Number Photo"
            onUpload={(url) => handlePhotoUpload('serial', url)}
          />
          <PhotoCapture
            label="Merchant Photo"
            onUpload={(url) => handlePhotoUpload('merchant', url)}
          />
          <div className="flex gap-2">
            <Button onClick={() => setStep(2)} variant="outlined" className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="flex-1">
              Next: Review
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 4: Review & Submit</h3>
          <Card variant="glass">
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">EDC Barcode:</span>
                <strong>{formData.edc_barcode || '-'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SIM Barcode:</span>
                <strong>{formData.sim_barcode || '-'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GPS Location:</span>
                <strong>{formData.gps_latitude ? 'Captured' : 'Not captured'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Photos:</span>
                <strong>
                  {[formData.photo_front, formData.photo_back, formData.photo_serial, formData.photo_merchant]
                    .filter(p => p).length}/4
                </strong>
              </div>
            </CardContent>
          </Card>
          <FormField
            label="Remarks (Optional)"
            value={formData.remarks}
            onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button onClick={() => setStep(3)} variant="outlined" className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit Withdrawal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};`;

writeFile('src/components/withdrawal/withdrawal-form.tsx', withdrawalForm);

// ============================================
// UPDATE NEXT.CONFIG.MJS FOR PWA
// ============================================
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // PWA Support
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default nextConfig;`;

writeFile('next.config.mjs', nextConfig);

console.log('\\n');
console.log('═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   ✅  PHASE 8 COMPLETE - ADVANCED FEATURES ADDED!        ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\\n');
console.log(' Features added:');
console.log('  ✅ PWA Setup (manifest.json, service worker)');
console.log('  ✅ Barcode Scanner (ZXing - supports Code128, QR, EAN-13)');
console.log('  ✅ GPS Capture (with Google Maps integration)');
console.log('  ✅ Photo Capture (with auto-compression & Supabase upload)');
console.log('  ✅ Google Sheets Sync Service');
console.log('  ✅ Complete Withdrawal Form (4-step wizard)');
console.log('\\n');
console.log(' Next Steps:');
console.log('  1. Commit and push to GitHub');
console.log('  2. Wait for Vercel deployment');
console.log('  3. Test on mobile device for PWA & camera features');
console.log('\\n');
console.log(' To use PWA features:');
console.log('  - Add to Home Screen on mobile');
console.log('  - Grant camera & location permissions');
console.log('  - Configure Google Sheets API URL in .env.local');
console.log('');