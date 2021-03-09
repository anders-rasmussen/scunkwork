import React from 'react';
import CprTable, { CprTableProps } from 'components/CprTable'

export default class App extends React.Component {


  render() {
    let data: CprTableProps = {
      variables: [
        { id: 'Var1' },
        { id: 'Var2' },
        { id: 'Var3' },
        { id: 'Var4' },
      ]
    }

    return (<CprTable {...data} />);
  }
}