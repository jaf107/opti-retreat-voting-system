import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";
import { fetchResults, fetchCategories } from "../utils/supabaseApi";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
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

const COLORS = [
  "#3182CE",
  "#38A169",
  "#DD6B20",
  "#D53F8C",
  "#805AD5",
  "#319795",
  "#ED8936",
  "#4299E1",
  "#48BB78",
  "#F56565",
];

const VotingResultsPieCharts: React.FC = () => {
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
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
    fetchData();
  }, []);

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

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={percent > 0.15 ? "14px" : "12px"}
        fontWeight={index === 0 ? "bold" : "normal"}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <Box p={8} bg={bgColor} borderRadius="lg" boxShadow="xl">
      <Heading as="h2" size="xl" mb={6} textAlign="center" color={textColor}>
        Voting Results
      </Heading>
      {loading ? (
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
        />
      ) : results.length > 0 ? (
        <Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap={8}>
          {results.map((categoryResult, index) => (
            <GridItem key={categoryResult.category_id}>
              <Box
                mb={4}
                bg={useColorModeValue("white", "gray.700")}
                p={6}
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
                  <PieChart width={400} height={400}>
                    <Pie
                      data={categoryResult.options}
                      dataKey="percentage"
                      nameKey="option_name"
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {categoryResult.options.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={useColorModeValue("white", "gray.800")}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                ) : (
                  <Text fontSize="lg" textAlign="center" color={textColor}>
                    No options available for this category.
                  </Text>
                )}
              </Box>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Text fontSize="xl" textAlign="center" color={textColor}>
          No results found.
        </Text>
      )}
    </Box>
  );
};

export default VotingResultsPieCharts;
