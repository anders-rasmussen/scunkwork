import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  makeStyles,
  createStyles,
  Theme,
  fade,
} from "@material-ui/core/styles";

import NetworkControl, { NetworkNode } from "./NetworkControl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputRoot: {
      width: 200,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      color: theme.palette.common.white,
    },
  })
);

type SelectElementProps = {
  control: NetworkControl;
};

/**
 * Component for adding a new element or finding an existing element in network
 */
export default function SelectElement({ control }: SelectElementProps) {
  const classes = useStyles();

  const [renderKey, setRenderKey] = useState(0);

  return (
    <Autocomplete
      id="add-or-find"
      options={Array.from(control.nodes)}
      groupBy={(option) => (option.group === "var" ? "Variables" : "Rules")}
      classes={classes}
      autoHighlight
      getOptionLabel={(option) => option.label}
      size="small"
      noOptionsText="No match in model"
      clearOnEscape
      key={renderKey}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Element"
          variant="outlined"
        />
      )}
      onChange={(event: any, option: NetworkNode | null) => {
        if (option) {
          control.selectElement(option.id);
        }
        // OK - this is a hack ;-)
        // There is no way to clear the value or the input value of an Autocomplete.
        // So - by changing the key, we force the UI component to re-render, thus clearing
        // both value and inputValue
        setRenderKey(renderKey + 1);
      }}
    />
  );
}
