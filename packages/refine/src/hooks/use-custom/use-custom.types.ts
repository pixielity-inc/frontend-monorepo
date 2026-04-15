import type { QueryObserverResult } from '@tanstack/react-query';
import type {
  BaseRecord,
  HttpError,
  CustomResponse,
  UseCustomProps as UseCustomPropsOriginal,
} from '@refinedev/core';

export type UseCustomProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TQuery = unknown,
  TPayload = unknown,
  TData extends BaseRecord = TQueryFnData,
> = UseCustomPropsOriginal<TQueryFnData, TError, TQuery, TPayload, TData>;

export interface UseCustomReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
> {
  /** The response data (unwrapped from CustomResponse) */
  data: TData | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Fetching state */
  isFetching: boolean;
  /** Error state */
  isError: boolean;
  /** Success state */
  isSuccess: boolean;
  /** Error object */
  error: TError | null;
  /** Refetch function */
  refetch: QueryObserverResult<CustomResponse<TData>, TError>['refetch'];
  /** Original query object */
  query: QueryObserverResult<CustomResponse<TData>, TError>;
  /** Overtime information */
  overtime: { elapsedTime?: number };
}
