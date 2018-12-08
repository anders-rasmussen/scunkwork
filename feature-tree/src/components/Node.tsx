import * as React from 'react';
import Connection from './Connection'
import Constants, { NodeStyle, OpenNodeStyle } from './Constants';
import { node } from 'prop-types';

export interface NodeData {
  values: number[],
  children: NodeData[],
  gridRow: number
}

interface NodeProps {
  variables: [{
    id: string,
    domain: string[]
  }],
  node: NodeData,
  varIdx: number
}

/**
 * A node will in the grid. This is both root of tree and child nodes
 */
export default class Node extends React.Component<NodeProps> {

  keyForNode(node: NodeData): string {
    return (this.props.varIdx + 1) + '_' + node.gridRow;
  };

  keyForConnection(node: NodeData): string {
    return this.props.varIdx + 1 + '_' + node.gridRow;
  };

  render() {
    const cellCenterX = (this.props.varIdx + 1.5) * Constants.gridCellWidth;
    const cellCenterY = (this.props.node.gridRow + 0.5) * Constants.gridCellHeight;
    // String to display within node
    const valuesString = this.props.varIdx < 0 ?
      '' :
      this.props.node.values.map((v) => this.props.variables[this.props.varIdx].domain[v]).join(',');

    const childNodes = this.props.node.children.map((childNode, idx) =>
      <Node
        variables={this.props.variables}
        node={childNode}
        varIdx={this.props.varIdx + 1}
        key={this.keyForNode(childNode)}
      />);

    const connections = this.props.node.children.map((childNode) =>
      <Connection
        parentCol={this.props.varIdx + 1}
        parentRow={this.props.node.gridRow}
        childCol={this.props.varIdx + 2}
        childRow={childNode.gridRow}
        key={this.keyForConnection(childNode)} />
    );

    const thisNode =
      (this.props.varIdx < 0 || this.props.node.values.length === 0) ?
        // Root and "all value" are rendered as simple circle
        <><circle cx={cellCenterX} cy={cellCenterY} {...OpenNodeStyle} /></> :
        // Normal nodes are rectangles with text
        <>
          <rect
            x={cellCenterX - NodeStyle.width / 2}
            y={cellCenterY - NodeStyle.height / 2}
            {...NodeStyle} />
          <text
            x={cellCenterX}
            y={cellCenterY}
            textAnchor="middle"
            dominantBaseline="central">
            {valuesString}
          </text>
        </>;

    return (
      <>
        {connections}
        {thisNode}
        {childNodes}
      </>);
  }
}
