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
