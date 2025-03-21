import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Share2, Printer, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock QR code generation (in a real app, this would use a proper QR code generation library)
const generateQRCodeDataURL = (data: string) => {
  // This is a placeholder that would be replaced with actual QR code generation
  // Using a placeholder image instead
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`;
};

const QrCodeGenerator = () => {
  const { toast } = useToast();
  const [inventoryId, setInventoryId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [qrType, setQrType] = useState("inventory");
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Mock inventory items for dropdown selection
  const mockInventoryItems = [
    { id: "INV00123", name: "Spring Collection 2023" },
    { id: "INV00124", name: "Summer Accessories" },
    { id: "INV00125", name: "Winter Outerwear" },
    { id: "INV00126", name: "Formal Collection" },
    { id: "INV00127", name: "Athletic Wear" },
    { id: "INV00128", name: "Designer Shoes" },
  ];

  const handleSelectInventory = (id: string) => {
    setInventoryId(id);
    const selectedItem = mockInventoryItems.find(item => item.id === id);
    if (selectedItem) {
      setBatchName(selectedItem.name);
    }
  };

  const generateQR = () => {
    if (!inventoryId) {
      toast({
        title: "Missing Information",
        description: "Please select an inventory item first.",
        variant: "destructive",
      });
      return;
    }

    const qrData = {
      id: inventoryId,
      name: batchName,
      type: qrType,
      timestamp: new Date().toISOString(),
    };

    // In a real app, this would create an actual QR code
    const qrURL = generateQRCodeDataURL(JSON.stringify(qrData));
    setQrCodeURL(qrURL);

    toast({
      title: "QR Code Generated",
      description: `QR code for ${qrType === "inventory" ? "inventory" : "batch"} ${inventoryId} has been created.`,
    });
  };

  const copyToClipboard = () => {
    if (qrCodeURL) {
      // In a real app, this would copy the QR code data or image to clipboard
      // For now, just simulating the copy action
      navigator.clipboard.writeText(qrCodeURL);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied to Clipboard",
        description: "QR code URL has been copied to your clipboard.",
      });
    }
  };

  const downloadQR = () => {
    if (qrCodeURL) {
      const link = document.createElement("a");
      link.href = qrCodeURL;
      link.download = `${qrType}-${inventoryId}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your QR code is being downloaded.",
      });
    }
  };

  const shareQR = () => {
    if (qrCodeURL && navigator.share) {
      navigator.share({
        title: `QR Code for ${qrType} ${inventoryId}`,
        text: `Scan this QR code to track ${qrType} ${inventoryId}`,
        url: qrCodeURL,
      }).then(() => {
        toast({
          title: "Shared Successfully",
          description: "QR code has been shared.",
        });
      }).catch(() => {
        toast({
          title: "Share Failed",
          description: "Unable to share QR code.",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Share Not Supported",
        description: "Web Share API is not supported on this browser.",
        variant: "destructive",
      });
    }
  };

  const printQR = () => {
    if (qrCodeURL) {
      const printWindow = window.open('', '', 'height=500,width=500');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code for ${qrType} ${inventoryId}</title>
              <style>
                body { display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; }
                img { max-width: 100%; height: auto; margin-bottom: 20px; }
                .details { text-align: center; margin-top: 20px; }
              </style>
            </head>
            <body>
              <img src="${qrCodeURL}" alt="QR Code" />
              <div class="details">
                <h2>${qrType.charAt(0).toUpperCase() + qrType.slice(1)} QR Code</h2>
                <p>ID: ${inventoryId}</p>
                <p>Name: ${batchName}</p>
                <p>Generated: ${new Date().toLocaleString()}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        
        toast({
          title: "Print Initiated",
          description: "Print dialog has been opened.",
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Generate QR Code</h3>
          <p className="text-muted-foreground">
            Create QR codes for inventory items or batches to enable easy tracking and verification.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">QR Code Type</label>
            <Select value={qrType} onValueChange={setQrType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventory Item</SelectItem>
                <SelectItem value="batch">Batch</SelectItem>
                <SelectItem value="location">Storage Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Select Inventory Item</label>
            <Select value={inventoryId} onValueChange={handleSelectInventory}>
              <SelectTrigger>
                <SelectValue placeholder="Select inventory item" />
              </SelectTrigger>
              <SelectContent>
                {mockInventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.id} - {item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Custom ID (Optional)</label>
            <Input 
              placeholder="Enter custom ID or use system generated ID" 
              value={inventoryId}
              onChange={(e) => setInventoryId(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Batch Name</label>
            <Input 
              placeholder="Enter batch name" 
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={generateQR} 
            className="w-full flex items-center gap-2"
            disabled={!inventoryId}
          >
            <QrCode className="h-4 w-4" />
            Generate QR Code
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">QR Code Preview</h3>
        
        {qrCodeURL ? (
          <div className="flex flex-col items-center">
            <Card className="p-8 glass-morphism mb-6 max-w-xs mx-auto w-full">
              <CardContent className="p-0 flex flex-col items-center">
                <img 
                  src={qrCodeURL} 
                  alt="QR Code" 
                  className="w-48 h-48 object-contain mb-4"
                />
                <div className="text-center">
                  <p className="font-medium">{qrType.charAt(0).toUpperCase() + qrType.slice(1)} QR Code</p>
                  <p className="text-sm text-muted-foreground">{inventoryId}</p>
                  <p className="text-sm text-muted-foreground">{batchName}</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <Button variant="outline" onClick={downloadQR} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={printQR} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={shareQR} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-md border border-dashed">
            <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No QR code generated yet. Select an inventory item and click 'Generate QR Code' to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeGenerator;
