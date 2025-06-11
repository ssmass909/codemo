export interface ExpressResponse<T, K = unknown> {
  data: T | null;
  message?: string;
  metadata?: K;
}
