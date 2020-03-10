import * as React from 'react';
import Node, { NodeData } from './Node';
import Connection from './Connection';
import Constants from './Constants';
import Menu from './Menu'

interface GridCellProps {
  variables: [{
    id: string,
    domain: string[]
  }],
  node: NodeData,
  gridCol: number,
  updateNodeFunc: { (node?: NodeData): void }
}

/**
 * A grid cell is responsible for handing user interaction, and modifying
 * nodes according to user request.
 * 
 * A GridCell instantiates Node classes for the actual rendering of data
 */
export default class GridCell extends React.Component<GridCellProps> {
  constructor(props: GridCellProps) {
    super(props);

    this.state = {
      showMenu: false
    };
  }

  // Generate react key for node
  keyForNode(node: NodeData): string {
    return (this.props.gridCol) + '_' + node.gridRow;
  };

  // Generate react key for connection
  keyForConnection(node: NodeData): string {
    return (this.props.gridCol + 1) + '_' + node.gridRow;
  };

  // Handler of update of child nodes. Passing in undefined node means node is to be deleted
  updateChild(node: NodeData | undefined, childIdx: number) {
    var children = [...this.props.node.children];
    if (!node) {
      children.splice(childIdx, 1)
    } else {
      children[childIdx] = node;
    }

    // If all children of node are deleted, we delete node
    if (children.length === 0) {
      this.props.updateNodeFunc(undefined);
      return;
    }

    this.props.updateNodeFunc({
      values: this.props.node.values,
      children,
      gridRow: this.props.node.gridRow
    })
  }

  handleClick() {

  }

  render() {
    const x = this.props.gridCol * Constants.gridCellWidth;
    const y = this.props.node.gridRow * Constants.gridCellHeight;

    // Create grid cells for child nodes
    const childNodes = this.props.node.children.map((childNode, idx) =>
      <GridCell
        variables={this.props.variables}
        node={childNode}
        gridCol={this.props.gridCol + 1}
        key={this.keyForNode(childNode)}
        updateNodeFunc={node => { this.updateChild(node, idx) }}
      />);

    // Create connections to child nodes
    const connections = this.props.node.children.map((childNode) =>
      <Connection
        parentCol={this.props.gridCol}
        parentRow={this.props.node.gridRow}
        childCol={this.props.gridCol + 1}
        childRow={childNode.gridRow}
        key={this.keyForConnection(childNode)} />
    );

    return (
      <>
        {connections}
        <Node {...this.props} />
        {childNodes}
        <Menu
          gridCol={this.props.gridCol}
          gridRow={this.props.node.gridRow}
          updateNodeFunc={this.props.updateNodeFunc}
          node={this.props.node} />
      </>
    );
  }
}