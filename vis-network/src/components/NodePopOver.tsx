import React, { useState, useEffect } from "react";

import Popover from "@material-ui/core/Popover";
import { IdType } from "vis-network/standalone/esm/vis-network";
import { Paper } from "@material-ui/core";

type NodePopOverProps = {
  popOverPosition: { x: number; y: number } | undefined;
  popOverNodeId: IdType | undefined;
};

export default function NodePopOver({
  popOverPosition,
  popOverNodeId,
}: NodePopOverProps) {
  const [position, setPosition] = useState(popOverPosition);
  const [nodeId, setNodeId] = useState(popOverNodeId);

  // Update state when props changes
  useEffect(() => {
    setPosition(popOverPosition);
    setNodeId(popOverNodeId);
  }, [popOverPosition, popOverNodeId]);

  const handleClose = () => {
    setPosition(undefined);
  };

  return (
    // <Popover
    //   id="node-pop-over"
    //   open={Boolean(position) && nodeId !== undefined}
    //   onClose={handleClose}
    //   anchorReference="anchorPosition"
    //   anchorPosition={
    //     position ? { left: position.x, top: position.y } : undefined
    //   }
    // >
    //   My node pop over
    // </Popover>
    <Paper>I'm a piece of paper</Paper>
  );
}
