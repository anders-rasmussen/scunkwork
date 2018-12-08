import React from "react";
import Constants, { VarColumnStyleEven, VarColumnStyleOdd, ColumnHeaderStyle } from "./Constants";

interface GridColumnProps {
  variables: [{
    id: string,
    domain: string[]
  }],
  gridCol: number,
  rowCount: number
}

/**
 * Columns in the grid. The first column (index 0) is for root
 * node.
 */
export default class GridColumn extends React.Component<GridColumnProps> {

  render() {
    const style = this.props.gridCol % 2 === 0 ? VarColumnStyleEven : VarColumnStyleOdd;

    const cellCenterX = (this.props.gridCol + 0.5) * Constants.gridCellWidth;
    const cellCenterY = 0.5 * Constants.gridCellHeight;

    return (
      <>
        <rect
          {...style}
          x={this.props.gridCol * Constants.gridCellWidth}
          y={0}
          width={Constants.gridCellWidth}
          height={this.props.rowCount * Constants.gridCellHeight} />
        {this.props.gridCol > 0 &&
          <text
            x={cellCenterX}
            y={cellCenterY}
            textAnchor="middle"
            alignmentBaseline="central"
            {...ColumnHeaderStyle}>
            {this.props.variables[this.props.gridCol - 1].id}
          </text>
        }

      </>
    );
  }
}