import React from "react";
import PropTypes from "prop-types";
import AddIcon from "material-ui-icons/AddCircle";
import { MenuList, MenuItem } from "material-ui/Menu";
import EnumTypeIcon from "material-ui-icons/Menu";
import StringTypeIcon from "material-ui-icons/ModeEdit";
import NumberTypeIcon from "material-ui-icons/Exposure";
import DateTimeTypeIcon from "material-ui-icons/Schedule";
import BooleanTypeIcon from "material-ui-icons/Memory";

const AddVariableButton = ({ onAddVariable }) => (
  <div className="add-variable-button">
    <MenuList>
      <MenuItem
        primaryText="Add Enumerated String Variable"
        onClick={() => onAddVariable("Enum")}
        leftIcon={<EnumTypeIcon />}
      />
      <MenuItem
        primaryText="Add String Variable"
        leftIcon={<StringTypeIcon />}
      />
      <MenuItem
        primaryText="Add Number Variable"
        leftIcon={<NumberTypeIcon />}
      />
      <MenuItem
        primaryText="Add Boolean Variable"
        leftIcon={<BooleanTypeIcon />}
      />
      <MenuItem
        primaryText="Add Date-Time Variable"
        leftIcon={<DateTimeTypeIcon />}
      />
    </MenuList>
  </div>
);

AddVariableButton.propTypes = {
  onAddVariable: PropTypes.func.isRequired
};

export default AddVariableButton;
