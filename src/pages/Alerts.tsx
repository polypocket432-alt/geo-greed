import { Bell, ArrowLeft } from "lucide-react";
import { PriceAlertsList } from "@/components/PriceAlertsList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Price Alerts</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your price alerts and get notified when prices drop
        </p>
      </div>
      
      <PriceAlertsList />
    </div>
  );
}
