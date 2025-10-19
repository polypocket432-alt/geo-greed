import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";

export function LocationButton() {
  const { userLocation, isLoadingLocation, locationError, getCurrentLocation } = useLocation();
  const { toast } = useToast();

  const handleGetLocation = () => {
    getCurrentLocation();
    if (locationError) {
      toast({
        title: "Location Error",
        description: locationError,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={userLocation ? "default" : "outline"}
      size="sm"
      onClick={handleGetLocation}
      disabled={isLoadingLocation}
      className="gap-2"
    >
      {isLoadingLocation ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      {userLocation ? "Location Set" : "Use My Location"}
    </Button>
  );
}
