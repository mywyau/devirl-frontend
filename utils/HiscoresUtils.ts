export const languageFormatter = (language: string): string => {
  switch (language) {
    case "CPlusPlus":
      return "C++";
    case "cplusplus":
      return "c++";
    case "CSharp":
      return "C#";
    case "csharp":
      return "c#";
    default:
      return language;
  }
};

export const languageOptions = [
  "C",
  "CPlusPlus",
  "CSharp",
  "Go",
  "Java",
  "JavaScript",
  "Kotlin",
  "PHP",
  "Python",
  "Ruby",
  "Rust",
  "Scala",
  "Sql",
  "Swift",
  "TypeScript",
];

export const skillOptions = ["questing", "estimating"];
