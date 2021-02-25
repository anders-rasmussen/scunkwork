import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import MenuIcon from "@material-ui/icons/Menu";
import RefeshIcon from "@material-ui/icons/Refresh";
import FitIcon from "@material-ui/icons/AspectRatio";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import DeleteIconAll from "@material-ui/icons/DeleteSweepOutlined";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import AddAllIcon from "@material-ui/icons/BlurOn";
import ClusterIcon from "@material-ui/icons/DynamicFeed";

import NetworkControl from "./NetworkControl";
import ClusterDialog from "./ClusterDialog";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
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

const StyledIconButton = withStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
  },
}))(IconButton);

type MainMenuProps = {
  control: NetworkControl;
};

/**
 * Top menu representing drop-down with all menu points in top base
 */
export default function MainMenu({ control }: MainMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [numberOfSelectedNodes, setNumberOfSelectedNodes] = useState(0);
  const [showClusterDialog, setShowClusterDialog] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowClusterDialog(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onEnter = () => {
    setNumberOfSelectedNodes(control.numberOfSelectedNodes());
  };

  const onClusterSelected = () => {
    setShowClusterDialog(true);
  };

  return (
    <>
      <ClusterDialog isOpen={showClusterDialog} control={control} />

      <div>
        <StyledIconButton
          aria-controls="customized-menu"
          aria-haspopup="true"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleClick}
        >
          <MenuIcon />
        </StyledIconButton>

        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onEnter={onEnter}
        >
          <StyledMenuItem
            onClick={() => {
              handleClose();
              control.redraw();
            }}
          >
            <ListItemIcon>
              <RefeshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Redraw Network" />
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              handleClose();
              control.fitToWindow();
            }}
          >
            <ListItemIcon>
              <FitIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Fit To Window" />
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              handleClose();
              control.addAll();
            }}
          >
            <ListItemIcon>
              <AddAllIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Add All" />
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              handleClose();
              control.deleteSelected();
            }}
            disabled={numberOfSelectedNodes === 0}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete Selected Nodes" />
          </StyledMenuItem>

          <StyledMenuItem
            onClick={() => {
              handleClose();
              control.addAll();
            }}
          >
            <ListItemIcon>
              <AddAllIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Add All" />
          </StyledMenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              onClusterSelected();
            }}
            disabled={numberOfSelectedNodes < 2}
          >
            <ListItemIcon>
              <ClusterIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cluster Selected Nodes" />
          </MenuItem>

          <StyledMenuItem
            onClick={() => {
              handleClose();
              control.deleteAll();
            }}
          >
            <ListItemIcon>
              <DeleteIconAll fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete All Nodes" />
          </StyledMenuItem>

          <StyledMenuItem>
            <ListItemIcon>
              <SaveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Save SVG" />
          </StyledMenuItem>
        </StyledMenu>
      </div>
    </>
  );
}
