import React, { PureComponent } from 'react'
import CprCell from 'components/CprCell'

export interface CprRowProps {
  rowIdx: number;
}

export default class CprRow extends PureComponent<CprRowProps> {
  constructor(props: CprRowProps) {
    super(props);

    this.state = {
    };
  }

  render() {
    let cells = [...Array(4)].map((_, i) =>
      <CprCell
        rowIdx={this.props.rowIdx}
        colIdx={i}
        key={'cell' + this.props.rowIdx + '_' + i} />
    );

    return (
      cells
    )
  }
}
