import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/services/events';

export function useEvents(params?: {
  status?: 'ONGOING' | 'WINNER_ANNOUNCED' | 'CLOSED';
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useOngoingEvents() {
  return useQuery({
    queryKey: ['events', 'ongoing'],
    queryFn: eventsApi.getOngoingEvents,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useEvent(eventId: number) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getEvent(eventId),
    enabled: !!eventId,
  });
}

export function useEventWinners(eventId: number) {
  return useQuery({
    queryKey: ['event', eventId, 'winners'],
    queryFn: () => eventsApi.getEventWinners(eventId),
    enabled: !!eventId,
  });
}
