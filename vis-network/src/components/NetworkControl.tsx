import { DataSet, Data } from "vis-network/standalone/esm/vis-network";

/**
 * Representation of a node in the graph. For most practical purposes, all nodes
 * are the same - it's only the group they belong to, which makes them appear
 * differently.
 */
export type NetworkNode = {
  label: string;
  group: string;
  connections: number[];
};

/**
 * Class which provides control over a DepNetwork.
 * The input is a collection of dependencies, which represents all variable/rule dependencies
 * in a Model.
 *
 * The generated Data object is used by DepNetwork, which is the visualization of the network
 */
export class NetworkControl {
  // All dependencies in model: variables, rules etc.
  private dependencies: NetworkNode[];

  // House keeping of nodes which are shown in network
  private shownInNetwork: Set<number>;

  // Global data object, shared with the VIS network.
  // When this is updated, the networks is automatically re-drawn
  networkData: Data;

  constructor(dependencies: NetworkNode[], showInNetwork: number[]) {
    this.dependencies = dependencies;
    this.shownInNetwork = new Set<number>();

    this.networkData = {
      nodes: new DataSet(),
      edges: new DataSet(),
    };

    showInNetwork.forEach((n) => this.showNodeInNetwork(n));
  }

  /**
   * Expand all nodes which are connected to the given node
   */
  expandNodeConnections(nodeIdx: number) {
    this.dependencies[nodeIdx].connections.forEach((con) =>
      this.showNodeInNetwork(con)
    );
  }

  /**
   * Delete all nodes and edges in the network, and re-add them. This will force
   * the entire network to be layed out again.
   */
  ReAddAll() {
    var shown = this.shownInNetwork;
    this.shownInNetwork = new Set<number>();
    this.networkData = {
      nodes: new DataSet(),
      edges: new DataSet(),
    };

    shown.forEach((n) => this.showNodeInNetwork(n));
  }

  /**
   * Ensure that node is shown in the network, and that all connections to
   * already existing shown nodes are inserted
   * @param nodeIdx Index of node to ad to network
   */
  private showNodeInNetwork(nodeIdx: number) {
    if (this.shownInNetwork.has(nodeIdx)) {
      return;
    }

    this.shownInNetwork.add(nodeIdx);
    let depNode = this.dependencies[nodeIdx];

    this.networkData.nodes.add({
      id: nodeIdx,
      label: depNode.label,
      group: depNode.group,
    });

    depNode.connections
      .filter((con) => this.shownInNetwork.has(con))
      .forEach((con) => {
        this.networkData.edges.add({
          from: nodeIdx < con ? nodeIdx : con,
          to: nodeIdx > con ? nodeIdx : con,
        });
      });

    // Update groups to reflect which nodes are now fully expanded
    this.updateGroupOfNode(nodeIdx);
    depNode.connections.forEach((con) => this.updateGroupOfNode(con));
  }

  /**
   * The group of the node is used to indicate what type of node it is, and if all connections
   * of the node are shown in the graph. This way, the user can see which nodes can be futher
   * expanded
   */
  private updateGroupOfNode(nodeIdx: number) {
    if (!this.shownInNetwork.has(nodeIdx)) {
      return;
    }

    var depNode = this.dependencies[nodeIdx];

    // Nodes with connections that are not all shown are shown in special group where outline is marked
    var allDependenciesShown = depNode.connections.every((con) =>
      this.shownInNetwork.has(con)
    );

    const newGroup = allDependenciesShown ? depNode.group : depNode.group + "i";
    var networkNode = this.networkData.nodes.get(nodeIdx);
    if (networkNode.group !== newGroup) {
      this.networkData.nodes.update({
        id: nodeIdx,
        label: depNode.label,
        group: newGroup,
      });
    }
  }
}
