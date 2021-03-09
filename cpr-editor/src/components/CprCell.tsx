import React, { PureComponent } from 'react'
import styled from 'styled-components';

export interface CprCellProps {
  rowIdx: number;
  colIdx: number;
}

const StyledCprCel = styled.div`
  display:grid;
  grid-column-gap: thin;
  grid-template-columns: 1em 1em 1em 1em;
`;

const StyledCprValue = styled.div`
  border-style: solid;
  border-width: thin;
  color:0x778899;
  height:1em;
  width:1em;
  border-radius:0.2em;
`;

export default class CprCell extends PureComponent<CprCellProps> {
  constructor(props: CprCellProps) {
    super(props);

    this.state = {
    };
  }

  render() {

    let values = [...Array(4)].map((_, i) =>
      <StyledCprValue key={`v${this.props.rowIdx}_${this.props.colIdx}_${i}`} />
    );

    return (
      <StyledCprCel>
        {values}
      </StyledCprCel>
    )

  }
}
