
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QrItem {
  id: string;
  name: string;
  type: string;
}

interface QrCodeWorkflowProps {
  initialItem?: QrItem;
}

// Define the QrCodeScanner component that's used within this workflow
const QrCodeScanner: React.FC<{
  onScan: (data: string) => void;
  onError: (error: Error) => void;
}> = ({ onScan, onError }) => {
  // Simple placeholder implementation for the scanner
  // In a real app, this would use camera access and QR code detection
  return (
    <div className="bg-gray-100 p-6 rounded-md text-center">
      <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-400 flex items-center justify-center mb-4">
        <span className="text-gray-500">Scanner View</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Scanning for QR codes...
      </p>
      {/* For demo/test purposes, add a button to simulate a scan */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onScan(JSON.stringify({
          id: "DEMO123",
          name: "Demo Item",
          type: "Clothing"
        }))}
        className="mr-2"
      >
        Simulate Scan
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onError(new Error("Demo error"))}
      >
        Simulate Error
      </Button>
    </div>
  );
};

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
