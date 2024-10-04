export type Choice = {
  id: string;
  name: string;
  image_src: string;
};

export type ChoiceResult = {
  choice_name: string;
  votes: number;
  percentage: number;
};
