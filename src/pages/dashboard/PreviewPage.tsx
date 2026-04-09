import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import { usePortfolio } from '@/contexts/PortfolioContext';

const PreviewPage = () => {
  const { user } = useAuth();
  const { data } = usePortfolio();

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Preview Portfolio</h1>
          <p className="text-muted-foreground">Tampilan portfolio publik Anda.</p>
        </div>
        <Link to={`/portfolio/${user?.id}`} target="_blank">
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Buka di Tab Baru
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden bg-card">
        <PortfolioShowcase data={data} />
      </div>
    </div>
  );
};

export default PreviewPage;
