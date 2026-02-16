import { ASSIGNEE_COLORS } from '../../utils/constants';

const SIZE_CLASSES = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-6 h-6 text-xs',
  lg: 'w-7 h-7 text-xs',
};

export default function AssigneeBadge({ name, size = 'md', showName = false }) {
  const colors = ASSIGNEE_COLORS[name] || {
    bg: 'bg-surface-tertiary',
    text: 'text-content-secondary',
  };
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${SIZE_CLASSES[size]} rounded-full flex items-center justify-center font-bold ${colors.bg} ${colors.text}`}
        title={name}
      >
        {initial}
      </span>
      {showName && (
        <span className="text-xs text-content-secondary">{name}</span>
      )}
    </span>
  );
}
