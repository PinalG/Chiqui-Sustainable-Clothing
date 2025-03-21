
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Donations = () => {
  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <p className="text-muted-foreground">
          Manage and track individual clothing donations.
        </p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Donation Management</CardTitle>
          <CardDescription>
            Donation management interface will be fully implemented in step 3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            Full donation management experience coming in step 3
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Donations;
