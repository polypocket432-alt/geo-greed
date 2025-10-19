import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { useAlerts } from "@/contexts/AlertContext";
import { StorePrice } from "@/types/product";

interface PriceAlertDialogProps {
  productId: string;
  productName: string;
  productBrand?: string;
  store: StorePrice;
}

export const PriceAlertDialog = ({ productId, productName, productBrand, store }: PriceAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(store.price.toString());
  const { addAlert } = useAlerts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addAlert({
      product_id: productId,
      product_name: productName,
      product_brand: productBrand,
      store_id: store.id,
      store_name: store.storeName,
      target_price: parseFloat(targetPrice),
      current_price: store.price,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          Set Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Product</Label>
            <p className="text-sm text-muted-foreground">{productName}</p>
          </div>
          <div>
            <Label>Store</Label>
            <p className="text-sm text-muted-foreground">{store.storeName}</p>
          </div>
          <div>
            <Label>Current Price</Label>
            <p className="text-sm text-muted-foreground">${store.price.toFixed(2)}</p>
          </div>
          <div>
            <Label htmlFor="targetPrice">Target Price</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              min="0"
              max={store.price}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Enter target price"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              You'll be notified when the price drops to or below this amount
            </p>
          </div>
          <Button type="submit" className="w-full">Create Alert</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
