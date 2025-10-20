'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Banner {
  id: number;
  image: string;
  title: string;
  link: string;
  type: 'new' | 'event';
}

const BANNERS: Banner[] = [
  {
    id: 1,
    image: '/banner-new-1.jpg',
    title: '신상품 특가 프로모션',
    link: '/products?category=new',
    type: 'new',
  },
  {
    id: 2,
    image: '/banner-event-1.jpg',
    title: '이벤트 진행중',
    link: '/events',
    type: 'event',
  },
];

export function MainBannerSwiper() {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation
        loop={true}
        className="main-banner-swiper"
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Link href={banner.link}>
              <div className="relative h-[300px] w-full bg-gradient-to-r from-emerald-500 to-teal-400 md:h-[400px]">
                <div className="container mx-auto flex h-full items-center px-4">
                  <div className="text-white">
                    <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                      {banner.title}
                    </h2>
                    <p className="mb-6 text-lg md:text-xl">
                      {banner.type === 'new'
                        ? '최신 앨범을 확인해보세요'
                        : '지금 참여하세요'}
                    </p>
                    <span className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-emerald-600 transition-transform hover:scale-105">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .main-banner-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }
        .main-banner-swiper .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
        }
        .main-banner-swiper .swiper-button-prev,
        .main-banner-swiper .swiper-button-next {
          color: white;
        }
      `}</style>
    </div>
  );
}
