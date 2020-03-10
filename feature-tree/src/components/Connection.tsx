import * as React from 'react';
import Constants, { ConnectorStyle } from './Constants'

interface ConnectionProps {
  parentCol: number,
  parentRow: number,
  childCol: number,
  childRow: number
}

/**
 * A connection from one grid cell to another
 */
export default class Connection extends React.Component<ConnectionProps> {
  constructor(props: ConnectionProps) {
    super(props);

    this.points = [
      // From center of child cell
      (props.childCol + 0.5) * Constants.gridCellWidth,
      (props.childRow + 0.5) * Constants.gridCellHeight,
      // To center of cell to the left of child
      (props.childCol - 0.5) * Constants.gridCellWidth,
      (props.childRow + 0.5) * Constants.gridCellHeight
    ]

    // When child is in a row below parent
    if (props.parentRow !== props.childRow) {
      this.points = this.points.concat(
        (props.parentCol + 0.5) * Constants.gridCellWidth,
        (props.parentRow + 0.5) * Constants.gridCellHeight,
      )
    }
  }

  // Points in connection
  points: number[];

  render() {
    return <polyline {...ConnectorStyle} points={this.points.join(',')} fill='none' />
  }
}

