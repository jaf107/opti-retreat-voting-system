import React, { useState } from "react";
import { fetchResults, fetchCategories } from "../utils/supabaseApi";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Progress,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Switch,
} from "@chakra-ui/react";

type Option = {
  option_name: string;
  votes: number;
  percentage: number;
};

type CategoryResult = {
  category_id: string;
  category_name: string;
  options: Option[];
};

const ResultsDashboard: React.FC = () => {
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [showPercentage, setShowPercentage] = useState(true);

  const handleFetchResults = async () => {
    setLoading(true);
    const { data: categoriesData, error: categoriesError } =
      await fetchCategories();
    const { data: resultsData, error: resultsError } = await fetchResults();

    if (categoriesError || resultsError) {
      console.error("Error fetching data:", categoriesError || resultsError);
      setResults([]);
    } else {
      const processedResults = processResultsByCategory(
        categoriesData || [],
        resultsData || []
      );
      setResults(processedResults);
    }
    setLoading(false);
  };

  const processResultsByCategory = (
    categories: any[],
    results: any[]
  ): CategoryResult[] => {
    const categoryMap = new Map<string, Option[]>();

    categories.forEach((category) => {
      categoryMap.set(category.id, []);
    });

    results.forEach((item) => {
      const options = categoryMap.get(item.category_id) || [];
      options.push({
        option_name: item.option_name,
        votes: item.votes,
        percentage: 0,
      });
      categoryMap.set(item.category_id, options);
    });

    const processedResults: CategoryResult[] = [];

    categories.forEach((category) => {
      const options = categoryMap.get(category.id) || [];
      const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
      const processedOptions = options.map((option) => ({
        ...option,
        percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
      }));

      processedOptions.sort((a, b) => b.votes - a.votes);

      processedResults.push({
        category_id: category.id,
        category_name: category.name,
        options: processedOptions,
      });
    });

    return processedResults;
  };

  /* useEffect(() => {
    handleFetchResults();
  }, []); */

  const handleExpandAll = () => {
    setExpandedIndexes(results.map((_, index) => index));
  };

  const handleCollapseAll = () => {
    setExpandedIndexes([]);
  };

  const toggleDisplayMode = () => {
    setShowPercentage(!showPercentage);
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Voting Results
      </Heading>
      <HStack spacing={4} mb={4}>
        <Button onClick={handleFetchResults} disabled={loading}>
          {loading ? "Loading..." : "Refresh Results"}
        </Button>
        <Button onClick={handleExpandAll}>Expand All</Button>
        <Button onClick={handleCollapseAll}>Collapse All</Button>
        <HStack>
          <Text>Votes</Text>
          <Switch isChecked={showPercentage} onChange={toggleDisplayMode} />
          <Text>Percentage</Text>
        </HStack>
      </HStack>
      {loading ? (
        <Spinner />
      ) : results.length > 0 ? (
        <Accordion
          allowMultiple
          index={expandedIndexes}
          onChange={(indexes: number[]) => setExpandedIndexes(indexes)}
        >
          {results.map((categoryResult, index) => (
            <AccordionItem key={categoryResult.category_id}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {categoryResult.category_name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  {categoryResult.options.map((option) => (
                    <Box
                      key={option.option_name}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                    >
                      <Text fontWeight="bold" mb={2}>
                        {option.option_name}
                      </Text>
                      <Text mb={2}>
                        {showPercentage
                          ? `${option.percentage.toFixed(1)}%`
                          : `${option.votes} votes`}
                      </Text>
                      <Progress
                        value={
                          showPercentage
                            ? option.percentage
                            : (option.votes /
                                Math.max(
                                  ...categoryResult.options.map((o) => o.votes)
                                )) *
                              100
                        }
                        size="sm"
                        colorScheme="blue"
                      />
                    </Box>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Text>No results found.</Text>
      )}
    </Box>
  );
};

export default ResultsDashboard;
