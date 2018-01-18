import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import { MenuList, MenuItem } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";
import { withStyles } from "material-ui/styles";
import ModelIcon from "material-ui-icons/VideoLabel";
import CollaborationIcon from "material-ui-icons/People";
import VariableIcon from "material-ui-icons/Dns";
import RuleIcon from "material-ui-icons/LocationSearching";
import MacroIcon from "material-ui-icons/BrightnessHigh";
import AllInOneIcon from "material-ui-icons/SettingsOverscan";
import ThemeIcon from "material-ui-icons/Whatshot";
import AboutIcon from "material-ui-icons/Cake";
import Card from "material-ui/Card";
import { LinearProgress } from "material-ui/Progress";

import { toggleThemeAction, setViewAction } from "../store/application";
import { View, ServerComStatus } from "../store/constants";

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: "relative",
    height: "100%",
    width: drawerWidth
  },
  drawerHeader: {
    height: 64,
    width: drawerWidth
  }
});

let AppDrawer = ({
  currentModel,
  onToggleTheme,
  onSetView,
  serverCom,
  classes
}) => {
  const isCommunicating = serverCom.some(
    s => s.status === ServerComStatus.COMMUNICATING
  );

  return (
    <Drawer
      variant="permanent"
      open={true}
      classes={{
        paper: classes.drawerPaper
      }}
      anchor="left"
    >
      <Card className={classes.drawerHeader} type="default" />
      <Divider />
      <MenuList>
        <MenuItem onClick={() => onSetView(View.MODELS)}>
          <ListItemIcon>
            <ModelIcon />
          </ListItemIcon>
          <ListItemText primary="Models" />
        </MenuItem>
        <MenuItem onClick={() => onSetView(View.COLLABORATION)}>
          <ListItemIcon>
            <CollaborationIcon />
          </ListItemIcon>
          <ListItemText primary="Collaboration" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => onSetView(View.VARIABLES)}
          disabled={!currentModel}
        >
          <ListItemIcon>
            <VariableIcon />
          </ListItemIcon>
          <ListItemText primary="Variables" />
        </MenuItem>
        <MenuItem
          onClick={() => onSetView(View.RULES)}
          disabled={!currentModel}
        >
          <ListItemIcon>
            <RuleIcon />
          </ListItemIcon>
          <ListItemText primary="Rules" />
        </MenuItem>
        <MenuItem
          onClick={() => onSetView(View.RULES)}
          disabled={!currentModel}
        >
          <ListItemIcon>
            <MacroIcon />
          </ListItemIcon>
          <ListItemText primary="Macros" />
        </MenuItem>
        <MenuItem
          onClick={() => alert("menu clicked")}
          disabled={!currentModel}
        >
          <ListItemIcon>
            <AllInOneIcon />
          </ListItemIcon>
          <ListItemText primary="All-in-one" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onToggleTheme()}>
          <ListItemIcon>
            <ThemeIcon />
          </ListItemIcon>
          <ListItemText primary="Switch Theme" />
        </MenuItem>
        <MenuItem onClick={() => alert("menu clicked")}>
          <ListItemIcon>
            <AboutIcon />
          </ListItemIcon>
          <ListItemText primary="About ASE" />
        </MenuItem>
      </MenuList>

      {isCommunicating ? (
        <LinearProgress color="secondary" variant="query" />
      ) : (
        <span />
      )}
    </Drawer>
  );
};

AppDrawer.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  onSetView: PropTypes.func.isRequired,
  serverCom: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  onToggleTheme: () => dispatch(toggleThemeAction),
  onSetView: view => dispatch(setViewAction(view))
});

const mapStoreToProps = store => ({
  ...store.application,
  ...store.currentModel,
  ...store.models
});

AppDrawer = connect(mapStoreToProps, mapDispatchToProps)(AppDrawer);

AppDrawer = withStyles(styles)(AppDrawer);

export default AppDrawer;
