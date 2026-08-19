import React from 'react';
import {
  Laptop,
  Activity,
  Cpu,
  TrendingUp,
  GraduationCap,
  Truck,
  Microscope,
  Rocket,
  Sprout,
  Zap,
  Factory,
  Radio,
  Palette,
  Landmark,
  Layers,
  Tag,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Activity,
  Cpu,
  TrendingUp,
  GraduationCap,
  Truck,
  Microscope,
  Rocket,
  Sprout,
  Zap,
  Factory,
  Radio,
  Palette,
  Landmark,
  Layers,
  technology: Laptop,
  healthcare: Activity,
  engineering: Cpu,
  finance: TrendingUp,
  education: GraduationCap,
  logistics: Truck,
  research: Microscope,
  entrepreneurship: Rocket,
  agriculture: Sprout,
  energy: Zap,
  manufacturing: Factory,
  telecommunications: Radio,
  'media-creative': Palette,
  government: Landmark,
  other: Layers,
};

interface CategoryIconProps {
  nameOrIcon: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  nameOrIcon,
  className = 'w-5 h-5',
  size = 20,
}) => {
  const IconComponent = iconMap[nameOrIcon] || iconMap[nameOrIcon.toLowerCase()] || Tag;
  return <IconComponent className={className} size={size} />;
};
