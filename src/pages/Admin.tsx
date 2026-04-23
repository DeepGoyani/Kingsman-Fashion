import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("kingsman_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") {
        setIsAdmin(true);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen bg-background" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />

        <section className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-heading text-4xl text-foreground mb-8 text-gold">Admin Portal</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 border border-border">
                <h2 className="font-heading text-2xl text-foreground mb-6">Manage Products (Coming Soon)</h2>
                <button className="px-6 py-2 bg-foreground text-background font-body text-xs uppercase tracking-widest hover:bg-gold transition-colors">
                  + Add New Product
                </button>
                <div className="mt-8">
                  <p className="text-sm font-body text-muted-foreground italic">No products loaded from the database yet.</p>
                </div>
              </div>

              <div className="bg-card p-6 border border-border">
                <h2 className="font-heading text-2xl text-foreground mb-6">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-sm text-foreground">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-2 font-medium tracking-wide uppercase text-xs text-muted-foreground">Order ID</th>
                        <th className="py-3 px-2 font-medium tracking-wide uppercase text-xs text-muted-foreground">Status</th>
                        <th className="py-3 px-2 font-medium tracking-wide uppercase text-xs text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-muted-foreground italic">
                          No orders to display.
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

export default Admin;
