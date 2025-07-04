import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QrCode, LogIn, Phone, Clock, Home } from "lucide-react";
import { CountrySelector } from "@/components/ui/country-selector";
import { NumberPad } from "@/components/ui/number-pad";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Login = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: PIN
  const [formData, setFormData] = useState({
    countryCode: '+91',
    phone: '',
    otp: '',
    pin: ''
  });
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleNext = async () => {
    if (step === 1) {
      // Phone number step
      if (!formData.phone.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
          variant: "destructive"
        });
        return;
      }

      // Check if merchant exists
      const merchantData = JSON.parse(localStorage.getItem('merchantData') || '{}');
      if (!merchantData.phone || merchantData.phone !== formData.phone) {
        toast({
          title: "Account Not Found",
          description: "No account found with this phone number",
          variant: "destructive"
        });
        return;
      }

      // Send OTP
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.countryCode} ${formData.phone}`,
      });
      setResendTimer(30);
      setStep(2);
    } else if (step === 2) {
      // OTP verification step
      if (formData.otp.length !== 6) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit OTP",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Mobile Verified",
        description: "Phone number verified successfully",
      });
      setStep(3);
    } else if (step === 3) {
      // PIN verification step
      if (formData.pin.length !== 6) {
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
        
        if (merchantData.pin === formData.pin && merchantData.phone === formData.phone) {
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
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${formData.countryCode} ${formData.phone}`,
    });
    setResendTimer(30);
    setShowResendDialog(false);
  };

  const handleNumberPress = (number: string) => {
    if (step === 3 && formData.pin.length < 6) {
      setFormData({...formData, pin: formData.pin + number});
    }
  };

  const handleBackspace = () => {
    if (step === 3) {
      setFormData({...formData, pin: formData.pin.slice(0, -1)});
    }
  };

  const handleClear = () => {
    if (step === 3) {
      setFormData({...formData, pin: ''});
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-soft">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4" />
            </Button>
            <div className="bg-gradient-primary p-3 rounded-xl shadow-primary">
              {step === 1 || step === 2 ? <Phone className="w-6 h-6 text-primary-foreground" /> : <LogIn className="w-6 h-6 text-primary-foreground" />}
            </div>
            <div></div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Enter Phone Number"}
            {step === 2 && "Verify Mobile"}
            {step === 3 && "Enter PIN"}
          </CardTitle>
          {step === 1 && <p className="text-muted-foreground">Sign in to your MerchantPay account</p>}
          {step === 2 && <p className="text-muted-foreground">Enter the verification code</p>}
          {step === 3 && <p className="text-muted-foreground">Enter your 6-digit PIN</p>}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Country Code</Label>
                <CountrySelector 
                  value={formData.countryCode}
                  onValueChange={(value) => setFormData({...formData, countryCode: value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Enter the 6-digit code sent to:<br />
                <strong>{formData.countryCode} {formData.phone}</strong>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest h-14"
                  value={formData.otp}
                  onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowResendDialog(true)}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0 ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Resend in {resendTimer}s
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Enter PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest h-14"
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNumberPad(!showNumberPad)}
                >
                  {showNumberPad ? "Hide" : "Show"} Number Pad
                </Button>
              </div>
              
              {showNumberPad && (
                <NumberPad
                  onNumberPress={handleNumberPress}
                  onBackspace={handleBackspace}
                  onClear={handleClear}
                  maxLength={6}
                  currentValue={formData.pin}
                />
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex-1"
              disabled={isLoading}
            >
              {step === 1 ? 'Home' : 'Previous'}
            </Button>
            <Button 
              variant="fintech" 
              size="lg"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                step === 3 ? 'Sign In' : 'Continue'
              )}
            </Button>
          </div>

          {step === 1 && (
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
          )}
        </CardContent>
      </Card>

      {/* Resend OTP Dialog */}
      <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend OTP</DialogTitle>
            <DialogDescription>
              Do you want to resend the verification code to {formData.countryCode} {formData.phone}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowResendDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleResendOtp} className="flex-1">
              Resend OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;