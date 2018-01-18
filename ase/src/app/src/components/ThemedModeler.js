import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import { withStyles } from "material-ui/styles";

import Modeler from "./Modeler";
import { Themes } from "../store/constants";

const styles = theme => ({
  themedModeler: {
    height: "100%"
  }
});

/**
 * Modeler which uses the Material-UI theme
 */
let ThemedModeler = ({ theme, classes }) => {
  const muiTheme = createMuiTheme({
    palette: {
      type: theme === Themes.LIGHT_THEME ? "light" : "dark"
    }
  });

  return (
    <div className={classes.themedModeler}>
      <MuiThemeProvider theme={muiTheme}>
        <Modeler />
      </MuiThemeProvider>
    </div>
  );
};

ThemedModeler.propTypes = {
  theme: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

ThemedModeler = connect(state => state.application)(ThemedModeler);

ThemedModeler = withStyles(styles)(ThemedModeler);

export default ThemedModeler;
