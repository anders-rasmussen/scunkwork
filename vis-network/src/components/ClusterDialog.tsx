import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import NetworkControl from "./NetworkControl";

type ClusterDialogProps = {
  isOpen: boolean;
  control: NetworkControl;
};

/**
 * Dialog controlling how to create a cluster
 */
export default function ClusterDialog({ isOpen, control }: ClusterDialogProps) {
  const defaultClusterId = "";

  const [open, setOpen] = React.useState(isOpen);
  const [clusterId, setClusterId] = React.useState(defaultClusterId);

  // Update state when props changes
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  const createCluster = () => {
    setOpen(false);
    control.clusterSelected(clusterId);
  };

  const onKeyDown = (params: any) => {
    if (params.keyCode === 13) {
      createCluster();
      params.preventDefault();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Cluster Selected Nodes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A cluster is a special node, which contains other nodes (variables or
          rules) in the network. Any connection from nodes outside the cluster
          to a node inside the cluster will appear as a connection to the
          cluster.
        </DialogContentText>
        <TextField
          autoFocus
          required
          id="outlined-required"
          label="Cluster ID"
          defaultValue={defaultClusterId}
          variant="outlined"
          margin="dense"
          fullWidth
          onChange={(e) => setClusterId(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={createCluster}
          color="primary"
          disabled={clusterId.length === 0}
        >
          Cluster Selected
        </Button>
      </DialogActions>
    </Dialog>
  );
}
