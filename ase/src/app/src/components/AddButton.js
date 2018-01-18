import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import Tooltip from "material-ui/Tooltip";

import { newModel } from "../store/models";
import { View } from "../store/constants";

const styles = theme => ({
  button: {
    // margin: theme.spacing.unit
    margin: 0,
    top: "auto",
    right: 30,
    bottom: 20,
    left: "auto",
    position: "fixed"
  }
});

let AddButton = ({ currentView, newModel, classes }) => {
  var onClick = () => {};
  var disabled = true;
  var toolTip = "";

  switch (currentView) {
    case View.MODELS:
      onClick = newModel;
      disabled = false;
      toolTip = "Add new model";
      break;
    default:
  }

  return (
    <Tooltip id="tooltip" title={toolTip}>
      <Button
        variant="fab"
        color="secondary"
        aria-label="add"
        className={classes.button}
        disabled={disabled}
        onClick={() => onClick()}
      >
        <AddIcon />
      </Button>
    </Tooltip>
  );
};

AddButton.propTypes = {
  currentView: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  newModel: () => dispatch(newModel())
});

AddButton = connect(state => state.application, mapDispatchToProps)(AddButton);

AddButton = withStyles(styles)(AddButton);

export default AddButton;
