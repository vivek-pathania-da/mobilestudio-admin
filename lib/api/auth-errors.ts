import axios, { AxiosError } from 'axios';

/** True when the API rejected credentials (incl. API Gateway 403 auth parse errors). */
export function isLikelyAuthFailure(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  const status = error.response?.status;
  const message = extractErrorMessage(error);

  if (status === 401) {
    return true;
  }

  if (status === 403) {
    return (
      /authorization|unauthorized|authentication|forbidden/i.test(message) ||
      message.includes('key=value pair') ||
      message.includes('missing equal-sign')
    );
  }

  return false;
}

/** API Gateway IAM authorizer rejecting a Bearer JWT on GET (PUT on same path works). */
export function isAwsApiGatewayAuthHeaderError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  const message = extractErrorMessage(error);
  return (
    message.includes('key=value pair') ||
    message.includes('missing equal-sign') ||
    /Authorization header/i.test(message)
  );
}

function extractErrorMessage(error: AxiosError): string {
  const data = error.response?.data;
  if (typeof data === 'string') {
    return data;
  }
  if (data && typeof data === 'object' && 'message' in data) {
    return String((data as { message?: string }).message ?? '');
  }
  return error.message ?? '';
}
