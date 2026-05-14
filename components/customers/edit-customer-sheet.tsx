'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useForm, type FieldNamesMarkedBoolean } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { customersApi } from '@/lib/api/customers.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Customer, CustomerStatus, UpdateCustomerRequest } from '@/types/api';
import { cn } from '@/lib/utils';

const editCustomerSchema = z.object({
  companyName: z.string().min(1).max(200),
  /** Display only; PATCH allows `customerCode` max 10 — slug may be longer on legacy rows. */
  customerCode: z.string().min(1).max(15),
  industry: z.string().min(1).max(60),
  contactName: z.string().min(1).max(200),
  primaryEmail: z.string().min(1).email(),
  status: z.enum(['active', 'churned']),
});

type EditCustomerForm = z.infer<typeof editCustomerSchema>;

const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'aviation', label: 'Aviation' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'finance', label: 'Finance' },
  { value: 'supply chain', label: 'Supply chain' },
  { value: 'other', label: 'Other' },
];

function customerToFormValues(c: Customer): EditCustomerForm {
  return {
    companyName: c.companyName,
    customerCode: c.customerCode,
    industry: c.industry.trim() || 'other',
    contactName: c.contactName,
    primaryEmail: c.primaryEmail,
    status: c.status,
  };
}

/**
 * PATCH body: only keys the user changed (`dirtyFields`), OpenAPI `minProperties: 1`.
 * Omits `customerCode` (read-only in UI; optional on API).
 */
function buildUpdatePayload(
  values: EditCustomerForm,
  dirty: Partial<FieldNamesMarkedBoolean<EditCustomerForm>>
): UpdateCustomerRequest {
  const out: UpdateCustomerRequest = {};
  if (dirty.companyName) out.companyName = values.companyName.trim();
  if (dirty.industry) out.industry = values.industry.trim();
  if (dirty.primaryEmail) out.primaryEmail = values.primaryEmail.trim();
  if (dirty.contactName) out.contactName = values.contactName.trim();
  if (dirty.status) out.status = values.status;
  return out;
}

function invalidateCustomerLists(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ['customers'] });
}

export function EditCustomerSheet({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const customerId = customer?.customerId ?? null;
  const snapshotRef = useRef<EditCustomerForm | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['customer', customerId, 'edit'],
    queryFn: () => customersApi.get(customerId!),
    enabled: open && !!customerId,
  });

  const resolved = data ?? customer ?? null;
  const isChurned = resolved?.status === 'churned';

  const form = useForm<EditCustomerForm>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      companyName: '',
      customerCode: '',
      industry: 'other',
      contactName: '',
      primaryEmail: '',
      status: 'active',
    },
  });

  const industrySelectOptions = useMemo(() => {
    const ind = resolved?.industry?.trim().toLowerCase();
    const base = [...INDUSTRY_OPTIONS];
    if (ind && !base.some((o) => o.value.toLowerCase() === ind)) {
      base.unshift({ value: resolved!.industry.trim(), label: resolved!.industry.trim() });
    }
    return base;
  }, [resolved]);

  useEffect(() => {
    if (!open || !resolved) return;
    const next = customerToFormValues(resolved);
    form.reset(next);
    snapshotRef.current = next;
  }, [open, resolved, form]);

  const mutation = useMutation({
    mutationFn: (body: UpdateCustomerRequest) =>
      customersApi.update(customerId!, body),
    onSuccess: () => {
      invalidateCustomerLists(qc);
      void qc.invalidateQueries({ queryKey: ['customer', customerId] });
      toast.success('Customer updated');
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const status = form.watch('status') as CustomerStatus;
  const blockProfileEdits = isChurned && status !== 'active';

  const onSubmit = form.handleSubmit((values) => {
    if (resolved?.status === 'churned' && values.status !== 'active') {
      toast.error('Churned customers can only be updated when reactivating (set status to Active).');
      return;
    }
    const payload = buildUpdatePayload(values, form.formState.dirtyFields);
    if (Object.keys(payload).length === 0) {
      toast.error('No changes to save.');
      return;
    }
    mutation.mutate(payload);
  });

  const handleDiscard = () => {
    if (snapshotRef.current) {
      form.reset(snapshotRef.current);
    } else if (resolved) {
      form.reset(customerToFormValues(resolved));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 p-0 sm:max-w-[min(100vw-1rem,28rem)]">
        <SheetHeader className="pr-14">
          <SheetTitle>Edit Customer</SheetTitle>
        </SheetHeader>

        {isPending && open ? (
          <div className="flex flex-1 items-center justify-center px-6 py-12">
            <p className="text-sm text-muted-foreground">Loading customer…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col gap-2 px-6 py-8">
            <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : resolved ? (
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={onSubmit}
          >
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {isChurned ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  This tenant is <strong>churned</strong>. Set status to <strong>Active</strong> to
                  reactivate; you can then edit the other fields in the same save (per API).
                </p>
              ) : null}

              <section className="space-y-4">
                <h3 className="admin-section-label">Business details</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="ec-company">Company name</Label>
                  <Input
                    id="ec-company"
                    maxLength={200}
                    disabled={blockProfileEdits}
                    {...form.register('companyName')}
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.companyName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="ec-code">Customer code</Label>
                    <Input
                      id="ec-code"
                      maxLength={15}
                      autoCapitalize="characters"
                      disabled={blockProfileEdits}
                      className="cursor-default bg-muted/50 font-mono text-sm uppercase"
                      title="Tenant slug; not sent on PATCH (read-only)."
                      {...form.register('customerCode')}
                      readOnly
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Read-only — not included in PATCH body.
                    </p>
                    {form.formState.errors.customerCode && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.customerCode.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Industry</Label>
                    <Select
                      value={form.watch('industry')}
                      onValueChange={(v) => form.setValue('industry', v, { shouldDirty: true })}
                      disabled={blockProfileEdits}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industrySelectOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="admin-section-label">Contact details</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="ec-contact">Primary contact</Label>
                  <Input
                    id="ec-contact"
                    maxLength={200}
                    disabled={blockProfileEdits}
                    {...form.register('contactName')}
                  />
                  {form.formState.errors.contactName && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.contactName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ec-email">Email address</Label>
                  <Input
                    id="ec-email"
                    type="email"
                    disabled={blockProfileEdits}
                    {...form.register('primaryEmail')}
                  />
                  {form.formState.errors.primaryEmail && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.primaryEmail.message}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="admin-section-label">Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        value: 'active' as const,
                        label: 'Active',
                        icon: CheckCircle2,
                      },
                      {
                        value: 'churned' as const,
                        label: 'Churned',
                        icon: Ban,
                      },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => {
                    const selected = status === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          form.setValue('status', value, { shouldDirty: true })
                        }
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-4 text-center transition-colors',
                          selected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted/50',
                          value === 'churned' &&
                            selected &&
                            'border-destructive/50 text-destructive'
                        )}
                      >
                        <Icon className="size-8 shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-semibold tracking-wide uppercase">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <Separator />

            <SheetFooter className="flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <Button
                type="button"
                variant="link"
                className="h-auto justify-start p-0 text-destructive hover:text-destructive"
                onClick={handleDiscard}
              >
                Discard
              </Button>
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                <span className="text-center text-[11px] text-muted-foreground sm:text-right">
                  Future Admin
                </span>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      mutation.isPending ||
                      !form.formState.isDirty ||
                      (resolved.status === 'churned' && status !== 'active')
                    }
                    className="font-semibold"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-foreground)',
                    }}
                  >
                    {mutation.isPending ? 'Saving…' : 'Save changes'}
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </form>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
