'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import type { Event } from '@/app/api/b2c/events';

import 'swiper/css';
import 'swiper/css/navigation';

interface EventProductSwiperProps {
  events: Event[];
}

export function EventProductSwiper({ events }: EventProductSwiperProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">진행중인 이벤트</h2>
          <Link
            href="/events"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            전체보기 →
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          grid={{ rows: 2, fill: 'row' }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="event-product-swiper"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <Link href={`/events/${event.id}`}>
                <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {event.thumbnailUrl ? (
                      <img
                        src={event.thumbnailUrl}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
                        <span className="text-4xl text-white">🎉</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                      진행중
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 font-bold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {event.description}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .event-product-swiper .swiper-button-prev,
          .event-product-swiper .swiper-button-next {
            color: #10b981;
          }
        `}</style>
      </div>
    </div>
  );
}
