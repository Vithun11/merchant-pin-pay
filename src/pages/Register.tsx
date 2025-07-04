import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Check, Clock, Phone, Mail, Home } from "lucide-react";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { NumberPad } from "@/components/ui/number-pad";
import { CountrySelector } from "@/components/ui/country-selector";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { generateUniqueId } from "@/utils/generateId";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    emailVerified: false,
    countryCode: '+91',
    phone: '',
    mobileVerified: false,
    otp: '',
    pin: '',
    confirmPin: '',
    currency: 'INR'
  });
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [currentPinField, setCurrentPinField] = useState<'pin' | 'confirmPin'>('pin');
  const navigate = useNavigate();
  const { toast } = useToast();

  const stepLabels = ["Business Info", "Email Verify", "Mobile Verify", "Set PIN", "Complete"];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleNext = () => {
    if (step === 1) {
      // Business Info & Email step
      if (!formData.businessName.trim() || !formData.email.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      // Simulate email verification
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for verification link",
      });
      setStep(2);
    } else if (step === 2) {
      // Email verification step
      if (!formData.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email first",
          variant: "destructive"
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Mobile verification step
      if (!formData.phone.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
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
      setStep(4);
    } else if (step === 4) {
      // OTP verification step
      if (formData.otp.length !== 6) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit OTP",
          variant: "destructive"
        });
        return;
      }
      setFormData({...formData, mobileVerified: true});
      setStep(5);
    } else if (step === 5) {
      // PIN setup step
      if (formData.pin.length !== 6 || formData.pin !== formData.confirmPin) {
        toast({
          title: "PIN Error",
          description: "PIN must be 6 digits and both entries must match",
          variant: "destructive"
        });
        return;
      }
      // Create account
      const uniqueId = generateUniqueId();
      localStorage.setItem('merchantData', JSON.stringify({
        id: uniqueId,
        businessName: formData.businessName,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        pin: formData.pin,
        currency: formData.currency,
        balance: 0,
        isLoggedIn: true,
        transactions: []
      }));
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
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
    if (currentPinField === 'pin' && formData.pin.length < 6) {
      setFormData({...formData, pin: formData.pin + number});
    } else if (currentPinField === 'confirmPin' && formData.confirmPin.length < 6) {
      setFormData({...formData, confirmPin: formData.confirmPin + number});
    }
  };

  const handleBackspace = () => {
    if (currentPinField === 'pin') {
      setFormData({...formData, pin: formData.pin.slice(0, -1)});
    } else {
      setFormData({...formData, confirmPin: formData.confirmPin.slice(0, -1)});
    }
  };

  const handleClear = () => {
    if (currentPinField === 'pin') {
      setFormData({...formData, pin: ''});
    } else {
      setFormData({...formData, confirmPin: ''});
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card shadow-soft">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-success p-4 rounded-full">
                <Check className="w-8 h-8 text-success-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-success">Account Created!</h2>
              <p className="text-muted-foreground">
                Welcome to MerchantPay, {formData.businessName}!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <ProgressSteps 
          currentStep={step} 
          totalSteps={5} 
          stepLabels={stepLabels} 
        />
        
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4" />
              </Button>
              <div className="bg-gradient-primary p-3 rounded-xl shadow-primary">
                {step <= 2 && <Mail className="w-6 h-6 text-primary-foreground" />}
                {step === 3 || step === 4 ? <Phone className="w-6 h-6 text-primary-foreground" /> : null}
                {step === 5 && <QrCode className="w-6 h-6 text-primary-foreground" />}
              </div>
              <div></div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === 1 && "Business Details"}
              {step === 2 && "Verify Email"}
              {step === 3 && "Phone Number"}
              {step === 4 && "Verify Mobile"}
              {step === 5 && "Set PIN"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Currency</Label>
                  <CurrencySelector 
                    value={formData.currency}
                    onValueChange={(value) => setFormData({...formData, currency: value})}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-center">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent a verification link to:<br />
                    <strong>{formData.email}</strong>
                  </p>
                </div>
                <Button 
                  variant={formData.emailVerified ? "success" : "outline"}
                  onClick={() => {
                    setFormData({...formData, emailVerified: true});
                    toast({
                      title: "Email Verified",
                      description: "Email verification successful!",
                    });
                  }}
                  className="w-full"
                >
                  {formData.emailVerified ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Email Verified
                    </>
                  ) : (
                    "Click to Verify Email"
                  )}
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Country Code</Label>
                  <CountrySelector 
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({...formData, countryCode: value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
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

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Create a 6-digit PIN to secure your account
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Create PIN</Label>
                    <Input
                      type="password"
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest h-14"
                      value={formData.pin}
                      onChange={(e) => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                      onFocus={() => setCurrentPinField('pin')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm PIN</Label>
                    <Input
                      type="password"
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest h-14"
                      value={formData.confirmPin}
                      onChange={(e) => setFormData({...formData, confirmPin: e.target.value.replace(/\D/g, '')})}
                      onFocus={() => setCurrentPinField('confirmPin')}
                    />
                  </div>
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
                    currentValue={currentPinField === 'pin' ? formData.pin : formData.confirmPin}
                  />
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
              >
                {step === 1 ? 'Home' : 'Previous'}
              </Button>
              <Button 
                variant="fintech" 
                onClick={handleNext}
                className="flex-1"
                disabled={step === 2 && !formData.emailVerified}
              >
                {step === 5 ? 'Create Account' : 'Continue'}
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

export default Register;