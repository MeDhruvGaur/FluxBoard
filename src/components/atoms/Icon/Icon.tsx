import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = 'currentColor',
  className,
  style
}) => {
  const Component = LucideIcons[name] as React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }>;

  if (!Component) {
    return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  }

  return <Component size={size} color={color} className={className} style={style} />;
};

export default Icon;
