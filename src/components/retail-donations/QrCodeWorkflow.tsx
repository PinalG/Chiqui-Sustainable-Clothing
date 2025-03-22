
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QrCodeScanner from './QrCodeScanner';

interface QrItem {
  id: string;
  name: string;
  type: string;
}

interface QrCodeWorkflowProps {
  initialItem?: QrItem;
}

// Define the prop types for QrCodeScanner
interface QrCodeScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
}

const QrCodeWorkflow: React.FC<QrCodeWorkflowProps> = ({ initialItem }) => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedItem, setScannedItem] = useState<QrItem | undefined>(initialItem);

  const handleScan = (data: string) => {
    if (data) {
      try {
        const itemData = JSON.parse(data);
        setScannedItem(itemData);
        setIsScannerActive(false);
      } catch (error) {
        console.error('Invalid QR code data:', error);
      }
    }
  };

  const startScanning = () => {
    setIsScannerActive(true);
  };

  const stopScanning = () => {
    setIsScannerActive(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card hover-lift">
      <CardHeader>
        <CardTitle className="text-center">Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {isScannerActive ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Point your camera at the QR code</p>
            <QrCodeScanner 
              onScan={handleScan} 
              onError={(error: Error) => console.error(error)} 
            />
            <Button variant="outline" onClick={stopScanning} className="w-full">
              Cancel
            </Button>
          </div>
        ) : scannedItem ? (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-white/50">
              <p><strong>Item: {scannedItem.name}</strong></p>
              <p><strong>Type: {scannedItem.type}</strong></p>
              <p><strong>ID: {scannedItem.id}</strong></p>
            </div>
            <Button onClick={startScanning} className="w-full">Scan Another</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Scan a QR code to track an item</p>
            <Button onClick={startScanning} className="w-full">Start Scanning</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QrCodeWorkflow;
