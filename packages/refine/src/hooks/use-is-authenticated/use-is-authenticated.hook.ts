/** @fileoverview useIsAuthenticated hook. @module @abdokouta/react-refine @category Hooks */
import { useQuery } from '@tanstack/react-query';
import type { IAuthService } from '@/interfaces/i-auth-service.interface';
import type { CheckResponse } from '@/interfaces/check-response.interface';
import type { UseQueryHookResult } from '@/interfaces/use-query-hook-result.interface';

let _authService: IAuthService | undefined;
export function setIsAuthenticatedService(svc: IAuthService) {
  _authService = svc;
}

export function useIsAuthenticated(): UseQueryHookResult<CheckResponse, Error> {
  const query = useQuery({
    queryKey: ['auth', 'check'],
    queryFn: () => {
      if (!_authService)
        throw new Error('No AuthService configured. Pass authService to RefineModule.forRoot().');
      return _authService.check();
    },
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
    query,
  };
}
