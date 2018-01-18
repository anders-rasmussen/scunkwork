import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";

import Toolbar from "material-ui/Toolbar/Toolbar";

import AppDrawer from "./AppDrawer";
import Models from "./Models";
import Variables from "./Variables";
import AddButton from "./AddButton";
import { View } from "../store/constants";

const drawerWidth = 240;

const styles = theme => ({
  modeler: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    position: "absolute",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    padding: theme.spacing.unit * 3,
    height: "calc(100% - 112px)",
    marginTop: 64,
    overflow: "auto"
  },
  flex: {
    flex: 1
  }
});

let Modeler = ({ currentView, classes }) => {
  const getContent = () => {
    switch (currentView) {
      case View.MODELS:
        return <Models />;
      case View.VARIABLES:
        return <Variables />;
      default:
        return (
          <Typography variant="title" color="inherit" noWrap>
            Nothing to see folks, move on..
          </Typography>
        );
    }
  };

  return (
    <div className={classes.modeler}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            noWrap
            className={classes.flex}
          >
            ASE - Anders' Simple Editor
          </Typography>
          <AddButton />
        </Toolbar>
      </AppBar>
      <AppDrawer />
      <main className={classes.content}>{getContent()}</main>
    </div>
  );
};

Modeler.propTypes = {
  currentView: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

Modeler = connect(state => state.application)(Modeler);

Modeler = withStyles(styles)(Modeler);

export default Modeler;
