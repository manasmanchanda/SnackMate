import { Layout } from '@/components/Layout';
import { EmptyState } from '@/components/ui';
import { useRoute } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { FinderPage } from '@/pages/FinderPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { ComparePage } from '@/pages/ComparePage';
import { LabelHelperPage } from '@/pages/LabelHelperPage';
import { AddProductPage } from '@/pages/AddProductPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { PassportPage } from '@/pages/PassportPage';
import { PicnicPlannerPage } from '@/pages/PicnicPlannerPage';
import { ProfilePage } from '@/pages/ProfilePage';

function renderPage(segments: string[]) {
  const [first, second] = segments;
  switch (first) {
    case undefined:
      return <HomePage />;
    case 'finder':
      return <FinderPage />;
    case 'explore':
      return <ExplorePage />;
    case 'compare':
      return <ComparePage />;
    case 'label-helper':
      return <LabelHelperPage />;
    case 'add-product':
      return <AddProductPage />;
    case 'product':
      return second ? <ProductDetailPage productId={second} /> : null;
    case 'passport':
      return <PassportPage />;
    case 'picnic':
      return <PicnicPlannerPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <EmptyState title="Page not found" description="This page does not exist. Use the menu to find what you need." action={<a href="#/" className="btn-primary">Back to home</a>} />
        </div>
      );
  }
}

function App() {
  const { segments } = useRoute();
  return <Layout>{renderPage(segments)}</Layout>;
}

export default App;
