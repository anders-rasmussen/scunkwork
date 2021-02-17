import React from "react";
import { NetworkVisualization } from "./NetworkVisualization";
import { NetworkControl, NetworkNode } from "./NetworkControl";
import styled from "styled-components";

const StyledDependencyApp = styled.div`
  height: 100vh;
  width: 100%;
`;

/**
 * Single page app for showing dependencies for a model
 */
export const DependencyApp = () => {
  const dependencies: NetworkNode[] = [
    {
      // 0
      label: "v1",
      group: "var",
      connections: [3, 4],
    },
    {
      // 1
      label: "v2",
      group: "var",
      connections: [3, 4, 5],
    },
    {
      // 2
      label: "v3",
      group: "var",
      connections: [3, 5],
    },
    {
      // 3
      label: "r1",
      group: "rule",
      connections: [0, 1, 2],
    },
    {
      // 4
      label: "r2",
      group: "rule",
      connections: [0, 1],
    },
    {
      //5
      label: "r3",
      group: "rule",
      connections: [1, 2],
    },
  ];

  const myControl = new NetworkControl(dependencies, [0]);

  return (
    <StyledDependencyApp>
      <NetworkVisualization control={myControl} />
    </StyledDependencyApp>
  );
};
