import { useEffect, useState } from "react";
import { Category, CategoryWithChoices } from "../models/Category";
import { fetchCategories, fetchChoicesWithVotes } from "../utils/supabaseApi";
import { ChoiceWithVotes } from "../models/Choice";
import { useToast } from "@chakra-ui/react";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryWithChoices[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const { data: categoriesData, error: categoriesError } =
        await fetchCategories();
      if (categoriesError) throw categoriesError;
      if (!categoriesData) throw new Error("No categories data received");

      const categoriesWithChoices: CategoryWithChoices[] = await Promise.all(
        categoriesData.map(async (category: Category) => {
          const { data: choicesData, error: choicesError } =
            await fetchChoicesWithVotes(category.id);
          if (choicesError) throw choicesError;
          if (!choicesData)
            throw new Error(
              `No choices data received for category ${category.id}`
            );

          const totalVotes = choicesData.reduce(
            (sum: number, choice: ChoiceWithVotes) => sum + choice.vote_count,
            0
          );

          const choicesWithPercentage = choicesData.map(
            (choice: ChoiceWithVotes) => ({
              ...choice,
              votePercentage:
                totalVotes > 0 ? (choice.vote_count / totalVotes) * 100 : 0,
            })
          );

          const sortedChoices = choicesWithPercentage.sort(
            (a: { vote_count: number }, b: { vote_count: number }) =>
              b.vote_count - a.vote_count
          );

          return {
            ...category,
            choices: sortedChoices,
            winner: sortedChoices[0] || null,
            totalVotes,
          };
        })
      );

      setCategories(categoriesWithChoices);
    } catch (error) {
      toast({
        title: "Error loading categories and choices",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, isLoading, refreshCategories: loadCategories };
};
