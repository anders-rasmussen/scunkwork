import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import NetworkVisualization from "./NetworkVisualization";
import NetworkControl, { NetworkNode } from "./NetworkControl";
import TopBar from "./TopBar";

// Roboto font imported directly, so it is not fetched from internet
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
  })
);

/**
 * Single page app for showing dependencies for a model
 */
export const DependencyApp = () => {
  const nodes: NetworkNode[] = [
    {
      id: 0,
      label: "v1",
      group: "var",
      connections: [3, 4],
    },
    {
      id: 1,
      label: "v2",
      group: "var",
      connections: [3, 4, 5],
    },
    {
      id: 2,
      label: "v3",
      group: "var",
      connections: [3, 5],
    },
    {
      id: 3,
      label: "r1",
      group: "rule",
      connections: [0, 1, 2],
    },
    {
      id: 4,
      label: "r2",
      group: "rule",
      connections: [0, 1],
    },
    {
      id: 5,
      label: "r3",
      group: "rule",
      connections: [1, 2],
    },
  ];

  const myControl = new NetworkControl(nodes, [0]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBar control={myControl} />
      <NetworkVisualization control={myControl} />
    </div>
  );
};
