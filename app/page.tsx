'use client';

import { useQuery } from '@tanstack/react-query';
import { MainBannerSwiper } from '@/app/components/home/main-banner-swiper';
import { ArtistSwiper } from '@/app/components/home/artist-swiper';
import { EventProductSwiper } from '@/app/components/home/event-product-swiper';
import { SimpleBanner } from '@/app/components/home/simple-banner';
import { ProductSection } from '@/app/components/home/product-section';
import { productsApi } from '@/app/api/b2c/products';
import { eventsApi } from '@/app/api/b2c/events';

export default function HomePage() {
  // 데이터 fetch
  const { data: bestProducts } = useQuery({
    queryKey: ['products', 'best', 12],
    queryFn: () => productsApi.getBestProducts(12),
  });

  const { data: newProducts } = useQuery({
    queryKey: ['products', 'new', 12],
    queryFn: () => productsApi.getNewProducts(12),
  });

  const { data: artists } = useQuery({
    queryKey: ['products', 'artists'],
    queryFn: productsApi.getArtists,
  });

  const { data: ongoingEvents } = useQuery({
    queryKey: ['events', 'ongoing'],
    queryFn: eventsApi.getOngoingEvents,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. 메인 배너 스와이퍼 */}
      <MainBannerSwiper />

      {/* 2. 아티스트 목록 스와이퍼 */}
      {artists && <ArtistSwiper artists={artists} />}

      {/* 3. 이벤트 음반 목록 스와이퍼 */}
      {ongoingEvents && <EventProductSwiper events={ongoingEvents} />}

      {/* 4. 간단한 배너 */}
      <SimpleBanner />

      {/* 5. Best 상품 섹션 */}
      {bestProducts && (
        <ProductSection
          title="BEST"
          subtitle="지금 가장 인기있는 앨범"
          products={bestProducts}
          viewAllLink="/products?category=best"
        />
      )}

      {/* 6. 신상 상품 섹션 */}
      <div className="bg-white">
        {newProducts && (
          <ProductSection
            title="NEW"
            subtitle="최신 발매 앨범"
            products={newProducts}
            viewAllLink="/products?category=new"
          />
        )}
      </div>
    </div>
  );
}
