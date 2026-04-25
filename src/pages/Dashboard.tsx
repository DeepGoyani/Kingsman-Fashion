import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { formatPrice } from "@/lib/products";
import { format } from "date-fns";

import { API_BASE_URL as API_BASE } from "@/lib/api-config";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("kingsman_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("kingsman_token");
      const res = await axios.get(`${API_BASE}/orders/my-orders`, {
        headers: { "x-auth-token": token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const rentals = orders.flatMap(o => o.items.filter((i: any) => i.type === "RENTAL"));

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />

        <section className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-heading text-4xl text-foreground mb-8">My Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 bg-card p-6 border border-border self-start">
                <h2 className="font-heading text-xl text-foreground mb-4">Profile Info</h2>
                <div className="text-sm text-muted-foreground font-body space-y-2">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="bg-card p-6 border border-border">
                  <h2 className="font-heading text-xl text-foreground mb-4">Active Rentals</h2>
                  {rentals.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-body italic text-center py-8">
                      You have no active rentals.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {rentals.map((rental: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-heading text-sm">{rental.productId?.name || "Premium Attire"}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(rental.startDate), "MMM d, yyyy")} – {format(new Date(rental.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gold/10 text-gold font-medium uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-card p-6 border border-border">
                  <h2 className="font-heading text-xl text-foreground mb-4">Order History</h2>
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-body italic text-center py-8">
                      No past orders found.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-heading text-sm">Order #{order._id.slice(-6)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-body text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
