// Constants used to define general layout of tree
// Tree is divided into a grid of columns and rows.
// Each node occupy one cell in this grid
const Constants = {
  // Dimensions of grid
  gridCellWidth: 160,
  gridCellHeight: 50,
};

// How to render normal nodes
const NodeStyle = {
  stroke: '#3F3F3F',
  strokeWidth: '2',
  fill: '#FFFFFF',
  width: 130,
  height: 40,
  rx: 5,
  ry: 5
};

// How to render root + open nodes
const OpenNodeStyle = {
  stroke: '#3F3F3F',
  strokeWidth: 4,
  fill: '#FFFFFF',
  r: 13
}

// How to render header text in column
const ColumnHeaderStyle = {
  textDecoration: 'underline',
}

// How to render odd variable columns
const VarColumnStyleOdd = {
  fill: '#F2F2F2'
}

// How to render even variable columns
const VarColumnStyleEven = {
  fill: 'white'
}

// How to render connections between nodes
const ConnectorStyle = {
  stroke: '#3F3F3F',
}

export default Constants;
export {
  NodeStyle,
  OpenNodeStyle,
  ConnectorStyle,
  VarColumnStyleEven,
  VarColumnStyleOdd,
  ColumnHeaderStyle
}
