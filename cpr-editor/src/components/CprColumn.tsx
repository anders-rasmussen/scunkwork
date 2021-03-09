import React, { PureComponent } from 'react'
import styled from 'styled-components';

export interface CprColumnHeaderProps {
  colIdx: number
};

const StyledCprColumnHeader = styled.div`
  display:grid;
  grid-column-gap: thin;
  grid-template-columns: 1em 1em 1em 1em;
`;

const StyledHeaderValue = styled.div`
  writing-mode: vertical-lr;
  text-valign:center;
  transform:rotate(180deg);
`;

export default class CprColumnHeader extends PureComponent<CprColumnHeaderProps> {
  constructor(props: CprColumnHeaderProps) {
    super(props);

    this.state = {
    };
  }

  headerValue(valIdx: number): JSX.Element {
    return <StyledHeaderValue key={valIdx}>Column.Value{valIdx}</StyledHeaderValue>;
  }

  render() {

    let values = [...Array(4)].map((_, i) => this.headerValue(i));

    return (
      <StyledCprColumnHeader>
        {values}
      </StyledCprColumnHeader>
    );
  }
}
