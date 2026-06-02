interface FormErrorAlertProps {
  title?: string;
  message: string;
  details?: string[];
}

export function FormErrorAlert({ title = 'Unable to submit form', message, details = [] }: FormErrorAlertProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      <p className="font-medium text-red-900">{title}</p>
      <p className="mt-1">{message}</p>
      {details.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
