import { useMemo } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';

export type PageType = 'brand' | 'category' | 'search' | 'all';

interface UsePageTypeReturn {
  pageType: PageType;
  name: string;
  slug: string | undefined;
  searchQuery: string;
  pageTitle: string;
  breadcrumbLabel: string;
}

export function usePageType(): UsePageTypeReturn {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';

  const pageType = useMemo<PageType>(() => {
    if (location.pathname.startsWith('/brand/')) return 'brand';
    if (location.pathname.startsWith('/category/')) return 'category';
    if (location.pathname.startsWith('/search')) return 'search';
    return 'all';
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    switch (pageType) {
      case 'brand':
        return `Sản phẩm thương hiệu`;
      case 'category':
        return `Danh mục sản phẩm`;
      case 'search':
        return `Kết quả tìm kiếm: "${searchQuery}"`;
      default:
        return 'Tất cả sản phẩm';
    }
  }, [pageType, searchQuery]);

  const breadcrumbLabel = useMemo(() => {
    switch (pageType) {
      case 'brand':
        return 'Thương hiệu';
      case 'category':
        return 'Danh mục';
      case 'search':
        return `Tìm kiếm: "${searchQuery}"`;
      default:
        return '';
    }
  }, [pageType, searchQuery]);

  return {
    pageType,
    name: slug || '',
    slug: slug,
    searchQuery,
    pageTitle,
    breadcrumbLabel,
  };
}