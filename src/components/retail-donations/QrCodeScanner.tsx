
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Scan, Camera, X, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logQrScan, parseQrCodeData } from "@/lib/qrCodeTracking";

// In a real app, this would be replaced with a proper QR code scanning library
// like react-qr-reader, but for the purpose of this demo, we'll simulate scanning
const QrCodeScanner = () => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [parsedQrData, setParsedQrData] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    setScanning(true);
    setScannedData(null);
    setParsedQrData(null);
    
    // In a real app, this would access the camera and start scanning
    if (videoRef.current) {
      try {
        // Simulate scanning process
        toast({
          title: "Scanner activated",
          description: "Point camera at QR code to scan",
        });
        
        // In a real implementation, we would connect to the camera stream
        // videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
        // videoRef.current.play();
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Could not access camera. Please check permissions.",
          variant: "destructive",
        });
        setScanning(false);
      }
    }
  };

  const stopScanning = () => {
    setScanning(false);
    
    // In a real app, this would stop the camera stream
    // if (videoRef.current && videoRef.current.srcObject) {
    //   const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //   tracks.forEach(track => track.stop());
    //   videoRef.current.srcObject = null;
    // }
  };

  // For demo purposes, we'll simulate a successful scan after a short delay
  useEffect(() => {
    let timeout: number;
    
    if (scanning) {
      timeout = window.setTimeout(() => {
        // Simulate finding a QR code
        const mockQrData = JSON.stringify({
          id: "INV00125",
          name: "Winter Outerwear",
          type: "inventory",
          timestamp: new Date().toISOString(),
        });
        
        setScannedData(mockQrData);
        
        try {
          setParsedQrData(JSON.parse(mockQrData));
        } catch (error) {
          console.error("Error parsing QR data:", error);
          setParsedQrData(null);
        }
        
        stopScanning();
        
        toast({
          title: "QR Code Detected",
          description: "Successfully scanned inventory item",
        });
        
        // Log the scan in the tracking system
        logScanToTrackingSystem(mockQrData);
        
      }, 3000); // Simulate scanning for 3 seconds
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [scanning, toast]);

  const logScanToTrackingSystem = (qrData: string) => {
    try {
      const parsedData = JSON.parse(qrData);
      
      // In a real app, this would make an API call to log the scan
      console.log("Logging scan to tracking system:", {
        itemId: parsedData.id,
        itemName: parsedData.name,
        itemType: parsedData.type,
        scannedBy: userData?.displayName || "Unknown User", // Fixed: use displayName instead of name
        scannedAt: new Date().toISOString(),
        location: "Current Location", // In a real app, this would use geolocation
      });
      
      // Update local storage with scan history for demo purposes
      const scanHistory = JSON.parse(localStorage.getItem("qrScanHistory") || "[]");
      scanHistory.push({
        itemId: parsedData.id,
        itemName: parsedData.name,
        itemType: parsedData.type,
        scannedBy: userData?.displayName || "Unknown User", // Fixed: use displayName instead of name
        scannedAt: new Date().toISOString(),
        location: "Current Location",
      });
      localStorage.setItem("qrScanHistory", JSON.stringify(scanHistory));
      
      // Use the imported logQrScan function
      logQrScan(parsedData, userData);
    } catch (error) {
      console.error("Error logging scan:", error);
    }
  };

  const handleVerifyItem = () => {
    if (parsedQrData) {
      toast({
        title: "Item Verified",
        description: `${parsedQrData.name} (${parsedQrData.id}) has been verified.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Card className="w-full md:w-1/2 relative">
          <CardContent className="p-0 overflow-hidden rounded-md">
            {scanning ? (
              <div className="relative">
                {/* Video feed for camera (in real app) */}
                <video 
                  ref={videoRef}
                  className="w-full aspect-video bg-gray-900 object-cover rounded-md"
                  muted
                  playsInline
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div 
                    ref={scannerRef}
                    className="w-48 h-48 border-2 border-white rounded-lg relative"
                  >
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-soft-pink -translate-x-1 -translate-y-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-soft-pink translate-x-1 -translate-y-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-soft-pink -translate-x-1 translate-y-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-soft-pink translate-x-1 translate-y-1"></div>
                  </div>
                  <p className="text-white drop-shadow-md mt-4">Position QR code within the frame</p>
                </div>
                
                {/* Stop button */}
                <Button 
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={stopScanning}
                >
                  <X className="h-4 w-4 mr-1" /> Stop
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 text-center min-h-[300px]">
                <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">QR Code Scanner</h3>
                <p className="text-muted-foreground mb-6">
                  Scan QR codes to track and verify inventory items
                </p>
                <Button onClick={startScanning} className="flex items-center gap-2">
                  <Scan className="h-4 w-4" />
                  Start Scanning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-1/2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Scan Result</h3>
            
            {scannedData ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">QR Code Scanned Successfully</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{new Date().toLocaleString()}</p>
                  </div>
                </div>
                
                {parsedQrData && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Item Type</p>
                      <p className="font-medium">{parsedQrData.type.charAt(0).toUpperCase() + parsedQrData.type.slice(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Item ID</p>
                      <p className="font-medium">{parsedQrData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Item Name</p>
                      <p className="font-medium">{parsedQrData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(parsedQrData.timestamp).toLocaleString()}</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex gap-3">
                      <Button onClick={handleVerifyItem} className="flex-1 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Verify Item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-center rounded-md border border-dashed">
                <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No QR code scanned yet. Use the scanner to scan an inventory item QR code.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QrCodeScanner;
