import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";
import { PriceAlert } from "@/types/alert";

interface AlertContextType {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, "id" | "user_id" | "is_active" | "notified" | "created_at" | "updated_at">) => Promise<void>;
  removeAlert: (id: string) => Promise<void>;
  toggleAlert: (id: string, isActive: boolean) => Promise<void>;
  checkPriceDrops: (currentPrice: number, alertId: string) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAlerts();
    } else {
      setAlerts([]);
    }
  }, [user]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  };

  const addAlert = async (alert: Omit<PriceAlert, "id" | "user_id" | "is_active" | "notified" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .insert({
          user_id: user.id,
          ...alert,
        })
        .select()
        .single();

      if (error) throw error;

      setAlerts((prev) => [data, ...prev]);
      toast({
        title: "Alert Created",
        description: `You'll be notified when the price drops below $${alert.target_price}`,
      });
    } catch (error) {
      console.error("Error adding alert:", error);
      toast({
        title: "Error",
        description: "Failed to create price alert",
        variant: "destructive",
      });
    }
  };

  const removeAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      toast({
        title: "Alert Deleted",
        description: "Price alert removed successfully",
      });
    } catch (error) {
      console.error("Error removing alert:", error);
      toast({
        title: "Error",
        description: "Failed to remove alert",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, is_active: isActive } : alert
        )
      );
    } catch (error) {
      console.error("Error toggling alert:", error);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
    }
  };

  const checkPriceDrops = async (currentPrice: number, alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert || !alert.is_active) return;

    if (currentPrice <= alert.target_price && !alert.notified) {
      try {
        await supabase
          .from("price_alerts")
          .update({ notified: true, current_price: currentPrice })
          .eq("id", alertId);

        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alertId ? { ...a, notified: true, current_price: currentPrice } : a
          )
        );

        toast({
          title: "🎉 Price Alert!",
          description: `${alert.product_name} at ${alert.store_name} is now $${currentPrice} (Target: $${alert.target_price})`,
          duration: 10000,
        });
      } catch (error) {
        console.error("Error updating alert:", error);
      }
    }
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, toggleAlert, checkPriceDrops }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
};
