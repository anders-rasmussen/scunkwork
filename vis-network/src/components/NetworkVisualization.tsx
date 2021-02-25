import React, { useEffect, useRef } from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Network } from "vis-network/standalone/esm/vis-network";

import NetworkControl from "./NetworkControl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      overflow: "auto",
    },
  })
);

type NetworkVisualizationProps = {
  control: NetworkControl;
};

/**
 * Dependency graph showing all dependencies in a network
 */
export default function NetworkVisualization({
  control,
}: NetworkVisualizationProps) {
  // A reference to the div rendered by this component
  const domNode = useRef<HTMLDivElement>(null);

  // A reference to the vis network instance
  const network = useRef<Network | null>(null);

  // Event method called when a node is chosen
  var changeChosenNodeShadow = function (values: any) {
    values.shadow = true;
    values.shadowSize = 20;
    values.borderWidth = 6;
  };

  useEffect(() => {
    // Called on double click in network
    const onDoubleclick = (params: any) => {
      let nodeId = network.current?.getNodeAt(params.pointer.DOM);
      if (nodeId !== undefined && network.current) {
        network.current.unselectAll();
        control.expandNodeConnections(nodeId);
      }
    };

    // Called on right-click in network
    const onContext = (params: any) => {
      // Do not call the default pop-up
      params.event.preventDefault();
    };

    var options = {
      clickToUse: false,
      interaction: {
        hover: true,
        multiselect: true,
        selectConnectedEdges: false,
      },
      nodes: {
        chosen: { label: false, node: changeChosenNodeShadow },
        size: 15,
        borderWidth: 3,
      },
      edges: {
        selectionWidth: 4,
        hoverWidth: 4,
        color: "#2B7CE9",
      },

      groups: {
        var: {
          color: { background: "#D2E5FF", border: "#2B7CE9" },
          shape: "dot",
        },
        rule: {
          color: { background: "#AABBCC", border: "#334455" },
          shape: "hexagon",
        },
        cluster: {
          color: { background: "#5e926f", border: "#196432" },
          shape: "square",
        },
        // Incomplete variable (has connections to non-shown nodes)
        vari: {
          color: { background: "#D2E5FF", border: "#b4d0f7" },
          shape: "dot",
        },
        // Incomplete rule (has connections to non-shown nodes)
        rulei: {
          color: { background: "#AABBCC", border: "#848e99" },
          shape: "hexagon",
        },
      },
    };

    if (domNode.current) {
      network.current = new Network(
        domNode.current,
        control.networkData,
        options
      );

      network.current.on("doubleClick", onDoubleclick);
      network.current.on("oncontext", onContext);

      // Pass the network to the control, to handle interaction
      control.setNetwork(network.current);
    }
    // Only re-run the effect when the domNode or the network changes
  }, [control]);

  const classes = useStyles();

  return <div className={classes.root} ref={domNode}></div>;
}
