export const rankClass = (rank: string): string => {
  switch (rank.toLowerCase()) {
    case "bronze":
      return "text-yellow-500 dark:text-yellow-400";
    case "iron":
      return "text-gray-500 dark:text-gray-400";
    case "steel":
      return "text-gray-500 dark:text-gray-300";
    case "mithril":
      return "text-blue-500 dark:text-blue-300";
    case "adamantite":
      return "text-green-500 dark:text-green-300";
    case "rune":
      return "text-teal-500 dark:text-teal-300";
    case "demonic":
      return "text-red-500 dark:text-red-400";
    case "ruin":
      return "text-purple-500 dark:text-purple-400";
    case "aether":
      return "text-pink-500 dark:text-pink-400";
    default:
      return "text-zinc-500 dark:text-zinc-300";
  }
};

export const rankOptions = [
  { value: "Bronze", label: "Bronze" },
  { value: "Iron", label: "Iron" },
  { value: "Steel", label: "Steel" },
  { value: "Mithril", label: "Mithril" },
  { value: "Adamantite", label: "Adamantite" },
  { value: "Rune", label: "Rune" },
  { value: "Ruin", label: "Ruin" },
  { value: "Demonic", label: "Demonic" },
  { value: "Aether", label: "Aether" },
];
