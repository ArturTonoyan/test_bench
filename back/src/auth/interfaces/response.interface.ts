export interface RegisterSuccessResponse {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterErrorResponse {
  code: 'VALIDATION_ERROR';
  errors: ValidationError[];
}

export interface InternalErrorResponse {
  code: 'INTERNAL_ERROR';
  message: string;
}
