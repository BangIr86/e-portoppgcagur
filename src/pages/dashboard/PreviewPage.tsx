import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import { usePortfolio } from '@/contexts/PortfolioContext';
import PageTransition from '@/components/PageTransition';
import ShareDialog from '@/components/ShareDialog';

const PreviewPage = () => {
  const { user } = useAuth();
  const { data, slug } = usePortfolio();
  const publicId = slug || user?.id;

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Preview Portfolio</h1>
            <p className="text-sm text-muted-foreground">Tampilan portfolio publik Anda.</p>
          </div>
          <div className="flex gap-2">
            {user && <ShareDialog userId={user.id} slug={slug} />}
            <Link to={`/portfolio/${publicId}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Buka di Tab Baru
              </Button>
            </Link>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden bg-card -mx-2 sm:mx-0">
          <div className="overflow-x-hidden">
            <PortfolioShowcase data={data} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PreviewPage;
