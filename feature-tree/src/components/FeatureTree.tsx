import React from "react";
import Node, { NodeData } from "./Node"
import GridColumn from "./GridColumn"

interface SolutionTreeProps {
  variables: [{
    id: string,
    domain: string[]
  }],
  root: NodeData,
  totalRows?: number
}

/**
 * Visualization of a solution space as a feature tree
 */
export default class SolutionTree extends React.Component<SolutionTreeProps> {

  // Expand a solution tree, such that each node contains
  // the grid row on which is to be entered
  expandTree(
    variables: [{
      id: string,
      domain: string[]
    }],
    root: NodeData,
    totalRows?: number): SolutionTreeProps {

    function expandNode(node: NodeData, gridRow?: number): { expanded: NodeData, nextRow: number } {
      gridRow = gridRow || 0;

      const children = node.children || [];
      // A node without any children "uses" 1 row
      let nextRow = children.length === 0 ? gridRow + 1 : gridRow, i = 0;
      let expandedChildren = [];

      // Run through all children, collecting number of rows consumed
      for (i = 0; i < children.length; i++) {
        const expandedNode = expandNode(children[i], nextRow);
        expandedChildren.push(expandedNode.expanded);
        nextRow = expandedNode.nextRow;
      }

      return {
        expanded: {
          values: node.values,
          children: expandedChildren,
          gridRow: gridRow
        },
        nextRow: nextRow
      };
    }

    const expandedTree = expandNode(root, 1);

    return {
      variables: this.props.variables,
      root: expandedTree.expanded,
      totalRows: expandedTree.nextRow
    };
  }

  render() {
    const expandedTree = this.expandTree(this.props.variables, this.props.root);
    let { variables, root, totalRows } = expandedTree;

    let gridColumns = [], i = 0;
    for (i = 0; i < this.props.variables.length + 1; i++) {
      gridColumns.push(<GridColumn
        variables={variables}
        gridCol={i}
        rowCount={totalRows || 0}
        key={"col" + i} />);
    }

    return (
      <svg width={window.innerWidth} height={window.innerHeight} >
        {gridColumns}
        {<Node variables={variables} varIdx={-1} node={root} />}
      </svg >
    )
  }
}
