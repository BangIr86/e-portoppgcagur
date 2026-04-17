import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  userId: string;
  slug?: string | null;
}

const ShareDialog = ({ userId, slug }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const portfolioUrl = `${window.location.origin}/portfolio/${slug || userId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast.success('Link berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, 512, 512);
      ctx!.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement('a');
      a.download = 'portfolio-qrcode.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bagikan Portfolio</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Copy Link */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Link portfolio publik Anda:</p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={portfolioUrl}
                className="text-sm"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Scan QR Code untuk membuka portfolio:</p>
            <div className="p-4 bg-white rounded-xl border shadow-sm">
              <QRCodeSVG
                id="qr-code-svg"
                value={portfolioUrl}
                size={200}
                level="H"
                includeMargin={false}
                fgColor="hsl(215, 80%, 35%)"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadQR} className="gap-2">
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
