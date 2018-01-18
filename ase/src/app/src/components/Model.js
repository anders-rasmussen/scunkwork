import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Card, { CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";

import VariableIcon from "material-ui-icons/Dns";
import RuleIcon from "material-ui-icons/LocationSearching";
import MacroIcon from "material-ui-icons/BrightnessHigh";

import { editModelAction, updateModel } from "../store/models";

import { selectModelAction } from "../store/currentModel";

const styles = theme => ({
  model: {
    margin: 10,
    minWidth: 350,
    maxWidth: 350,
    minHeight: 250
  },
  description: {
    marginTop: 20,
    color: theme.palette.text.secondary
  },
  cardContent: {
    height: "68%"
  },
  modelSize: {
    display: "grid",
    gridTemplateColumns: "10% 20% 70%",
    gridTemplateRows: "20px 20px 20px",
    color: theme.palette.text.primary
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  icon: {
    color: theme.palette.text.secondary,
    width: 16,
    height: 16
  },
  modelId: {
    height: 40
  }
});

/**
 * Presentation of a single model in a card
 */
let Model = ({
  model,
  currentModel,
  copyModel,
  deleteModel,
  editModel,
  updateModel,
  selectModel,
  classes
}) => {
  var show = (
    <CardContent className={classes.cardContent}>
      <Typography
        variant="headline"
        color={model.guid === currentModel ? "secondary" : "primary"}
        className={classes.modelId}
      >
        {model.id}
      </Typography>
      <div className={classes.modelSize}>
        <VariableIcon className={classes.icon} />
        <span>{model.variableCount}</span>
        <span>variables</span>
        <RuleIcon className={classes.icon} />
        <span>{model.ruleCount}</span>
        <span>rules</span>
        <MacroIcon className={classes.icon} />
        <span>{model.macroCount}</span>
        <span>macros</span>
      </div>
      <Typography className={classes.description} component="p">
        {model.description}
      </Typography>
    </CardContent>
  );

  var edit = (
    <CardContent className={classes.cardContent}>
      <TextField
        id="id"
        label="ID"
        className={classes.textField}
        value={model.id}
        onChange={event =>
          editModel(model.guid, event.target.value, model.description)
        }
        margin="normal"
      />
      <TextField
        id="description"
        label="Description"
        multiline
        rowsMax="2"
        value={model.description}
        onChange={event => editModel(model.guid, model.id, event.target.value)}
        className={classes.textField}
        margin="normal"
      />
    </CardContent>
  );

  return (
    <Card className={classes.model} raised={true}>
      {model.editing ? edit : show}
      <CardActions>
        <Button
          size="small"
          color="primary"
          disabled={model.editing || model.guid === currentModel}
          onClick={() => selectModel(model.guid)}
        >
          Select
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() =>
            model.editing
              ? updateModel(model.guid, model.id, model.description)
              : editModel(model.guid, model.id, model.description)
          }
        >
          {model.editing ? "Save" : "Edit"}
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => copyModel()}
          disabled={model.editing}
        >
          Copy
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => deleteModel()}
          disabled={model.editing}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

Model.propTypes = {
  model: PropTypes.shape({
    guid: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    ruleCount: PropTypes.number.isRequired,
    variableCount: PropTypes.number.isRequired,
    macroCount: PropTypes.number.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired,
  copyModel: PropTypes.func.isRequired,
  deleteModel: PropTypes.func.isRequired,
  editModel: PropTypes.func.isRequired,
  updateModel: PropTypes.func.isRequired,
  selectModel: PropTypes.func.isRequired,
  currentModel: PropTypes.string
};

const mapStoreToProps = store => ({
  ...store.currentModel,
  ...store.models
});

const mapDispatchToProps = dispatch => ({
  editModel: (guid, id, description) =>
    dispatch(editModelAction(guid, id, description)),
  updateModel: (guid, id, description) =>
    dispatch(updateModel(guid, id, description)),
  selectModel: guid => dispatch(selectModelAction(guid))
});

Model = withStyles(styles)(Model);

Model = connect(mapStoreToProps, mapDispatchToProps)(Model);

export default Model;
