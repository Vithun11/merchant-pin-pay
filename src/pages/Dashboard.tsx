import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QrCode, User, LogOut, Plus, DollarSign, Home, Clock, History } from "lucide-react";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { formatMerchantId } from "@/utils/generateId";

interface MerchantData {
  id: string;
  businessName: string;
  email: string;
  countryCode: string;
  phone: string;
  pin: string;
  currency: string;
  balance: number;
  isLoggedIn: boolean;
  transactions?: Array<{
    id: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
    description: string;
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

  const formatCurrency = (amount: number, currencyCode: string = 'INR') => {
    const currencyMap: { [key: string]: { locale: string; currency: string; symbol: string } } = {
      'INR': { locale: 'en-IN', currency: 'INR', symbol: '₹' },
      'USD': { locale: 'en-US', currency: 'USD', symbol: '$' },
      'EUR': { locale: 'en-EU', currency: 'EUR', symbol: '€' },
      'GBP': { locale: 'en-GB', currency: 'GBP', symbol: '£' },
      'JPY': { locale: 'en-JP', currency: 'JPY', symbol: '¥' },
      'AUD': { locale: 'en-AU', currency: 'AUD', symbol: 'A$' },
      'CAD': { locale: 'en-CA', currency: 'CAD', symbol: 'C$' },
      'SGD': { locale: 'en-SG', currency: 'SGD', symbol: 'S$' },
      'AED': { locale: 'en-AE', currency: 'AED', symbol: 'د.إ' },
    };

    const config = currencyMap[currencyCode] || currencyMap['INR'];
    
    try {
      return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${config.symbol}${amount.toLocaleString()}`;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleViewTransactions = () => {
    toast({
      title: "Transaction History",
      description: "This feature will be available soon",
    });
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4" />
            </Button>
            <div className="bg-gradient-primary p-2 rounded-lg shadow-primary">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                {getGreeting()}, {merchantData.businessName}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Profile Info Card */}
        <Card className="mb-6 bg-gradient-card shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{merchantData.businessName}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>ID: {formatMerchantId(merchantData.id)}</p>
                  <p>Phone: {merchantData.countryCode} {merchantData.phone}</p>
                  <p>Email: {merchantData.email}</p>
                  <p>Currency: {merchantData.currency}</p>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <User className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-primary text-primary-foreground shadow-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Current Balance</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(merchantData.balance, merchantData.currency)}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

          <Card className="bg-gradient-card hover:shadow-soft transition-all duration-300 cursor-pointer"
                onClick={handleViewTransactions}>
            <CardContent className="p-6 text-center">
              <div className="bg-success/10 p-4 rounded-full w-fit mx-auto mb-4">
                <History className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Transaction History</h3>
              <p className="text-sm text-muted-foreground">View all transactions</p>
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <span>Recent Transactions</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleViewTransactions}>
                <History className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {merchantData.transactions && merchantData.transactions.length > 0 ? (
              <div className="space-y-4">
                {merchantData.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'
                      }`}>
                        <DollarSign className={`w-4 h-4 ${
                          transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.description || `Payment ${transaction.type === 'credit' ? 'Received' : 'Sent'}`}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount, merchantData.currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-muted/50 p-4 rounded-full w-fit mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No transactions yet</p>
                <p className="text-sm text-muted-foreground">Your recent payments will appear here</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setShowQRGenerator(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First QR Code
                </Button>
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