'use client';

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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              s <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 4 && (
              <div className={`w-16 h-1 mx-2 ${s < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
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
};