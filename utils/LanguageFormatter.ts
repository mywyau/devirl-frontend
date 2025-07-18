export const languageFormatter = (language: string): string => {
  switch (language) {
    case "CPlusPlus":
      return "C++";
    case "CSharp":
      return "C#";
    default:
      return language;
  }
}