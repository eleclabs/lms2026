export type Category = {
  _id: string;
  name: string;
  description?: string;
};

export type CategoryForm = {
  name: string;
  description: string;
};
