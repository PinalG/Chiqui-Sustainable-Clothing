
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, ShoppingBag, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the ACDRP platform dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <ShoppingBag className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paper Donations</CardTitle>
            <BarChart2 className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,385</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retail Partners</CardTitle>
            <Users className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-soft-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>
              Overview of the most recent donations on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              Chart will be implemented in step 4
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Sustainability Impact</CardTitle>
            <CardDescription>
              Environmental impact of donations this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              Impact metrics will be implemented in step 7
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
