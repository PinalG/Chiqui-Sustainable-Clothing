
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  QrCode, 
  ArrowUpDown, 
  PackageCheck, 
  MapPin 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Type for QR scan history item
interface QrScanHistoryItem {
  itemId: string;
  itemName: string;
  itemType: string;
  scannedBy: string;
  scannedAt: string;
  location: string;
  status?: string;
}

const QrCodeTrackingHistory = () => {
  const [scanHistory, setScanHistory] = useState<QrScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  // Initial scan history data (in a real app, this would come from an API)
  const mockScanHistory: QrScanHistoryItem[] = [
    {
      itemId: "INV00123",
      itemName: "Spring Collection 2023",
      itemType: "inventory",
      scannedBy: "John Smith",
      scannedAt: "2023-05-01T10:30:00Z",
      location: "Main Warehouse - Section A",
      status: "verified"
    },
    {
      itemId: "INV00125",
      itemName: "Winter Outerwear",
      itemType: "batch",
      scannedBy: "Sarah Johnson",
      scannedAt: "2023-05-02T14:45:00Z",
      location: "Secondary Warehouse",
      status: "shipped"
    },
    {
      itemId: "INV00127",
      itemName: "Athletic Wear",
      itemType: "inventory",
      scannedBy: "Michael Brown",
      scannedAt: "2023-05-03T09:15:00Z",
      location: "Main Warehouse - Section B",
      status: "sold"
    },
    {
      itemId: "INV00128",
      itemName: "Designer Shoes",
      itemType: "location",
      scannedBy: "Emily Davis",
      scannedAt: "2023-05-04T16:20:00Z",
      location: "Retail Store #104",
      status: "verified"
    }
  ];
  
  // Load scan history from localStorage + merge with mock data
  useEffect(() => {
    try {
      // Get from localStorage (from QR scanner component)
      const storedHistory = JSON.parse(localStorage.getItem("qrScanHistory") || "[]");
      // Merge with mock data and ensure no duplicates by itemId + scannedAt
      const seen = new Set();
      const merged = [...mockScanHistory, ...storedHistory].filter(item => {
        const key = `${item.itemId}-${item.scannedAt}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      setScanHistory(merged);
    } catch (error) {
      console.error("Error loading scan history:", error);
      setScanHistory(mockScanHistory);
    }
  }, []);
  
  // Filter and sort scan history
  const filteredHistory = scanHistory
    .filter(item => {
      const matchesSearch = item.itemId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.scannedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter ? item.itemType === typeFilter : true;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
        case "oldest":
          return new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime();
        default:
          return 0;
      }
    });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get status badge for each scan result
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Verified
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Shipped
          </Badge>
        );
      case "sold":
        return (
          <Badge variant="outline" className="bg-soft-pink/10 text-soft-pink border-soft-pink/20">
            Sold
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Scanned
          </Badge>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Tracking History</CardTitle>
        <CardDescription>
          Track all QR code scans across your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, or user..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    <span>{typeFilter ? `Type: ${typeFilter}` : "All Types"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="batch">Batch</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <span>Sort By</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Date Range</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Scanned By</TableHead>
                  <TableHead>Scan Time</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <TableRow key={`${item.itemId}-${item.scannedAt}-${index}`}>
                      <TableCell className="font-medium">{item.itemId}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell className="hidden md:table-cell capitalize">{item.itemType}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.scannedBy}</TableCell>
                      <TableCell>{formatDate(item.scannedAt)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{item.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No scan history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredHistory.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredHistory.length} of {scanHistory.length} scan records
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QrCodeTrackingHistory;
