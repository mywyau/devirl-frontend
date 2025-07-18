export const rankClass = (rank: string): string => {
  switch (rank.toLowerCase()) {
    case "bronze":
      return "text-yellow-400";
    case "iron":
      return "text-gray-400";
    case "steel":
      return "text-gray-300";
    case "mithril":
      return "text-blue-300";
    case "adamantite":
      return "text-green-300";
    case "runic":
      return "text-teal-300";
    case "demon":
      return "text-red-400";
    case "ruinous":
      return "text-purple-400";
    case "aether":
      return "text-pink-400";
    default:
      return "text-zinc-300";
  }
};

export const rankOptions = [
  { value: "Bronze", label: "Bronze" },
  { value: "Iron", label: "Iron" },
  { value: "Steel", label: "Steel" },
  { value: "Mithril", label: "Mithril" },
  { value: "Adamantite", label: "Adamantite" },
  { value: "Runic", label: "Runic" },
  { value: "Ruinous", label: "Ruinous" },
  { value: "Demon", label: "Demon" },
  { value: "Aether", label: "Aether" },
];
