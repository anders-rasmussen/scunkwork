import React from "react";
import { WithContext as ReactTags } from "react-tag-input";
import "./EnumValues.css";
import PropTypes from "prop-types";

// Render enum values in domain of an enumerated string variable
const EnumValues = ({ values, onValuesChange }) => {
  const handleValueDelete = (idx, values, onValuesChange) => {
    values.splice(idx, 1);
    onValuesChange(values);
  };

  const handleValueAdd = (value, values, onValuesChange) => {
    const valid =
      value &&
      values.reduce((result, existing) => result && value !== existing, true);
    if (valid) {
      values.push(value);
      onValuesChange(values);
    }
  };

  const handleValueDrag = (currPos, newPos, values, onValuesChange) => {
    const [value] = values.splice(currPos, 1);
    values.splice(newPos, 0, value);

    onValuesChange(values);
  };

  return (
    <div className="enum-values">
      <ReactTags
        tags={values.map((v, idx) => ({
          id: idx + 1,
          text: v
        }))}
        handleDelete={idx => handleValueDelete(idx, values, onValuesChange)}
        handleAddition={value => handleValueAdd(value, values, onValuesChange)}
        handleDrag={(value, currPos, newPos) =>
          handleValueDrag(currPos, newPos, values, onValuesChange)
        }
        placeholder="Add new value"
      />
    </div>
  );
};

EnumValues.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  onValuesChange: PropTypes.func.isRequired
};

export default EnumValues;
