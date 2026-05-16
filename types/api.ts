// Types aligned with `openapi.yml` components/schemas and response wrappers.

// ── Base response wrappers ──────────────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Auth types ──────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = 'admin' | 'user';

/** `UserObject` in OpenAPI */
export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser;
}

export interface RefreshRequest {
  refreshToken: string;
  userId: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignupData {
  userId: string;
  email: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordData {
  message: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordData {
  message: string;
}

export interface LogoutData {
  message: string;
}

// ── Customer types (`Customer` in OpenAPI) ─────────────
export type CustomerStatus = 'active' | 'churned';

/** UUID v4 — DynamoDB partition key; use in `/v1/customers/{customerId}` and `/v1/themes/{customerId}`. */
export type CustomerId = string;

export interface Customer {
  /** UUID v4 partition key (not the same as `customerCode` slug). */
  customerId: CustomerId;
  /** Human-readable tenant slug (2–15 chars when suffixed). */
  customerCode: string;
  companyName: string;
  industry: string;
  primaryEmail: string;
  contactName: string;
  status: CustomerStatus;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  /** Present when API returns tenant website. */
  website?: string | null;
  /** Present when API returns primary phone. */
  primaryPhone?: string | null;
}

/** `GET /v1/customers` returns `data: Customer[]` */
export type CustomersListData = Customer[];

export interface CreateCustomerRequest {
  companyName: string;
  industry: string;
  primaryEmail: string;
  contactName: string;
  customerCode?: string;
}

/**
 * `PATCH /v1/customers/{customerId}` body — mirrors `UpdateCustomerRequest` in `openapi.yml`.
 * `minProperties: 1` on the schema: send at least one key. No `website` / `primaryPhone` on PATCH.
 */
export interface UpdateCustomerRequest {
  customerCode?: string;
  companyName?: string;
  industry?: string;
  primaryEmail?: string;
  contactName?: string;
  status?: CustomerStatus;
}

// ── Theme types ─────────────────────────────────────────
export type ThemeTokenMap = Record<string, string>;

export type ThemeFontFamilyMap = Record<string, string>;

export type ThemeFontSizeMap = Record<string, number>;

export interface ThemeFontTokens {
  families: ThemeFontFamilyMap;
  sizes: ThemeFontSizeMap;
}

export interface ThemeResponse {
  customerId: string;
  themeId: string;
  themeName: string;
  isActive: boolean;
  version: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  tokens: ThemeTokenMap;
  font_tokens: ThemeFontTokens;
}

export interface ThemeListItem {
  themeId: string;
  themeName: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  overrideCount: number;
}

export interface CreateThemeRequest {
  themeName: string;
  tokens?: ThemeTokenMap;
  fontFamilies?: ThemeFontFamilyMap;
  fontSizes?: ThemeFontSizeMap;
}

export interface UpdateThemeRequest {
  themeName?: string;
  tokens?: ThemeTokenMap;
  fontFamilies?: ThemeFontFamilyMap;
  fontSizes?: ThemeFontSizeMap;
}

export interface AiGenerateRequest {
  prompt: string;
  customerId?: string;
}

export interface AiPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  success: string;
  error: string;
  warning: string;
  sidebar: string;
}

export interface AiGenerateResponse {
  palette: AiPalette;
  tokens: Record<string, string>;
  fontFamilies: Record<string, string>;
  fontSizes: Record<string, number>;
  description: string;
  promptUsed: string;
}

// ── Pagination (shared client convention) ───────────────
export interface PaginationParams {
  limit?: number;
  nextToken?: string;
}

// ── Dashboard types (`DashboardMetrics` in OpenAPI) ───────
export type CustomerIndustry = string;

export type CustomerDashboardStatus =
  | 'active'
  | 'trial'
  | 'suspended'
  | 'churned';

export interface DashboardCustomerSummary {
  customerId: string;
  customerCode: string;
  companyName: string;
  status: CustomerDashboardStatus;
}

export interface DashboardRecentCustomer {
  customerId: string;
  customerCode: string;
  companyName: string;
  industry: CustomerIndustry;
  status: CustomerDashboardStatus;
  createdAt: string;
}

export interface DashboardMetrics {
  customers: {
    total: number;
    active: number;
    trial: number;
    suspended: number;
    churned: number;
  };
  themes: {
    total: number;
    withActiveTheme: number;
    customersWithNoActiveTheme: DashboardCustomerSummary[];
  };
  users: {
    admins: number;
    regularUsers: number;
    customers: number;
    total: number;
  };
  recentCustomers: DashboardRecentCustomer[];
  generatedAt: string;
  cachedUntil: string;
}
