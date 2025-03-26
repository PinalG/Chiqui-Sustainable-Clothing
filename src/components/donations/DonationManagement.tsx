
import React, { useState } from "react";
import { useUserInteractions } from "@/hooks/use-user-interactions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Plus, RefreshCw, Leaf } from "lucide-react";
import { DonationItem } from "@/types/DonationTypes";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const DonationManagement = () => {
  const { userInteractions, isLoadingInteractions, addDonation } = useUserInteractions();
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<"createDate" | "itemName" | "status">("createDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // New donation form state
  const [newDonation, setNewDonation] = useState({
    itemName: "",
    category: "clothing",
    condition: "good",
    description: ""
  });

  const handleSortChange = (field: "createDate" | "itemName" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDonation((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewDonation((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitDonation = async () => {
    if (!newDonation.itemName) {
      toast.error("Please provide an item name");
      return;
    }
    
    const result = await addDonation(newDonation);
    
    if (result) {
      setIsDialogOpen(false);
      setNewDonation({
        itemName: "",
        category: "clothing",
        condition: "good",
        description: ""
      });
      toast.success("Donation submitted successfully!");
    }
  };

  const donations = userInteractions?.donations || [];
  
  // Filter donations based on active tab
  const filteredDonations = donations.filter(donation => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return donation.status === "pending";
    if (activeTab === "accepted") return donation.status === "accepted";
    if (activeTab === "processed") return donation.status === "processed";
    return true;
  });
  
  // Sort donations
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (sortField === "createDate") {
      return sortDirection === "asc" 
        ? a.createDate - b.createDate 
        : b.createDate - a.createDate;
    }
    
    if (sortField === "itemName") {
      return sortDirection === "asc"
        ? a.itemName.localeCompare(b.itemName)
        : b.itemName.localeCompare(a.itemName);
    }
    
    if (sortField === "status") {
      return sortDirection === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    
    return 0;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "processed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoadingInteractions) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-soft-pink" />
        <span className="ml-2">Loading donations...</span>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Donations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> 
              New Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Donation</DialogTitle>
              <DialogDescription>
                Fill out the details of the item you'd like to donate.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">Item Name</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={newDonation.itemName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., Blue Denim Jacket"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select 
                  value={newDonation.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right">Condition</Label>
                <Select 
                  value={newDonation.condition} 
                  onValueChange={(value) => handleSelectChange("condition", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New (with tags)</SelectItem>
                    <SelectItem value="likenew">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor (for recycling)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newDonation.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Provide any additional details about the item"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitDonation}>Submit Donation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Donations</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {sortedDonations.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="rounded-full bg-soft-pink/10 p-3">
                    <Leaf className="h-8 w-8 text-soft-pink" />
                  </div>
                  <h3 className="text-lg font-medium">No donations found</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "all" 
                      ? "You haven't made any donations yet. Start contributing to sustainability by donating your unused clothing items."
                      : `You don't have any ${activeTab} donations at the moment.`}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Donation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer w-[300px]" onClick={() => handleSortChange("itemName")}>
                        Item
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSortChange("status")}>
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSortChange("createDate")}>
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead className="text-right">Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDonations.map((donation: DonationItem) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.itemName}</TableCell>
                        <TableCell>{donation.category}</TableCell>
                        <TableCell>{donation.condition}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeStyle(donation.status)}>
                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(donation.createDate), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          {donation.sustainabilityImpact ? (
                            <div className="text-xs text-green-600">
                              {donation.sustainabilityImpact.waterSaved && 
                                <div>{donation.sustainabilityImpact.waterSaved} gal water saved</div>
                              }
                              {donation.sustainabilityImpact.co2Reduced && 
                                <div>{donation.sustainabilityImpact.co2Reduced} lbs CO₂ reduced</div>
                              }
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Calculating...</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="py-4 border-t bg-slate-50 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {sortedDonations.length} of {donations.length} donations
                </div>
                {donations.length > 5 && (
                  <div className="text-sm text-soft-pink flex items-center">
                    <Leaf className="mr-1 h-4 w-4" />
                    You've donated {donations.length} items. Thank you for your contribution!
                  </div>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {donations.length > 0 && (
        <Card className="mt-6 bg-soft-pink/5">
          <CardHeader>
            <CardTitle className="text-lg">Your Sustainability Impact</CardTitle>
            <CardDescription>The positive environmental effect of your donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-soft-pink">{donations.length}</div>
                <div className="text-sm text-muted-foreground">Items Donated</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-soft-pink">
                  {donations.reduce((acc, donation) => 
                    acc + (donation.sustainabilityImpact?.waterSaved || 0), 0).toFixed(1)} gal
                </div>
                <div className="text-sm text-muted-foreground">Water Saved</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-soft-pink">
                  {donations.reduce((acc, donation) => 
                    acc + (donation.sustainabilityImpact?.co2Reduced || 0), 0).toFixed(1)} lbs
                </div>
                <div className="text-sm text-muted-foreground">CO₂ Reduced</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DonationManagement;
