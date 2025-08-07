export const getStatusTextColour = (
  status: string | null | undefined
): string => {
  switch (status) {
    case "Completed":
      return "text-green-500 dark:text-green-300";
    case "Failed":
      return "text-red-500 dark:text-red-300";
    case "Review":
      return "text-blue-500 dark:text-blue-300";
    case "InProgress":
      return "text-yellow-500 dark:text-yellow-300";
    case "NotStarted":
      return "text-zinc-500 dark:text-zinc-400";
    case "Open":
      return "text-teal-500 dark:text-teal-300";
    default:
      return "text-indigo-500 dark:text-indigo-300";
  }
};

export const statusFormatter = (status: string): string => {
  switch (status) {
    case "NotStarted":
      return "Not Started";
    case "NotEstimated":
      return "Not Estimated";
    case "InProgress":
      return "In Progress";
    case "PaidOut":
      return "Paid Out";
    default:
      return status;
  }
};

