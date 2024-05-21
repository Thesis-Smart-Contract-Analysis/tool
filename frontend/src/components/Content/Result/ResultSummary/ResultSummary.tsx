import React, { useContext, useState } from "react";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { ResultContext } from "@/context/ResultContext";
import Severity from "@/components/Severity/Severity";
import { TOOL } from "@/enums";

import "./ResultSummary.scss";

const ResultSummary: React.FC = () => {
  const { result } = useContext(ResultContext);

  const semgrepFound = result?.semantic_grep.findings.map((finding) => {
    const found = finding.metadata;

    return {
      id: found.id + found.description,
      vulId: found.id,
      severity: found.severity,
      desc: found.description,
    };
  });

  const slitherFound = result?.slither.findings.map((finding) => {
    const found = finding.metadata;

    return {
      id: found.id + found.description,
      vulId: found.id,
      severity: found.severity,
      desc: found.description,
    };
  });

  const mythrilFound = result?.mythril.findings.map((finding) => {
    const found = finding.metadata;

    return {
      id: found.id + found.description,
      vulId: found.id,
      severity: found.severity,
      desc: found.description,
    };
  });

  const founds = [semgrepFound, slitherFound, mythrilFound];

  const [summary, setSummary] = useState(semgrepFound);
  const [tool, setTool] = useState(TOOL[0]);

  return (
    <Box className="result-summary">
      <Typography className="result-summary__title">Bảng tổng kết</Typography>
      <Box className="result-summary__content">
        <Box className="result-summary__chart">
          <PieChart
            series={[
              {
                data: [
                  {
                    id: "semgrepFound",
                    value: semgrepFound?.length as number,
                    label: "So1Scan",
                    color: "#00a4f4",
                  },
                  {
                    id: "slitherFound",
                    value: slitherFound?.length as number,
                    label: "Slither",
                    color: "#ad1f2c",
                  },
                  {
                    id: "mythrilFound",
                    value: mythrilFound?.length as number,
                    label: "Mythril",
                    color: "#2c56dd",
                  },
                ],
                innerRadius: 40,
                outerRadius: 120,
                paddingAngle: 2,
                cornerRadius: 4,
                cx: 150,
                cy: 150,
                highlightScope: { faded: "global", highlighted: "item" },
                arcLabel: (item) => `${item.label} (${item.value})`,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              },
            }}
            onItemClick={(_, d) => {
              setSummary(founds[d.dataIndex]);
              setTool(TOOL[d.dataIndex]);
            }}
            height={300}
          />
        </Box>

        <Box className="result-summary__result">
          <Typography className={`title title--${tool.toLowerCase()}`}>
            {tool}
          </Typography>

          <Box className="result-summary__list">
            {summary?.map((sum) => {
              return (
                <Box
                  key={sum.id}
                  className={`result-summary__item result-summary__item--${tool.toLowerCase()}`}
                >
                  <Box className="title">
                    {sum.severity.toLowerCase() === "warning" ? (
                      <span style={{ fontSize: "1.4rem" }}>⚠️</span>
                    ) : (
                      <Severity type={sum.severity.toLowerCase()} />
                    )}
                    <Typography className="title__id">{sum.vulId}</Typography>
                  </Box>
                  <Typography className="desc">{sum.desc}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResultSummary;
