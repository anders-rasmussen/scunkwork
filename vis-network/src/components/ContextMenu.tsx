import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";

import { IdType } from "vis-network/standalone/esm/vis-network";

import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";

import NetworkControl from "./NetworkControl";

const StyledContextMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

type ContextMenuProps = {
  control: NetworkControl;
  contextMenuPosition: { x: number; y: number } | undefined;
  contextNodeId: IdType | undefined;
};

/**
 * Context menu used when right-clicking on a node
 */
export default function ContextMenu({
  control,
  contextMenuPosition,
  contextNodeId,
}: ContextMenuProps) {
  const [position, setPosition] = useState(contextMenuPosition);
  const [nodeId, setNodeId] = useState(contextNodeId);

  // Update state when props changes
  useEffect(() => {
    setPosition(contextMenuPosition);
    setNodeId(contextNodeId);
  }, [contextMenuPosition, contextNodeId]);

  const handleClose = () => {
    setPosition(undefined);
  };

  return (
    <>
      <StyledContextMenu
        id="context-menu"
        keepMounted
        open={Boolean(position) && nodeId !== undefined}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          position ? { left: position.x, top: position.y } : undefined
        }
      >
        <StyledMenuItem
          onClick={() => {
            handleClose();
            control.deleteNodes(nodeId !== undefined ? [nodeId] : undefined);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete node" />
        </StyledMenuItem>
      </StyledContextMenu>
    </>
  );
}
