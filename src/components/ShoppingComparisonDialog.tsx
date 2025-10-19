import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Store, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ComparisonOption {
  type: "single" | "multiple";
  storeName?: string;
  storeCount?: number;
  totalCost: number;
  breakdown: {
    storeName: string;
    itemCount: number;
    subtotal: number;
  }[];
}

interface ShoppingComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  singleStoreOption: ComparisonOption;
  multipleStoresOption: ComparisonOption;
  savings: number;
}

export function ShoppingComparisonDialog({
  open,
  onOpenChange,
  singleStoreOption,
  multipleStoresOption,
  savings,
}: ShoppingComparisonDialogProps) {
  const isSingleStoreCheaper = singleStoreOption.totalCost < multipleStoresOption.totalCost;
  const difference = Math.abs(singleStoreOption.totalCost - multipleStoresOption.totalCost);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shopping Options Comparison</DialogTitle>
          <DialogDescription>
            Compare costs between shopping at one store versus multiple stores
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Single Store Option */}
          <Card className={isSingleStoreCheaper ? "border-2 border-primary" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Shop at {singleStoreOption.storeName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      One-stop shopping • Save time
                    </p>
                  </div>
                </div>
                {isSingleStoreCheaper && (
                  <Badge variant="success" className="ml-2">
                    Best Value
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {singleStoreOption.breakdown.map((store, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {store.itemCount} items
                    </span>
                    <span className="font-medium">£{store.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Cost</span>
                <span className="text-2xl font-bold text-primary">
                  £{singleStoreOption.totalCost.toFixed(2)}
                </span>
              </div>

              {!isSingleStoreCheaper && difference > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm text-warning">
                  <TrendingUp className="h-4 w-4" />
                  <span>£{difference.toFixed(2)} more than multiple stores</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Multiple Stores Option */}
          <Card className={!isSingleStoreCheaper ? "border-2 border-primary" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Shop at {multipleStoresOption.storeCount} Stores
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Best prices • More stops
                    </p>
                  </div>
                </div>
                {!isSingleStoreCheaper && (
                  <Badge variant="success" className="ml-2">
                    Lowest Price
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {multipleStoresOption.breakdown.map((store, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {store.storeName} • {store.itemCount} items
                    </span>
                    <span className="font-medium">£{store.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Cost</span>
                <span className="text-2xl font-bold text-primary">
                  £{multipleStoresOption.totalCost.toFixed(2)}
                </span>
              </div>

              {isSingleStoreCheaper && difference > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm text-success">
                  <TrendingDown className="h-4 w-4" />
                  <span>Save £{difference.toFixed(2)} vs single store</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="bg-secondary/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Price Difference</p>
            <p className="text-2xl font-bold">
              £{difference.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isSingleStoreCheaper 
                ? `Shopping at ${singleStoreOption.storeName} saves you money and time`
                : `Shopping at multiple stores saves you £${difference.toFixed(2)}`}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
