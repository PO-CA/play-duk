'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEvents } from '@/hooks/useEvents';

type TabType = 'ONGOING' | 'WINNER_ANNOUNCED' | 'CLOSED';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ONGOING');
  const { data: eventsData, isLoading } = useEvents({
    status: activeTab,
    page: 0,
    size: 12,
  });

  const tabs = [
    { value: 'ONGOING' as TabType, label: '진행중' },
    { value: 'WINNER_ANNOUNCED' as TabType, label: '당첨자 발표' },
    { value: 'CLOSED' as TabType, label: '마감' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">이벤트</h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`border-b-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.value
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event List */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-6">
                <div className="mb-4 aspect-video rounded-lg bg-gray-200" />
                <div className="mb-2 h-6 rounded bg-gray-200" />
                <div className="h-4 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : eventsData && eventsData.data.length > 0 ? (
          <>
            {activeTab === 'WINNER_ANNOUNCED' ? (
              // 당첨자 발표 - 게시판 형태
              <div className="space-y-3">
                {eventsData.data.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {event.thumbnailUrl ? (
                        <img
                          src={event.thumbnailUrl}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-2xl">🎉</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-bold text-gray-900">{event.title}</h3>
                      <p className="mb-2 line-clamp-1 text-sm text-gray-600">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>당첨자 발표</span>
                        {event.winnerAnnouncementDate && (
                          <span>
                            ·{' '}
                            {new Date(event.winnerAnnouncementDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      당첨자 확인
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              // 진행중 / 마감 - 큰 카드 형태
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventsData.data.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-200">
                      {event.thumbnailUrl ? (
                        <img
                          src={event.thumbnailUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
                          <span className="text-6xl">🎉</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                            activeTab === 'ONGOING' ? 'bg-emerald-500' : 'bg-gray-500'
                          }`}
                        >
                          {activeTab === 'ONGOING' ? '진행중' : '마감'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900">
                        {event.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} ~{' '}
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <svg
              className="mx-auto mb-4 h-24 w-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              {activeTab === 'ONGOING'
                ? '진행중인 이벤트가 없습니다'
                : activeTab === 'WINNER_ANNOUNCED'
                  ? '당첨자 발표가 없습니다'
                  : '마감된 이벤트가 없습니다'}
            </h2>
            <p className="text-gray-600">곧 새로운 이벤트를 준비하고 있습니다!</p>
          </div>
        )}
      </div>
    </div>
  );
}
