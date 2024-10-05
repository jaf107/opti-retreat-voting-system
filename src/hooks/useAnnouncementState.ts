import { useState, useEffect } from "react";
import { CategoryWithChoices } from "../models/Category";
import { ChoiceWithVotes } from "../models/Choice";

export const useAnnouncementState = (
  category: CategoryWithChoices | undefined
) => {
  const [showWinner, setShowWinner] = useState(false);
  const [winnerChoice, setWinnerChoice] = useState<ChoiceWithVotes | null>(
    null
  );

  useEffect(() => {
    if (category) {
      setWinnerChoice(category.winner);
      setShowWinner(false);
    }
  }, [category]);

  return { showWinner, setShowWinner, winnerChoice };
};
