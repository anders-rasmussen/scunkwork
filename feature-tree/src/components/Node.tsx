import * as React from 'react';
import Constants, { NodeStyle, OpenNodeStyle } from './Constants';

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
  gridCol: number
}

/**
 * A node in a grid cell. This can both be the root,
 * a normal node or a "any-value" node
 */
export default class Node extends React.Component<NodeProps> {

  render() {
    const varIdx = this.props.gridCol - 1;
    const cellCenterX = (this.props.gridCol + 0.5) * Constants.gridCellWidth;
    const cellCenterY = (this.props.node.gridRow + 0.5) * Constants.gridCellHeight;
    // String to display within node
    const valuesString = this.props.gridCol === 0 ?
      '' :
      this.props.node.values.map((v) => this.props.variables[varIdx].domain[v]).join(',');

    return (
      (this.props.gridCol === 0 || this.props.node.values.length === 0) ?
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
        </>
    );
  }
}
