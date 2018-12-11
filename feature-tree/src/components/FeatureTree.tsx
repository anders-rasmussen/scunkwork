import React from "react";
import { NodeData } from "./Node";
import GridCell from './GridCell'
import GridColumn from "./GridColumn";

// Definition of a solution space
interface SolutionTreeData {
  variables: [{
    id: string,
    domain: string[]
  }],
  root: NodeData,
  totalRows?: number
}

interface FeatureTreeState {
  expandedTree: SolutionTreeData
}

/**
 * Visualization of a solution space as a feature tree
 */
export default class SolutionTree extends React.Component<SolutionTreeData, FeatureTreeState> {
  constructor(props: SolutionTreeData) {
    super(props);

    this.state = {
      expandedTree: this.expandTree(this.props.variables, this.props.root)
    }
  }

  // Expand a solution tree, such that each node contains
  // the grid row on which is to be entered
  expandTree(
    variables: [{
      id: string,
      domain: string[]
    }],
    root: NodeData,
    totalRows?: number): SolutionTreeData {

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

  updateRoot(root?: NodeData) {
    // // Root is undefined, if all nodes are deleted. Insert "TRUE"
    if (!root) {
      let node: NodeData | undefined = undefined, i = this.props.variables.length;
      for (; i >= 0; i--) {
        let children: NodeData[] = node === undefined ? [] : [node];
        node = {
          values: [],
          children: children,
          gridRow: 1
        }
      }

      root = node;
    }

    // Root is updated, re-expand tree with new root
    const expandedTree = this.expandTree(
      this.state.expandedTree.variables,
      root || this.props.root);

    this.setState({ expandedTree: expandedTree });
  }

  render() {
    let { variables, root, totalRows } = this.state.expandedTree;

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
        {<GridCell
          variables={variables}
          gridCol={0}
          node={root}
          updateNodeFunc={root => this.updateRoot(root)} />}
      </svg >
    )
  }
}
