'use client';

/**
 * ContactForm Component
 * Contact form for reaching property agents with validation.
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 12.6
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { UI_TEXT } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// ---------------------------------------------------------------------------
// Zod validation schema
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z
    .string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(
      /^(\+62|08)\d{9,}$/,
      'Format nomor telepon tidak valid. Gunakan format +62xxx atau 08xxx (minimal 12 digit)'
    ),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  message: z
    .string()
    .min(1, 'Pesan wajib diisi')
    .min(10, 'Pesan minimal 10 karakter'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactFormProps {
  propertyId: string;
  propertyTitle: string;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

type AlertType = 'success' | 'error';

interface AlertState {
  type: AlertType;
  message: string;
}

// ---------------------------------------------------------------------------
// Alert sub-component
// ---------------------------------------------------------------------------

function Alert({ type, message, onDismiss }: AlertState & { onDismiss: () => void }) {
  const isSuccess = type === 'success';

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 rounded-lg p-4 text-sm ${
        isSuccess
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}
    >
      {/* Icon */}
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {isSuccess ? (
          <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

      {/* Message */}
      <p className="flex-1">{message}</p>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className={`shrink-0 rounded p-0.5 focus:outline-none focus:ring-2 ${
          isSuccess
            ? 'text-green-600 hover:text-green-800 focus:ring-green-500'
            : 'text-red-600 hover:text-red-800 focus:ring-red-500'
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Textarea sub-component (mirrors Input styling)
// ---------------------------------------------------------------------------

interface TextareaProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  name?: string;
}

const Textarea = ({
  id,
  label,
  error,
  required,
  rows = 4,
  placeholder,
  disabled,
  value,
  onChange,
  onBlur,
  name,
}: TextareaProps) => {
  const errorId = error ? `${id}-error` : undefined;

  const baseStyles =
    'block w-full px-3 py-2 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 resize-none';
  const errorStyles = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-red-500 focus:border-red-500';

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="wajib diisi">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${baseStyles} ${errorStyles}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main ContactForm component
// ---------------------------------------------------------------------------

export function ContactForm({
  propertyId,
  propertyTitle,
  onSubmitSuccess,
  onSubmitError,
}: ContactFormProps) {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',       // validate on blur (Requirement 6.4)
    reValidateMode: 'onChange',
  });

  // Disable submit when: submitting, or form has been touched but is invalid
  const isSubmitDisabled = isSubmitting || (isDirty && !isValid);

  const onSubmit = async (data: ContactFormData) => {
    setAlert(null);

    try {
      await api.post(endpoints.contact.submit, {
        ...data,
        propertyId,
        propertyTitle,
      });

      setAlert({ type: 'success', message: UI_TEXT.contact.success });
      reset(); // clear form after success (Requirement 6.6)
      onSubmitSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setAlert({ type: 'error', message: UI_TEXT.contact.error });
      onSubmitError?.(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={`Formulir kontak untuk properti ${propertyTitle}`}
      className="space-y-4"
    >
      {/* Alert banner */}
      <AnimatePresence>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      {/* Full name */}
      <Input
        id="contact-fullName"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap Anda"
        required
        fullWidth
        error={errors.fullName?.message}
        disabled={isSubmitting}
        {...register('fullName')}
      />

      {/* Phone */}
      <Input
        id="contact-phone"
        label="Nomor Telepon"
        type="tel"
        placeholder="+62812345678 atau 0812345678"
        required
        fullWidth
        error={errors.phone?.message}
        disabled={isSubmitting}
        {...register('phone')}
      />

      {/* Email */}
      <Input
        id="contact-email"
        label="Email"
        type="email"
        placeholder="nama@email.com"
        required
        fullWidth
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register('email')}
      />

      {/* Message */}
      <Textarea
        id="contact-message"
        label="Pesan"
        placeholder="Tuliskan pesan Anda di sini..."
        required
        rows={4}
        error={errors.message?.message}
        disabled={isSubmitting}
        {...register('message')}
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitDisabled}
        aria-label={isSubmitting ? 'Mengirim pesan...' : 'Kirim pesan ke agen'}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
      </Button>
    </form>
  );
}

export default ContactForm;
