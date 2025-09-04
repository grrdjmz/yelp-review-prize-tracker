import Image from 'next/image';
import clsx from 'clsx';

interface AvatarInitialsProps {
  fullName: string;
  avatarUrl?: string | null;
  size?: number;
}

/**
 * Displays a user avatar if available, otherwise falls back to initials. The
 * background color is determined by hashing the name into a pastel hue.
 */
export function AvatarInitials({ fullName, avatarUrl, size = 64 }: AvatarInitialsProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
  // Create a simple hash for the background color
  let hash = 0;
  for (const char of fullName) hash = char.charCodeAt(0) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  const bgColor = `hsl(${hue}, 70%, 85%)`;

  if (avatarUrl) {
    return (
      <div className={clsx('rounded-full overflow-hidden')} style={{ width: size, height: size }}>
        <Image src={avatarUrl} alt={fullName} width={size} height={size} />
      </div>
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-bc-black font-medium"
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
