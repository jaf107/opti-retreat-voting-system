export type Choice = {
  id: string;
  name: string;
  image_src: string;
  category_id: string;
  hidden: boolean;
  rigged_vote_count: number;
};

export interface ChoiceWithVotes extends Choice {
  vote_count: number;
  votePercentage: number;
}
