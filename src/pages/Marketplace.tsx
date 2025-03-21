
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Marketplace = () => {
  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase high-quality donated clothing.
        </p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Our marketplace will be fully implemented in step 5.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            Full marketplace experience coming in step 5
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketplace;
