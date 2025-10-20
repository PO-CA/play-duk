import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressesApi, type CreateAddressRequest } from '@/services/addresses';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/axios';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.getAddresses,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useAddress(addressId: number) {
  return useQuery({
    queryKey: ['address', addressId],
    queryFn: () => addressesApi.getAddress(addressId),
    enabled: !!addressId,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => addressesApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('배송지가 추가되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: number;
      data: CreateAddressRequest;
    }) => addressesApi.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('배송지가 수정되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => addressesApi.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('배송지가 삭제되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => addressesApi.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('기본 배송지로 설정되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
