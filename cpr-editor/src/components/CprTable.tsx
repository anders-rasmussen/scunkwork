import * as React from 'react';
import styled from 'styled-components';

import CprColumnHeader from 'components/CprColumn';
import CprRow from 'components/CprRow';

export interface CprTableProps {
  variables: {
    id: string
  }[]
}

const StyledCprTable = styled.div`
  border-style: solid;
  border-width:1px;
  display:inline-grid;
  grid-column-gap: 0.3em;
  grid-row-gap:0.2em;
  grid-template-columns: auto auto auto auto;
  padding:0.3em;
  font-family: "Consolas", "Lucida Console", monospace;
  font-size:16px;
`;

export default class CprTable extends React.Component<CprTableProps> {
  constructor(props: CprTableProps) {
    super(props);

    this.state = {
    };
  }

  render() {

    let header = this.props.variables.map((v, i) =>
      <CprColumnHeader key={'col' + i} colIdx={i} />);

    let rows = [...Array(10)].map((_, i) =>
      <CprRow rowIdx={i} key={'row' + i} />
    );

    return (
      <StyledCprTable>
        {header}
        {rows}
      </StyledCprTable>

    );
  }
}