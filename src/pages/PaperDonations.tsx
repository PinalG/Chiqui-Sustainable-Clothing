
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PaperDonations = () => {
  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paper Donations</h1>
        <p className="text-muted-foreground">
          Manage the core paper donation process for corporate retailers.
        </p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Paper Donation Management</CardTitle>
          <CardDescription>
            The paper donation workflow will be fully implemented in step 3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            Full paper donation experience coming in step 3
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaperDonations;
