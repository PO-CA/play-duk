'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';

interface ArtistSwiperProps {
  artists: string[];
}

export function ArtistSwiper({ artists }: ArtistSwiperProps) {
  if (!artists || artists.length === 0) return null;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">인기 아티스트</h2>

        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={3}
          navigation
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
            1280: { slidesPerView: 10 },
          }}
          className="artist-swiper"
        >
          {artists.map((artist, index) => (
            <SwiperSlide key={index}>
              <Link href={`/products?keyword=${encodeURIComponent(artist)}`}>
                <div className="group cursor-pointer">
                  <div className="mb-2 aspect-square overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 transition-transform group-hover:scale-105">
                    <div className="flex h-full items-center justify-center text-2xl font-bold text-white">
                      {artist.charAt(0)}
                    </div>
                  </div>
                  <p className="truncate text-center text-sm font-medium text-gray-900">
                    {artist}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .artist-swiper .swiper-button-prev,
          .artist-swiper .swiper-button-next {
            color: #10b981;
          }
        `}</style>
      </div>
    </div>
  );
}
