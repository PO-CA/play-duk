'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEvent, useEventWinners } from '@/hooks/useEvents';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);

  const { data: event, isLoading } = useEvent(eventId);
  const { data: winners } = useEventWinners(eventId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            이벤트를 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.back()}
            className="text-emerald-600 hover:text-emerald-700"
          >
            ← 뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const isOngoing = event.status === 'ONGOING';
  const hasWinners = event.status === 'WINNER_ANNOUNCED' && winners && winners.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          ← 뒤로
        </button>

        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          {/* Banner Image */}
          {event.bannerImageUrl && (
            <div className="relative aspect-[3/1] overflow-hidden bg-gray-200">
              <img
                src={event.bannerImageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Status Badge */}
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`rounded-full px-4 py-1 text-sm font-bold text-white ${
                  isOngoing
                    ? 'bg-emerald-500'
                    : event.status === 'WINNER_ANNOUNCED'
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
                }`}
              >
                {isOngoing
                  ? '진행중'
                  : event.status === 'WINNER_ANNOUNCED'
                    ? '당첨자 발표'
                    : '마감'}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="mb-6 text-gray-600">{event.description}</p>

            {/* Event Period */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <strong>이벤트 기간:</strong>
                <span>
                  {new Date(event.startDate).toLocaleDateString()} ~{' '}
                  {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>
              {event.winnerAnnouncementDate && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <strong>당첨자 발표:</strong>
                  <span>
                    {new Date(event.winnerAnnouncementDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Detail Content */}
            {event.detailContent && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: event.detailContent }}
              />
            )}

            {/* Winners List */}
            {hasWinners && (
              <div className="mt-8 border-t pt-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">당첨자 명단</h2>
                <div className="space-y-3">
                  {winners.map((winner, index) => (
                    <div
                      key={winner.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{winner.userName}</p>
                        <p className="text-sm text-gray-600">
                          {winner.userEmail.replace(/(.{3}).*(@.*)/, '$1***$2')}
                        </p>
                      </div>
                      {winner.winnerMessage && (
                        <p className="text-sm text-gray-600">{winner.winnerMessage}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            {isOngoing && (
              <div className="mt-8 rounded-lg bg-emerald-50 p-6 text-center">
                <p className="mb-4 text-lg font-medium text-gray-900">
                  이벤트 상품을 구매하시면 자동으로 응모됩니다!
                </p>
                <Link
                  href="/products"
                  className="inline-block rounded-lg bg-emerald-500 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  상품 보러가기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
