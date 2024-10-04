import { ChoiceResult } from "./Choice";

export type Category = {
  id: string;
  name: string;
};

export type CategoryResult = {
  category_id: string;
  category_name: string;
  options: ChoiceResult[];
};
