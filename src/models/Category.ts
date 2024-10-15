import { ChoiceWithVotes } from "./Choice";

export type Category = {
  id: string;
  name: string;
  status: boolean;
  order_index: number;
  rigged: boolean;
};

export interface CategoryWithChoices extends Category {
  choices: ChoiceWithVotes[];
  winner: ChoiceWithVotes | null;
  totalVotes: number;
}
