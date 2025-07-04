import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QrCode, User, LogOut, Plus, DollarSign } from "lucide-react";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface MerchantData {
  businessName: string;
  phone: string;
  pin: string;
  balance: number;
  isLoggedIn: boolean;
  transactions?: Array<{
    id: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
  }>;
}

const Dashboard = () => {
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorage.getItem('merchantData');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.isLoggedIn) {
        setMerchantData(parsed);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (merchantData) {
      localStorage.setItem('merchantData', JSON.stringify({
        ...merchantData,
        isLoggedIn: false
      }));
    }
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!merchantData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-primary">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {merchantData.businessName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-primary text-primary-foreground shadow-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Current Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(merchantData.balance)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-card hover:shadow-soft transition-all duration-300 cursor-pointer" 
                onClick={() => setShowQRGenerator(true)}>
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Create QR Code</h3>
              <p className="text-sm text-muted-foreground">Generate QR for payments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-soft transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-success/10 p-4 rounded-full w-fit mx-auto mb-4">
                <User className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {merchantData.transactions && merchantData.transactions.length > 0 ? (
              <div className="space-y-4">
                {merchantData.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Payment {transaction.type === 'credit' ? 'Received' : 'Sent'}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-muted/50 p-4 rounded-full w-fit mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">Your recent payments will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Generator Modal */}
        {showQRGenerator && (
          <QRCodeGenerator 
            onClose={() => setShowQRGenerator(false)}
            merchantData={merchantData}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;