export const getStatusTextColour = (
  status: string | null | undefined
): string => {
  switch (status) {
    case "Completed":
      return "text-green-300";
    case "Failed":
      return "text-red-300";
    case "Review":
      return "text-blue-300";
    case "InProgress":
      return "text-yellow-300";
    case "NotStarted":
      return "text-zinc-400";
    case "Open":
      return "text-teal-300";
    default:
      return "text-indigo-300";
  }
};
