import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-primary">
              <QrCode className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            MerchantPay
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Accept payments instantly with QR codes. Secure, fast, and reliable payment solution for your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-soft transition-all duration-300">
            <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Instant QR Payments</h3>
            <p className="text-sm text-muted-foreground">
              Generate QR codes for any amount and receive payments instantly
            </p>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-soft transition-all duration-300">
            <div className="bg-success/10 p-3 rounded-lg w-fit mb-4">
              <User className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Secure Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Track your earnings and manage your business with PIN protection
            </p>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-soft transition-all duration-300">
            <div className="bg-primary-glow/10 p-3 rounded-lg w-fit mb-4">
              <QrCode className="w-6 h-6 text-primary-glow" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Get instant notifications when payments are received
            </p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button 
            variant="fintech" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => navigate('/register')}
          >
            Create Account
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Trusted by thousands of merchants nationwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;