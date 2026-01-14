interface UserSectionCardProps {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export default function UserSectionCard({
  title,
  action,
  onAction,
  children,
}: UserSectionCardProps) {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{title}</h3>
        {action && (
          <button
            onClick={onAction}
            className="text-sm text-blue-600 hover:underline"
          >
            {action}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
