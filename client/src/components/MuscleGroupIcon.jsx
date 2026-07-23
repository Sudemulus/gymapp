import {
  Dumbbell,
  Weight,
  BicepsFlexed,
  Footprints,
  StretchHorizontal,
  HeartPulse,
  PersonStanding,
  Target,
} from "lucide-react";

const ICON_CONFIG = {
  CHEST: { Icon: Dumbbell, rotate: 0 },
  BACK: { Icon: Weight, rotate: 0 },
  SHOULDERS: { Icon: Dumbbell, rotate: 90 },
  BICEPS: { Icon: BicepsFlexed, rotate: 0 },
  TRICEPS: { Icon: Weight, rotate: 180 },
  LEGS: { Icon: Footprints, rotate: 0 },
  CORE: { Icon: StretchHorizontal, rotate: 0 },
  CARDIO: { Icon: HeartPulse, rotate: 0 },
  FULL_BODY: { Icon: PersonStanding, rotate: 0 },
  OTHER: { Icon: Target, rotate: 0 },
};

export default function MuscleGroupIcon({ muscleGroup, className = "h-8 w-8" }) {
  const { Icon, rotate } = ICON_CONFIG[muscleGroup] ?? ICON_CONFIG.OTHER;
  return (
    <Icon
      className={className}
      strokeWidth={1.75}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    />
  );
}
