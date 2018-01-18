import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withStyles } from "material-ui/styles";

import { requestModels, copyModel, deleteModel } from "../store/models";
import Model from "./Model";
import Typography from "material-ui/Typography/Typography";

const styles = theme => ({
  models: {
    display: "flex",
    flexWrap: "wrap"
  },
  headline: {
    display: "flex",
    width: "100%",
    margin: 10
  }
});

class Models extends React.Component {
  componentDidMount() {
    const { models } = this.props;
    if (!models || models.length === 0) {
      const { requestModels } = this.props;
      requestModels();
    }
  }

  render() {
    const {
      models,
      currentModel,
      copyModel,
      deleteModel,
      classes
    } = this.props;

    if (!models || models.length === 0) {
      return (
        <Typography variant="headline">
          Welcome! To get started, click the Add button in the upper right
          corner. Enjoy!
        </Typography>
      );
    }

    // Data fetched - show in grid
    return (
      <div className={classes.models}>
        <div className={classes.headline}>
          <Typography variant="headline">
            {currentModel
              ? `You are currently editing '${
                  models.find(m => m.guid === currentModel).id
                }'`
              : "To start modelling, first select a model."}
          </Typography>
        </div>
        {models.map(model => (
          <Model
            model={model}
            key={model.guid}
            copyModel={() => copyModel(model.guid)}
            deleteModel={() => deleteModel(model.guid)}
          />
        ))}
      </div>
    );
  }
}

Models.propTypes = {
  models: PropTypes.array,
  requestModels: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  copyModel: PropTypes.func.isRequired,
  deleteModel: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  requestModels: () => dispatch(requestModels()),
  copyModel: guid => dispatch(copyModel(guid)),
  deleteModel: guid => dispatch(deleteModel(guid))
});

const mapStoreToProps = store => ({
  ...store.models,
  ...store.currentModel
});

Models = connect(mapStoreToProps, mapDispatchToProps)(Models);

Models = withStyles(styles)(Models);

export default Models;
