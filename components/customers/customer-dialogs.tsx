'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { customersApi } from '@/lib/api/customers.api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { Customer, CreateCustomerRequest } from '@/types/api';

const addCustomerSchema = z.object({
  companyName: z.string().min(1).max(200),
  industry: z.string().min(1).max(60),
  primaryEmail: z.string().min(1).email(),
  contactName: z.string().min(1).max(200),
  customerCode: z.string().max(10).optional(),
});

type AddCustomerForm = z.infer<typeof addCustomerSchema>;

function invalidateCustomerLists(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ['customers'] });
}

function formatIso(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CustomerDetailDialog({
  customerId,
  open,
  onOpenChange,
}: {
  customerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customersApi.get(customerId!),
    enabled: open && !!customerId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Customer details</DialogTitle>
          <DialogDescription>
            Fetched with GET /v1/customers/:customerId (UUID path parameter).
          </DialogDescription>
        </DialogHeader>
        {isPending ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
        ) : data ? (
          <dl className="grid gap-2 text-sm">
            <DetailRow label="Company" value={data.companyName} />
            <DetailRow label="Code" value={data.customerCode} mono />
            <DetailRow label="Customer ID (UUID)" value={data.customerId} mono />
            <DetailRow label="Industry" value={data.industry} />
            <DetailRow label="Contact" value={data.contactName} />
            <DetailRow label="Email" value={data.primaryEmail} />
            <DetailRow label="Status" value={data.status} />
            <DetailRow label="Created" value={formatIso(data.createdAt)} />
            <DetailRow label="Updated" value={formatIso(data.updatedAt)} />
          </dl>
        ) : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 border-b border-border py-1.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? 'break-all font-mono text-xs' : ''}>{value}</dd>
    </div>
  );
}

export function AddCustomerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const form = useForm<AddCustomerForm>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      primaryEmail: '',
      contactName: '',
      customerCode: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const mutation = useMutation({
    mutationFn: (body: CreateCustomerRequest) => customersApi.create(body),
    onSuccess: () => {
      invalidateCustomerLists(qc);
      toast.success('Customer created');
      onOpenChange(false);
      form.reset();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const onSubmit = form.handleSubmit((values) => {
    const body: CreateCustomerRequest = {
      companyName: values.companyName.trim(),
      industry: values.industry.trim(),
      primaryEmail: values.primaryEmail.trim(),
      contactName: values.contactName.trim(),
    };
    const code = values.customerCode?.trim();
    if (code) {
      body.customerCode = code;
    }
    mutation.mutate(body);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>
          <DialogDescription>
            Creates a tenant via <code className="text-xs">POST /v1/customers</code>. The
            API assigns a UUID <code className="text-xs">customerId</code> and a unique{' '}
            <code className="text-xs">customerCode</code>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="add-company">Company name</Label>
            <Input id="add-company" maxLength={200} {...form.register('companyName')} />
            {form.formState.errors.companyName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-industry">Industry</Label>
            <Input id="add-industry" maxLength={60} {...form.register('industry')} />
            {form.formState.errors.industry && (
              <p className="text-xs text-destructive">
                {form.formState.errors.industry.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-email">Primary email</Label>
            <Input
              id="add-email"
              type="email"
              {...form.register('primaryEmail')}
            />
            {form.formState.errors.primaryEmail && (
              <p className="text-xs text-destructive">
                {form.formState.errors.primaryEmail.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-contact">Contact name</Label>
            <Input id="add-contact" maxLength={200} {...form.register('contactName')} />
            {form.formState.errors.contactName && (
              <p className="text-xs text-destructive">
                {form.formState.errors.contactName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-code">Customer code (optional)</Label>
            <Input
              id="add-code"
              maxLength={10}
              placeholder="Auto from company if empty"
              {...form.register('customerCode')}
            />
            {form.formState.errors.customerCode && (
              <p className="text-xs text-destructive">
                {form.formState.errors.customerCode.message}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ChurnCustomerDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      if (!customer) throw new Error('No customer');
      return customersApi.churn(customer.customerId);
    },
    onSuccess: () => {
      invalidateCustomerLists(qc);
      if (customer?.customerId) {
        void qc.invalidateQueries({ queryKey: ['customer', customer.customerId] });
        void qc.invalidateQueries({ queryKey: ['themes', customer.customerId] });
        void qc.invalidateQueries({ queryKey: ['theme-active', customer.customerId] });
      }
      toast.success('Customer churned');
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const canChurn = customer?.status === 'active';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Churn customer</DialogTitle>
          <DialogDescription>
            Calls <code className="text-xs">DELETE /v1/customers/{'{customerId}'}</code> to
            soft-delete (status becomes <code className="text-xs">churned</code>). Repeating
            returns 400.
          </DialogDescription>
        </DialogHeader>
        {customer && (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="font-medium">{customer.companyName}</span>
            <span className="text-muted-foreground"> · {customer.customerCode}</span>
          </p>
        )}
        {!canChurn ? (
          <p className="text-sm text-muted-foreground">
            Only active customers can be churned from here.
          </p>
        ) : (
          <p className="text-sm text-destructive">
            This action marks the tenant as churned. Continue?
          </p>
        )}
        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canChurn || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? 'Working…' : 'Churn customer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
