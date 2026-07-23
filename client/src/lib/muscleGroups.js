export const MUSCLE_GROUPS = [
  { value: "CHEST", label: "Göğüs" },
  { value: "BACK", label: "Sırt" },
  { value: "SHOULDERS", label: "Omuz" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "LEGS", label: "Bacak" },
  { value: "CORE", label: "Core" },
  { value: "CARDIO", label: "Kardiyo" },
  { value: "FULL_BODY", label: "Tüm Vücut" },
  { value: "OTHER", label: "Diğer" },
];

export function muscleGroupLabel(value) {
  return MUSCLE_GROUPS.find((g) => g.value === value)?.label || value;
}
