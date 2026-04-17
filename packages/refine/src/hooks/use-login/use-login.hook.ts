/** @fileoverview useLogin hook. @module @abdokouta/react-refine @category Hooks */
import { useMutation } from '@tanstack/react-query';
import type { IAuthService } from '@/interfaces/i-auth-service.interface';
import type { AuthActionResponse } from '@/interfaces/auth-action-response.interface';
import type { UseMutationHookResult } from '@/interfaces/use-mutation-hook-result.interface';

let _authService: IAuthService | undefined;
/** @internal Set the auth service reference (called by forRoot). */
export function setAuthService(svc: IAuthService) {
  _authService = svc;
}

export function useLogin(): UseMutationHookResult<AuthActionResponse, Error, any> {
  const mutation = useMutation({
    mutationFn: (params: any) => {
      if (!_authService)
        throw new Error('No AuthService configured. Pass authService to RefineModule.forRoot().');
      return _authService.login(params);
    },
  });
  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync as any,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    isIdle: mutation.isIdle,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
    mutation,
  };
}
