import { useCallback, useEffect, useState } from "react";
import { Category } from "../models/Category";
import { Choice } from "../models/Choice";
import { useToast } from "@chakra-ui/react";
import { fetchCategory, fetchChoices } from "../utils/supabaseApi";

export const useCategoryData = (categoryId: string | undefined) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const toast = useToast();

  const loadCategory = useCallback(async () => {
    if (!categoryId) return;

    const { data, error } = await fetchCategory(categoryId);
    if (error) {
      console.error("Error fetching category:", error);
      toast({
        title: "Error loading category",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else {
      setCategory(data);
    }
  }, [categoryId, toast]);

  const loadChoices = useCallback(async () => {
    if (!categoryId) return;

    const { data, error } = await fetchChoices(categoryId);
    if (error) {
      console.error("Error fetching choices:", error);
      toast({
        title: "Error loading choices",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } else {
      setChoices(data || []);
    }
  }, [categoryId, toast]);

  useEffect(() => {
    loadCategory();
    loadChoices();
  }, [loadCategory, loadChoices]);

  return { category, choices };
};
