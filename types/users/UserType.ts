export interface UserType {
  type: "Dev" | "Client" | "Completed";
  toString(): string;
}

const Dev: UserType = {
  type: "Dev",
  toString: () => "Dev",
};

const Client: UserType = {
  type: "Client",
  toString: () => "Client",
};
