import React, { useEffect, useRef } from "react";

import styled from "styled-components";
import { Network } from "vis-network/standalone/esm/vis-network";

import { NetworkControl } from "./NetworkControl";
import { MenuBar } from "./MenuBar";

const StyledNetworkVisualization = styled.div`
  height: calc(100% - 40px);
  width: 100%;
`;

type NetworkVisualizationProps = {
  control: NetworkControl;
};

/**
 * Dependency graph showing all dependencies in a network
 */
export const NetworkVisualization = ({
  control,
}: NetworkVisualizationProps) => {
  // A reference to the div rendered by this component
  const domNode = useRef<HTMLDivElement>(null);

  // A reference to the vis network instance
  const network = useRef<Network | null>(null);

  // Event method called when a node is chosen
  var changeChosenNodeShadow = function (values: any) {
    values.shadow = true;
    values.shadowSize = 20;
  };

  useEffect(() => {
    var options = {
      clickToUse: false,
      interaction: { hover: true, multiselect: true },
      nodes: {
        chosen: { label: false, node: changeChosenNodeShadow },
        size: 15,
        borderWidth: 3,
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

      network.current.on("doubleClick", function (params) {
        let nodeId = network.current?.getNodeAt(params.pointer.DOM);
        if (nodeId !== undefined && network.current) {
          var nodeNumber = parseInt(nodeId.toString());
          network.current.stopSimulation();
          control.expandNodeConnections(nodeNumber);
          network.current.startSimulation();
          network.current.unselectAll();
        }
      });
    }
    // Only re-run the effect when the domNode or the network changes
  }, [domNode, network, control]);

  const onRedraw = () => {
    if (!network.current) {
      return;
    }
    network.current.stopSimulation();
    control.ReAddAll();
    network.current.setData(control.networkData);
    network.current.startSimulation();
  };

  const onFit = () => {
    network.current?.fit();
  };

  return (
    <>
      <MenuBar onRedraw={onRedraw} onFit={onFit} />
      <StyledNetworkVisualization ref={domNode} />
    </>
  );
};
