import { useState, useCallback, useEffect } from "react";
import { getNextCategory } from "../utils/controllers/Categories";

export const useNextCategory = (categoryId: string | undefined) => {
  const [nextCategoryId, setNextCategoryId] = useState<string | null>(null);
  const [nextCategoryStatus, setNextCategoryStatus] = useState<boolean>(false);

  const loadNextCategory = useCallback(async () => {
    if (!categoryId) return;

    const { data: nextCategory } = await getNextCategory(categoryId);
    setNextCategoryStatus(nextCategory?.status || false);
    setNextCategoryId(nextCategory?.id || null);
  }, [categoryId]);

  useEffect(() => {
    loadNextCategory();
    const intervalId = setInterval(loadNextCategory, 5000);
    return () => clearInterval(intervalId);
  }, [loadNextCategory]);

  return { nextCategoryId, nextCategoryStatus };
};
