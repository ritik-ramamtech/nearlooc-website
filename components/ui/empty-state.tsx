interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="text-headline-sm font-semibold text-on-surface">{title}</p>
      {subtitle && (
        <p className="mt-1 text-body-sm text-on-surface-variant">{subtitle}</p>
      )}
    </div>
  );
}
