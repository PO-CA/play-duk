import { api } from '@/lib/axios';

export interface Event {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  bannerImageUrl: string;
  detailContent: string;
  startDate: string;
  endDate: string;
  winnerAnnouncementDate?: string;
  status: 'ONGOING' | 'WINNER_ANNOUNCED' | 'CLOSED';
  targetProductIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface EventWinner {
  id: number;
  eventId: number;
  eventTitle: string;
  userId: number;
  userName: string;
  userEmail: string;
  orderId?: number;
  orderNumber?: string;
  winnerMessage: string;
  createdAt: string;
}

export interface EventsResponse {
  data: Event[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const eventsApi = {
  /**
   * 이벤트 목록 조회
   */
  getEvents: async (params?: {
    status?: 'ONGOING' | 'WINNER_ANNOUNCED' | 'CLOSED';
    page?: number;
    size?: number;
  }) => {
    const response = await api.get('/events', { params });
    return response.data as EventsResponse;
  },

  /**
   * 진행중인 이벤트 조회
   */
  getOngoingEvents: async () => {
    const response = await api.get('/events/ongoing');
    return response.data.data as Event[];
  },

  /**
   * 이벤트 상세 조회
   */
  getEvent: async (eventId: number) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data.data as Event;
  },

  /**
   * 이벤트 당첨자 조회
   */
  getEventWinners: async (eventId: number) => {
    const response = await api.get(`/events/${eventId}/winners`);
    return response.data.data as EventWinner[];
  },
};
