import React from "react";
import PropTypes from "prop-types";
import EnumValues from "./EnumValues";
import classnames from "class-names";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import ActionDelete from "material-ui-icons/Menu";

// Icons for
import EnumTypeIcon from "material-ui-icons/Menu";
import StringTypeIcon from "material-ui-icons/ModeEdit";
import NumberTypeIcon from "material-ui-icons/Exposure";
import DateTimeTypeIcon from "material-ui-icons/Schedule";
import BooleanTypeIcon from "material-ui-icons/Memory";

const VariableEditor = ({
  variable,
  varIdx,
  onVariableChange,
  onVariableDelete
}) => {
  // Called when values are updated in EnumValues
  const updateValues = values => {
    const updated = {
      id: variable.id,
      description: variable.description,
      type: variable.type,
      domain: values
    };

    onVariableChange(updated);
  };

  // Called when ID is updated
  const updateId = event => {
    const id = event.target.value;
    const newVar = {
      id: id,
      description: variable.description,
      type: variable.type,
      domain: variable.domain
    };

    onVariableChange(newVar);
  };

  // Called when description is updated
  const updateDescription = event => {
    const description = event.target.value;
    const newVar = {
      id: variable.id,
      description: description ? description : undefined,
      type: variable.type,
      domain: variable.domain
    };

    onVariableChange(newVar);
  };

  const className = classnames("variable-editor", {
    "variable-editor__error": !variable.id || variable.domain.length === 0
  });

  const styles = {
    smallIcon: {
      width: 20,
      height: 20
    },
    small: {
      width: 50,
      height: 50
    }
  };

  const iconForType = (type, domain) => {
    const style = { padding: 12 };
    switch (type) {
      case "string":
        return domain ? (
          <EnumTypeIcon style={style} />
        ) : (
          <StringTypeIcon style={style} />
        );
      case "bool":
        return <BooleanTypeIcon style={style} />;
      case "number":
        return <NumberTypeIcon style={style} />;
      case "dateTime":
        return <DateTimeTypeIcon style={style} />;
      default:
        return undefined;
    }
  };

  return (
    <div className={className}>
      {iconForType(variable.type, variable.domain)}
      <TextField
        hintText="Enter ID of variable"
        type="text"
        value={variable.id}
        onChange={updateId}
      />
      <TextField
        hintText="Optional description of variable"
        type="text"
        value={variable.description}
        onChange={updateDescription}
        fullWidth={true}
      />
      <IconButton
        tooltip="Delete variable"
        iconStyle={styles.smallIcon}
        style={styles.small}
        touch={true}
        onClick={onVariableDelete}
      >
        <ActionDelete />
      </IconButton>
      <div className="enum-values">
        <EnumValues values={variable.domain} onValuesChange={updateValues} />
      </div>
      <style jsx>{`
        .variable-editor {
          padding: 5px;
          border-radius: 6px;
          display: grid;
          grid-template-columns: 50px 300px 1fr 50px;
          grid-template-rows: 1fr 1fr;
        }
        .variable-editor__error {
          border: 1px solid red;
        }
        .enum-values {
          grid-column-start: 2;
          grid-column-end: 4;
        }
      `}</style>
    </div>
  );
};

VariableEditor.propTypes = {
  variable: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["string"]).isRequired,
    domain: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  varIdx: PropTypes.number.isRequired,
  onVariableChange: PropTypes.func.isRequired,
  onVariableDelete: PropTypes.func.isRequired
};

export default VariableEditor;
