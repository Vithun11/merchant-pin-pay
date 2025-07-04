import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QrCode, LogIn } from "lucide-react";

const Login = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (pin.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 6-digit PIN",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const merchantData = JSON.parse(localStorage.getItem('merchantData') || '{}');
      
      if (merchantData.pin === pin) {
        localStorage.setItem('merchantData', JSON.stringify({
          ...merchantData,
          isLoggedIn: true
        }));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${merchantData.businessName}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Invalid PIN",
          description: "Please check your PIN and try again",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-soft">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-primary">
              <LogIn className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-muted-foreground">Enter your PIN to access your account</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pin">Enter PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-widest h-14"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <Button 
            variant="fintech" 
            size="lg"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-primary hover:underline font-medium"
              >
                Create one
              </button>
            </span>
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;