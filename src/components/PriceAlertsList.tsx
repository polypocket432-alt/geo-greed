import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Trash2 } from "lucide-react";
import { useAlerts } from "@/contexts/AlertContext";

export const PriceAlertsList = () => {
  const { alerts, removeAlert, toggleAlert } = useAlerts();

  if (alerts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Price Alerts</h3>
        <p className="text-sm text-muted-foreground">
          Set price alerts on products to get notified when prices drop
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{alert.product_name}</h4>
                {alert.notified && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Triggered
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.store_name}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Target: </span>
                  <span className="font-semibold">${alert.target_price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current: </span>
                  <span className={alert.current_price <= alert.target_price ? "text-primary font-semibold" : ""}>
                    ${alert.current_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={alert.is_active}
                onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAlert(alert.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
