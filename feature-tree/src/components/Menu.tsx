import * as React from 'react';
import Constants, { MenuSettings, VarColumnStyleOdd, VarColumnStyleEven } from './Constants';
import MenuButton from './MenuButton';
import { NodeData } from './Node';

interface MenuProps {
  gridCol: number,
  gridRow: number,
  node: NodeData,
  updateNodeFunc: { (node?: NodeData): void }
}

interface MenuState {
  showMenu: boolean
}

/**
 * A menu used when mouse over a node in the grid
 */
export default class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);

    this.state = {
      showMenu: false
    };
  }

  render() {
    const x = this.props.gridCol * Constants.gridCellWidth;
    const y = this.props.gridRow * Constants.gridCellHeight;

    // Figure out max size of each icon
    const iconSize = Math.min(
      (Constants.gridCellWidth - 4 * MenuSettings.menuButtonPadding) / 3,
      (Constants.gridCellHeight - 2 * MenuSettings.menuButtonPadding));

    const xPadding = (Constants.gridCellWidth - 3 * iconSize) / 4;
    const yPadding = (Constants.gridCellHeight - iconSize) / 2;

    const fill = (this.props.gridCol % 2 === 0) ? VarColumnStyleEven.fill : VarColumnStyleOdd.fill;

    return (
      <>
        {this.state.showMenu &&
          <rect
            x={x}
            y={y}
            width={Constants.gridCellWidth}
            height={Constants.gridCellHeight}
            fill={fill} />
        }
        {this.state.showMenu &&
          <MenuButton
            x={x + xPadding}
            y={y + yPadding}
            buttonSize={iconSize}
            icon='bin'
            clickFunc={() => this.props.updateNodeFunc(undefined)} />
        }
        {this.state.showMenu &&
          <MenuButton
            x={x + 2 * xPadding + iconSize}
            y={y + yPadding}
            buttonSize={iconSize}
            icon='values'
            clickFunc={() => this.props.updateNodeFunc(undefined)} />
        }
        {this.state.showMenu &&
          <MenuButton
            x={x + 3 * 2 * xPadding + iconSize}
            y={y + yPadding}
            buttonSize={iconSize}
            icon='addChild'
            clickFunc={() => this.props.updateNodeFunc(undefined)} />
        }
        <rect
          x={x}
          y={y}
          width={Constants.gridCellWidth}
          height={Constants.gridCellHeight}
          onMouseOver={() => this.setState({ showMenu: true })}
          onMouseLeave={() => this.setState({ showMenu: false })}
          fillOpacity={0}
        />

      </>);

  }
}
