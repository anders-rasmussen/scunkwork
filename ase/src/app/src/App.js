import React from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";

import ThemedModeler from "./components/ThemedModeler";
import store from "./store/store";

const styles = theme => ({
  app: {
    height: "100%"
  }
});

let App = ({ classes }) => (
  <div className={classes.app}>
    <Provider store={store}>
      <ThemedModeler />
    </Provider>
  </div>
);

App.propTypes = {
  classes: PropTypes.object.isRequired
};

App = withStyles(styles)(App);

export default App;
