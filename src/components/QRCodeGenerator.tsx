import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, Download, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  onClose: () => void;
  merchantData: {
    businessName: string;
    phone: string;
  };
}

const QRCodeGenerator = ({ onClose, merchantData }: QRCodeGeneratorProps) => {
  const [amount, setAmount] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create payment data - in a real app, this would be a payment URL or UPI string
      const paymentData = {
        merchantName: merchantData.businessName,
        amount: parseFloat(amount),
        currency: 'INR',
        phone: merchantData.phone,
        timestamp: new Date().toISOString(),
        // In real implementation, this would be a UPI payment string like:
        // upi://pay?pa=merchant@upi&pn=MerchantName&am=100&cu=INR
        paymentUrl: `upi://pay?pa=${merchantData.phone}@paytm&pn=${encodeURIComponent(merchantData.businessName)}&am=${amount}&cu=INR&tn=Payment`
      };

      // Generate QR code
      const qrUrl = await QRCode.toDataURL(JSON.stringify(paymentData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e40af', // Primary blue
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });

      setQrCodeUrl(qrUrl);
      
      toast({
        title: "QR Code Generated",
        description: `Payment QR for ₹${amount} created successfully`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `payment-qr-${amount}-rupees.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "QR code saved to your device",
    });
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(value));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gradient-card shadow-neon border border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-neon border border-primary/30">
              <QrCode className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Generate QR Code</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gradient-cyber">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg h-12 bg-gradient-cyber border-accent/30 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:shadow-neon transition-glow"
                min="1"
                step="0.01"
              />
            </div>
            {amount && (
              <p className="text-sm text-muted-foreground">
                Amount: {formatCurrency(amount)}
              </p>
            )}
          </div>

          <Button 
            variant="fintech" 
            size="lg"
            onClick={generateQRCode}
            disabled={isGenerating || !amount}
            className="w-full"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              'Generate QR Code'
            )}
          </Button>

          {qrCodeUrl && (
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-border/50 text-center shadow-neon">
                <img 
                  src={qrCodeUrl} 
                  alt="Payment QR Code" 
                  className="mx-auto mb-4 rounded-lg border border-primary/20"
                />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{merchantData.businessName}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">{formatCurrency(amount)}</p>
                  <p className="text-sm text-muted-foreground">Scan to pay</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setQrCodeUrl('');
                    setAmount('');
                  }}
                  className="flex-1"
                >
                  Generate New
                </Button>
                <Button 
                  variant="success" 
                  onClick={downloadQRCode}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;