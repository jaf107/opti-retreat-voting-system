import React, { useState, useEffect } from "react";
import { fetchResults } from "../../utils/controllers/Results";
import { fetchCategories } from "../../utils/controllers/Categories";
import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  useBreakpointValue,
  Flex,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { PieChart, RefreshCw, SeparatorHorizontal } from "lucide-react";
import { ChoiceResult } from "../../models/Choice";
import { CategoryResult } from "../../models/Category";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "rgba(255, 99, 132, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(199, 199, 199, 0.8)",
  "rgba(83, 102, 255, 0.8)",
  "rgba(40, 159, 64, 0.8)",
  "rgba(210, 199, 199, 0.8)",
];

export default function ResultsDashboard() {
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const chartSize = useBreakpointValue({ base: 250, md: 400 });

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const processResultsByCategory = (
    categories: any[],
    results: any[]
  ): CategoryResult[] => {
    const categoryMap = new Map<string, ChoiceResult[]>();

    categories.forEach((category) => {
      categoryMap.set(category.id, []);
    });

    results.forEach((item) => {
      const options = categoryMap.get(item.category_id) || [];
      options.push({
        choice_name: item.option_name,
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = context.dataset.data[context.dataIndex];
            return `${label}: ${value} votes (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Box p={4} bg={bgColor} borderRadius="lg" boxShadow="xl">
      <Flex as="h1" mb={6} alignItems="center" justifyContent="center">
        <Box py={12} textAlign="center">
          <Flex alignItems="center" justifyContent="center" gap={2}>
            <Icon as={PieChart} boxSize={6} mr={2} />
            <Heading as="h2" size="2xl">
              Results
            </Heading>
            <IconButton
              aria-label="Refresh"
              isLoading={loading}
              onClick={handleRefresh}
              icon={<Icon as={RefreshCw} />}
            />
          </Flex>
          <Text mt={4} fontSize="lg">
            See the latest voting results for all our Categories{" "}
          </Text>
        </Box>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        </Flex>
      ) : results.length > 0 ? (
        <VStack spacing={15} align="stretch">
          {results.map((categoryResult) => (
            <Box
              key={categoryResult.category_id}
              bg={useColorModeValue("white", "gray.700")}
              p={4}
              borderRadius="md"
              boxShadow="md"
            >
              <Heading
                as="h3"
                size="lg"
                mb={4}
                textAlign="center"
                color={textColor}
              >
                {categoryResult.category_name}
              </Heading>
              {categoryResult.options.length > 0 ? (
                <Box height={chartSize}>
                  <Doughnut
                    data={{
                      labels: categoryResult.options.map(
                        (option) => option.choice_name
                      ),
                      datasets: [
                        {
                          data: categoryResult.options.map(
                            (option) => option.percentage
                          ),
                          backgroundColor: COLORS,
                          borderColor: COLORS.map((color) =>
                            color.replace("0.8", "1")
                          ),
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </Box>
              ) : (
                <Text fontSize="lg" textAlign="center" color={textColor}>
                  No options available for this category.
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      ) : (
        <Text fontSize="xl" textAlign="center" color={textColor}>
          No results found.
        </Text>
      )}
    </Box>
  );
}
