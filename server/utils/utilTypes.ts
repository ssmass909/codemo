export interface DefaultMetadata {
  error?: any;
  resourceId?: string | number;
  requestBody?: any;
}

export interface ExpressResponse<T, K = DefaultMetadata> {
  data: T | null;
  message?: string;
  metadata?: K;
}
