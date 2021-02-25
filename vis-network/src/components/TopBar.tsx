import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import NetworkControl from "./NetworkControl";
import MainMenu from "./MainMenu";
import SelectElement from "./SelectElement";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
  })
);

type TopBarProps = {
  control: NetworkControl;
};

export default function TopBar({ control }: TopBarProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <MainMenu control={control} />

          <Typography className={classes.title} variant="h6" noWrap>
            Model Dependency Network
          </Typography>
          <SelectElement control={control} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
