import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QrCode } from "lucide-react";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    otp: '',
    pin: '',
    confirmPin: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1) {
      if (!formData.businessName.trim() || !formData.phone.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      // Simulate OTP sending
      toast({
        title: "OTP Sent",
        description: "Verification code sent to your phone number",
      });
      setStep(2);
    } else if (step === 2) {
      if (formData.otp.length !== 6) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit OTP",
          variant: "destructive"
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (formData.pin.length !== 6 || formData.pin !== formData.confirmPin) {
        toast({
          title: "PIN Error",
          description: "PIN must be 6 digits and both entries must match",
          variant: "destructive"
        });
        return;
      }
      // Simulate account creation
      localStorage.setItem('merchantData', JSON.stringify({
        businessName: formData.businessName,
        phone: formData.phone,
        pin: formData.pin,
        balance: 0,
        isLoggedIn: true
      }));
      toast({
        title: "Account Created",
        description: "Welcome to MerchantPay!",
      });
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-soft">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-primary">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Create Account"}
            {step === 2 && "Verify Phone"}
            {step === 3 && "Set PIN"}
          </CardTitle>
          <div className="flex space-x-2 justify-center">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step >= num ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Enter the 6-digit code sent to {formData.phone}
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  value={formData.otp}
                  onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Create a 6-digit PIN to secure your account
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">Create PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirm PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({...formData, confirmPin: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex-1"
            >
              {step === 1 ? 'Back' : 'Previous'}
            </Button>
            <Button 
              variant="fintech" 
              onClick={handleNext}
              className="flex-1"
            >
              {step === 3 ? 'Create Account' : 'Continue'}
            </Button>
          </div>

          {step === 1 && (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;