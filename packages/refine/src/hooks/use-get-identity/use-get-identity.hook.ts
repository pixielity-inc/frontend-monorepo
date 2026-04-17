/** @fileoverview useGetIdentity hook. @module @abdokouta/react-refine @category Hooks */
import { useQuery } from '@tanstack/react-query';
import type { IAuthService } from '@/interfaces/i-auth-service.interface';
import type { UseQueryHookResult } from '@/interfaces/use-query-hook-result.interface';

let _authService: IAuthService | undefined;
export function setGetIdentityService(svc: IAuthService) {
  _authService = svc;
}

export function useGetIdentity<TData = any>(): UseQueryHookResult<TData, Error> {
  const query = useQuery({
    queryKey: ['auth', 'identity'],
    queryFn: () => {
      if (!_authService)
        throw new Error('No AuthService configured. Pass authService to RefineModule.forRoot().');
      return _authService.getIdentity();
    },
  });
  return {
    data: query.data as TData | undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
    query,
  };
}
