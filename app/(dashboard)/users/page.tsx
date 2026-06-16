'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiErrorMessage } from '@/lib/api/client';
import { notificationsApi } from '@/lib/api/notifications.api';
import { useAdminUserBookings, useAdminUsers } from '@/hooks/useAdminUsers';
import type { AdminBookingListItem, AdminUserListItem } from '@/types/api';

function addMinutesIso(iso: string, minutes: number): string {
  const base = new Date(iso);
  if (Number.isNaN(base.getTime())) return iso;
  const ms = minutes * 60 * 1000;
  return new Date(base.getTime() + ms).toISOString();
}

export default function UsersPage() {
  const usersQuery = useAdminUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const bookingsQuery = useAdminUserBookings(selectedUserId);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const [bookingId, setBookingId] = useState('');

  const [delayMins, setDelayMins] = useState<number>(30);

  const [cancelReason, setCancelReason] = useState('');

  const [oldGate, setOldGate] = useState('A1');
  const [newGate, setNewGate] = useState('B2');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    bookingId: string;
    bookingStatus: string;
    gate: string | null;
    departureAt: string | null;
  } | null>(null);

  const effectiveBookingId = (selectedBookingId ?? bookingId).trim();
  const canSubmit = useMemo(() => {
    return effectiveBookingId.length > 0 && !isSubmitting;
  }, [effectiveBookingId, isSubmitting]);

  async function run<T>(fn: () => Promise<T>, successMessage: string) {
    if (!effectiveBookingId) {
      toast.error('Please select a booking or enter a bookingId.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await fn();
      if (
        typeof result === 'object' &&
        result !== null &&
        'booking' in result &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any).booking
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const booking = (result as any).booking as {
          bookingId?: string;
          status?: string;
          legs?: Array<{ flight?: { departureAt?: string; gate?: string | null } }>;
        };
        const departureAt = booking.legs?.[0]?.flight?.departureAt ?? null;
        const gate = booking.legs?.[0]?.flight?.gate ?? null;
        if (gate && typeof gate === 'string') {
          setOldGate(gate);
          setNewGate(gate);
        }
        setLastResult({
          bookingId: booking.bookingId ?? effectiveBookingId,
          bookingStatus: booking.status ?? '—',
          gate,
          departureAt,
        });
      }
      toast.success(successMessage);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  // If user changed, clear booking selection + manual entry.
  useEffect(() => {
    setSelectedBookingId(null);
    setBookingId('');
  }, [selectedUserId]);

  // When bookings load, default-select the first booking if nothing chosen.
  useEffect(() => {
    const list = bookingsQuery.data ?? [];
    if (!selectedBookingId && list.length > 0) {
      setSelectedBookingId(list[0].bookingId);
    }
  }, [bookingsQuery.data, selectedBookingId]);

  const users = usersQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const status = (b.status ?? '').toLowerCase();
      // Only show "upcoming/active" bookings.
      // Past trips end up `completed`; cancelled bookings should be excluded.
      if (status === 'cancelled') return false;
      if (status === 'completed') return false;
      return true;
    });
  }, [bookings]);

  const selectedUser: AdminUserListItem | null =
    selectedUserId ? users.find((u) => u.userId === selectedUserId) ?? null : null;

  const selectedBooking: AdminBookingListItem | null =
    selectedBookingId
      ? filteredBookings.find((b) => b.bookingId === selectedBookingId) ?? null
      : null;

  const baseDepartureAt = selectedBooking?.earliestDepartureAt ?? null;
  const effectiveDelayMins =
    Number.isFinite(delayMins) && delayMins >= 1 ? delayMins : 30;
  const newDepartureAt = useMemo(() => {
    if (!baseDepartureAt) return '';
    return addMinutesIso(baseDepartureAt, effectiveDelayMins);
  }, [baseDepartureAt, effectiveDelayMins]);

  const canSubmitDelayed = canSubmit && newDepartureAt.length > 0;

  return (
    <div className="mx-auto max-w-[900px] p-8">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Users
      </h1>
      <p
        className="mt-2 text-sm"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Generate mock notifications for a booking (admin only).
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Target user & booking</CardTitle>
            <CardDescription>
              Select a user, then a bookingId (or paste a bookingId manually).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="userSelect">User</Label>
              <select
                id="userSelect"
                className="h-9 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={selectedUserId ?? ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setSelectedUserId(value ? value : null);
                }}
                disabled={usersQuery.isLoading}
              >
                <option value="">
                  {usersQuery.isLoading
                    ? 'Loading users…'
                    : usersQuery.isError
                      ? 'Failed to load users'
                      : 'Select a user'}
                </option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.name} — {u.email} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bookingSelect">Booking</Label>
              <select
                id="bookingSelect"
                className="h-9 w-full rounded-lg border border-border bg-white px-3 text-sm"
                value={selectedBookingId ?? ''}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setSelectedBookingId(value ? value : null);
                  if (value) setBookingId('');
                }}
                disabled={!selectedUserId || bookingsQuery.isLoading}
              >
                <option value="">
                  {!selectedUserId
                    ? 'Select a user first'
                    : bookingsQuery.isLoading
                      ? 'Loading bookings…'
                      : bookingsQuery.isError
                        ? 'Failed to load bookings'
                        : filteredBookings.length === 0
                          ? 'No bookings for this user'
                          : 'Select a booking'}
                </option>
                {filteredBookings.map((b) => {
                  const label = b.bookingReference
                    ? `${b.bookingReference} — ${b.bookingId}`
                    : b.bookingId;
                  return (
                    <option key={b.bookingId} value={b.bookingId}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bookingId">Booking ID (manual)</Label>
              <Input
                id="bookingId"
                value={bookingId}
                onChange={(e) => {
                  setBookingId(e.target.value);
                  if (e.target.value.trim()) setSelectedBookingId(null);
                }}
                placeholder="e.g. 00000000-0000-4000-8000-000000000000"
              />
              {selectedUser ? (
                <p className="text-xs text-muted-foreground">
                  Selected user: {selectedUser.name} ({selectedUser.email})
                </p>
              ) : null}
              {selectedBooking ? (
                <p className="text-xs text-muted-foreground">
                  Selected booking: {selectedBooking.bookingReference ?? '—'} ·{' '}
                  {selectedBooking.bookingId}
                </p>
              ) : null}
              {lastResult ? (
                <p className="text-xs text-muted-foreground">
                  Last update: status {lastResult.bookingStatus}
                  {lastResult.gate ? ` · gate ${lastResult.gate}` : ''}
                  {lastResult.departureAt ? ` · dep ${lastResult.departureAt}` : ''}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Flight delayed</CardTitle>
              <CardDescription>Creates a “Flight Delayed” notification.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="delayMins">Delay (minutes)</Label>
                <Input
                  id="delayMins"
                  type="number"
                  min={1}
                  step={1}
                  value={effectiveDelayMins}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setDelayMins(Number.isFinite(next) && next >= 1 ? next : 1);
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newDepartureAt">New departure (ISO datetime)</Label>
                <Input
                  id="newDepartureAt"
                  readOnly
                  value={newDepartureAt}
                  placeholder="Select a booking to calculate"
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <Button
                type="button"
                disabled={!canSubmitDelayed}
                onClick={() =>
                  run(
                    () =>
                      notificationsApi.mockFlightDelayed({
                        bookingId: effectiveBookingId,
                        delayMins: effectiveDelayMins,
                        newDepartureAt,
                      }),
                    'Mock notification created (flight delayed).'
                  )
                }
              >
                Generate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flight cancelled</CardTitle>
              <CardDescription>Creates a “Flight Cancelled” notification.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="cancelReason">Reason (optional)</Label>
                <Input
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Weather disruption"
                />
              </div>

              <Button
                type="button"
                disabled={!canSubmit}
                variant="outline"
                onClick={() =>
                  run(
                    () =>
                      notificationsApi.mockFlightCancelled({
                        bookingId: effectiveBookingId,
                        reason: cancelReason.trim() ? cancelReason.trim() : undefined,
                      }),
                    'Mock notification created (flight cancelled).'
                  )
                }
              >
                Generate
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gate changed</CardTitle>
              <CardDescription>Creates a “Gate Changed” notification.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="oldGate">Old gate</Label>
                <Input
                  id="oldGate"
                  value={oldGate}
                  onChange={(e) => setOldGate(e.target.value)}
                  placeholder="e.g. A1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newGate">New gate</Label>
                <Input
                  id="newGate"
                  value={newGate}
                  onChange={(e) => setNewGate(e.target.value)}
                  placeholder="e.g. B2"
                />
              </div>

              <Button
                type="button"
                disabled={!canSubmit}
                variant="outline"
                onClick={() =>
                  run(
                    () =>
                      notificationsApi.mockGateChanged({
                        bookingId: effectiveBookingId,
                        oldGate: oldGate.trim(),
                        newGate: newGate.trim(),
                      }),
                    'Mock notification created (gate changed).'
                  )
                }
              >
                Generate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
