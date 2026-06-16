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

export interface RadiusPalette {
  radiusButton: number;
  radiusInput: number;
  radiusCard: number;
  radiusModal: number;
  radiusChip: number;
  radiusBottomSheet: number;
}

export interface RadiusTokens {
  radiusNone: number;
  radiusXs: number;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  radiusFull: number;
  radiusButton: number;
  radiusInput: number;
  radiusCard: number;
  radiusModal: number;
  radiusChip: number;
  radiusIconButton: number;
  radiusBadge: number;
  radiusAvatar: number;
  radiusBottomSheet: number;
  radiusToast: number;
  radiusIcon: number;
}

export interface RadiusTokensResponse {
  palette: RadiusPalette;
  tokens: RadiusTokens;
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
  radius_tokens?: RadiusTokensResponse;
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
  radiusPalette?: Partial<RadiusPalette>;
}

export interface UpdateThemeRequest {
  themeName?: string;
  tokens?: ThemeTokenMap;
  fontFamilies?: ThemeFontFamilyMap;
  fontSizes?: ThemeFontSizeMap;
  radiusPalette?: Partial<RadiusPalette>;
}

export interface AiGenerateRequest {
  prompt: string;
  customerId?: string;
  themeMode?: 'light' | 'dark';
  primaryColours?: string[];
  image?: string;
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  darkVersionMode?: boolean;
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
  /** Normalized from API `radius_tokens` or `radiusPalette` + `radiusTokens`. */
  radius_tokens?: RadiusTokensResponse;
  /** Raw AI generate fields (camelCase). */
  radiusPalette?: RadiusPalette;
  radiusTokens?: RadiusTokens;
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

// ── Notifications (admin mock generators) ─────────────────────────────────────

export type NotificationType =
  | 'ticket_confirmed'
  | 'flight_cancelled'
  | 'flight_delayed'
  | 'gate_changed';

export interface FlightDelayedMetadata {
  delayMins: number;
  newDepartureAt: string;
}

export interface FlightCancelledMetadata {
  reason?: string;
}

export interface GateChangedMetadata {
  oldGate: string;
  newGate: string;
}

export type NotificationMetadata =
  | Record<string, never>
  | FlightDelayedMetadata
  | FlightCancelledMetadata
  | GateChangedMetadata;

export interface Notification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  bookingId: string;
  bookingReference: string;
  flightNumber: string;
  origin: string;
  destination: string;
  isRead: boolean;
  metadata: NotificationMetadata;
  createdAt: string;
  ttl: number;
}

export interface MockFlightDelayedRequest {
  bookingId: string;
  delayMins: number;
  newDepartureAt: string;
}

export interface MockFlightCancelledRequest {
  bookingId: string;
  reason?: string;
}

export interface MockGateChangedRequest {
  bookingId: string;
  oldGate: string;
  newGate: string;
}

// ── Bookings (subset needed by admin mock notifications) ──────────────────────

export type BookingStatus =
  | 'confirmed'
  | 'changed'
  | 'checked_in'
  | 'cancelled'
  | 'completed';

export interface BookingFlightSnapshot {
  flightId: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureAt: string;
  arrivalAt: string;
  durationMins: number;
  /** Optional gate shown before check-in (first leg). */
  gate?: string | null;
  aircraftType: string;
  fareClassCode: string;
  fareName: string;
  basePricePerPerson: number;
  taxPerPerson: number;
  currency: string;
}

export interface BookingLeg {
  legId: string;
  legOrder: number;
  flight: BookingFlightSnapshot;
  passengerCount: number;
}

export interface BookingRecord {
  bookingId: string;
  bookingReference: string;
  userId: string;
  legs: BookingLeg[];
  cabinClass: 1 | 2 | 3 | 4;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithPassengers extends BookingRecord {
  passengers: unknown[];
}

export interface MockNotificationResult {
  notification: Notification;
  booking: BookingWithPassengers;
}

// ── Admin: users + bookings lookup ───────────────────────────────────────────

export interface AdminUserListItem {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AdminBookingListItem {
  bookingId: string;
  bookingReference?: string;
  createdAt?: string;
  status?: string;
  earliestDepartureAt?: string;
}
