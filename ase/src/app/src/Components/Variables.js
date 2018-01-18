import React from "react";
import { connect } from "react-redux";

import Paper from "material-ui/Paper";
import { withStyles } from "material-ui/styles";

import { EditingState } from "@devexpress/dx-react-grid";

import { VariablesCommand } from "./VariablesCommands";

import {
  TableEditRow,
  TableEditColumn,
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";

import PropTypes from "prop-types";

import { requestVariables, variablesStateAction } from "../store/currentModel";

const styles = theme => ({
  variables: {
    margin: 30
  }
});

class Variables extends React.Component {
  componentDidMount() {
    const { variables, currentModel } = this.props;
    if (!variables || variables.length === 0) {
      const { requestVariables } = this.props;
      requestVariables(currentModel);
    }
  }

  commitChanges({ added, changed, deleted }) {
    if (added) {
      // const startingAddedId =
      //   variables.length - 1 > 0 ? variables[variables.length - 1].id + 1 : 0;
      // rows = [
      //   ...rows,
      //   ...added.map((row, index) => ({
      //     id: startingAddedId + index,
      //     ...row
      //   }))
      // ];
    }
    if (changed) {
      // rows = rows.map(
      //   row => (changed[row.id] ? { ...row, ...changed[row.id] } : row)
      // );
    }
    if (deleted) {
      // const deletedSet = new Set(deleted);
      // rows = rows.filter(row => !deletedSet.has(row.id));
    }
  }

  render() {
    let {
      variables,
      variablesState,
      classes,
      changeEditingRowIds,
      changeRowChanges,
      changeAddedRows
    } = this.props;

    variables = variables || [];

    const presentDomain = variable => {
      switch (variable.type) {
        case "Boolean":
          return "true / false";
        case "String":
          return variable.domain
            ? variable.domain.reduce((acc, cur) => acc + ", " + cur)
            : "String";
        default:
          return "";
      }
    };

    return (
      <Paper className={classes.variables}>
        <Grid
          rows={variables}
          columns={[
            { name: "type", title: "Type" },
            { name: "id", title: "ID" },
            { name: "domain", title: "Domain", getCellValue: presentDomain }
          ]}
          getRowId={v => v.guid}
        >
          <EditingState
            editingRowIds={
              (variablesState && variablesState.editingRowIds) || []
            }
            onEditingRowIdsChange={changeEditingRowIds}
            rowChanges={(variablesState && variablesState.rowChanges) || {}}
            onRowChangesChange={changeRowChanges}
            addedRows={(variablesState && variablesState.addedRows) || []}
            onAddedRowsChange={changeAddedRows}
            onCommitChanges={this.commitChanges}
          />
          <Table />
          <TableHeaderRow />
          <TableEditRow />
          <TableEditColumn
            showAddCommand={false}
            showEditCommand
            showDeleteCommand
            commandComponent={VariablesCommand}
          />
        </Grid>
      </Paper>
    );
  }
}

Variables.propTypes = {
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      guid: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["String", "Boolean"]).isRequired,
      domain: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ),
  editState: PropTypes.shape({
    editingRowIds: PropTypes.arrayOf(PropTypes.string)
  })
};

const mapDispatchToProps = dispatch => ({
  requestVariables: modelGuid => dispatch(requestVariables(modelGuid)),
  changeEditingRowIds: editingRowIds =>
    dispatch(variablesStateAction("editingRowIds", editingRowIds)),
  changeRowChanges: rowChanges =>
    dispatch(variablesStateAction("rowChanges", rowChanges)),
  changeAddedRoes: addedRows =>
    dispatch(variablesStateAction("addedRoes", addedRows))
});

const mapStoreToProps = store => ({
  ...store.currentModel
});

Variables = connect(mapStoreToProps, mapDispatchToProps)(Variables);

Variables = withStyles(styles)(Variables);

export default Variables;
