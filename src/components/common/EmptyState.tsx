interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon = '📝',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
