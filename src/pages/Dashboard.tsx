import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("kingsman_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />

        <section className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl text-foreground mb-8">My Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-1 bg-card p-6 border border-border">
                <h2 className="font-heading text-xl text-foreground mb-4">Profile Info</h2>
                <div className="text-sm text-muted-foreground font-body space-y-2">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="bg-card p-6 border border-border">
                  <h2 className="font-heading text-xl text-foreground mb-4">Active Rentals</h2>
                  <p className="text-sm text-muted-foreground font-body italic text-center py-8">
                    You have no active rentals.
                  </p>
                </div>

                <div className="bg-card p-6 border border-border">
                  <h2 className="font-heading text-xl text-foreground mb-4">Order History</h2>
                  <p className="text-sm text-muted-foreground font-body italic text-center py-8">
                    No past orders found.
                  </p>
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
