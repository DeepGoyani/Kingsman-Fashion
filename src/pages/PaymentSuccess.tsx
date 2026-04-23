import PageTransition from "@/components/PageTransition";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-6 px-6">
            <CheckCircle className="w-16 h-16 text-gold mx-auto" />
            <h1 className="font-heading text-4xl md:text-5xl text-foreground">
              Order Confirmed
            </h1>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              Thank you for your order. You will receive a confirmation email shortly with your order details.
            </p>
            <Link
              to="/"
              className="inline-block py-3 px-8 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-foreground transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentSuccess;
