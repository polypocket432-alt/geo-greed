import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Minus, Plus, Trash2, Store, AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function CartView() {
  const { updateQuantity, removeFromCart, clearCart, getTotalPrice, getOptimizedStoreGroups } = useCart();
  const { groups: storeGroups, recommendation, potentialSavings } = getOptimizedStoreGroups();

  if (storeGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground">
          Add items from stores to create your shopping list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {recommendation && (
        <Alert className={storeGroups.some(g => !g.recommended) ? "border-primary" : ""}>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Shopping Recommendation</AlertTitle>
          <AlertDescription>{recommendation}</AlertDescription>
        </Alert>
      )}

      {storeGroups.map((group) => (
        <Card 
          key={group.storeId} 
          className={`bg-gradient-card ${group.recommended ? 'border-2 border-primary' : 'opacity-60'}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{group.storeName}</CardTitle>
                  {group.recommended && (
                    <Badge variant="success" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                  {!group.recommended && group.items.length < 5 && (
                    <Badge variant="outline" className="text-xs">
                      {group.items.length} items only
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{group.distance} km away</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{group.address}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  ${group.total.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {item.product.brand && `${item.product.brand} `}
                    {item.product.name}
                    {item.product.size && ` (${item.product.size})`}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    ${item.store.price.toFixed(2)} each
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={clearCart}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
