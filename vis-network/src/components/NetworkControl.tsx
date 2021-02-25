import {
  Network,
  DataSet,
  Data,
  IdType,
  ClusterOptions,
} from "vis-network/standalone/esm/vis-network";

/**
 * Representation of a node in the graph. For most practical purposes, all nodes
 * are the same - it's only the group they belong to, which makes them appear
 * differently.
 */
export type NetworkNode = {
  id: IdType;
  label: string;
  group: string;
  connections: IdType[];
};

/**
 * Class which provides control over a dependency network.
 * The input is a collection of dependencies, which represents all variable/rule dependencies
 * in a Model.
 *
 * The generated Data object is used by DepNetwork, which is the visualization of the network
 *
 * This class also functions as communication bond between different objects (the VisJS network is not
 * ready for React, so we cannot re-draw it on data changes.)
 */
export default class NetworkControl {
  // House keeping of nodes which are shown in network
  private shownInNetwork: Set<IdType>;

  // Once the network visualization has created the network, it is passed back
  // and set here. This way, this control has a handle to everything
  private network?: Network;

  // All nodes in model: variables, rules etc.
  nodes: NetworkNode[];

  // Map from node ID to networkd node
  nodesMap: Map<IdType, NetworkNode>;

  // Global data object, shared with the VIS network.
  // When this is updated, the networks is automatically re-drawn
  networkData: Data;

  constructor(nodes: NetworkNode[], showInNetwork: IdType[]) {
    this.nodes = nodes;
    this.nodesMap = new Map<IdType, NetworkNode>();
    nodes.forEach((n) => this.nodesMap.set(n.id, n));
    this.shownInNetwork = new Set<IdType>();

    this.networkData = {
      nodes: new DataSet([], { queue: true }),
      edges: new DataSet([], { queue: true }),
    };

    showInNetwork.forEach((n) => this.showNodeInNetwork(n));
    this.flushChanges();
  }

  /**
   * Must be called once the network visualization component is created
   */
  setNetwork(network: Network) {
    this.network = network;
  }

  /**
   * Expand all nodes which are connected to the given node
   */
  expandNodeConnections(nodeId: IdType) {
    // Expansion of clusters will open the cluster
    if (this.network?.isCluster(nodeId)) {
      const nodesInCluster = this.network.getNodesInCluster(nodeId);
      this.network.openCluster(nodeId);
      // Select nodes which were in cluster
      this.network.setSelection({ nodes: nodesInCluster });
      return;
    }

    // Expansion of other nodes will add all connected nodes
    this.nodesMap
      .get(nodeId)
      ?.connections.forEach((con) => this.showNodeInNetwork(con));
    this.flushChanges();
  }

  /**
   * Delete all nodes and edges in the network, and re-add them. This will force
   * the entire network to be layed out again.
   */
  redraw() {
    var shown = this.shownInNetwork;
    this.shownInNetwork = new Set<IdType>();

    this.network?.stopSimulation();

    this.networkData.nodes.clear();
    this.networkData.edges.clear();

    shown.forEach((n) => this.showNodeInNetwork(n));
    this.flushChanges();

    this.network?.stabilize();
    this.network?.startSimulation();
  }

  /**
   * Fit current graph into window
   */
  fitToWindow() {
    this.network?.fit({ animation: true, maxZoomLevel: 3 });
  }

  /**
   * Add all nodes to network
   */
  addAll() {
    this.nodes.forEach((n) => this.showNodeInNetwork(n.id));
    this.flushChanges();
  }

  /**
   * Add element if not already in network, and zoom to the given element
   */
  selectElement(nodeId: IdType) {
    if (!this.network) {
      return;
    }

    // Ensure node is in network (add if it is not)
    let wasAdded = this.showNodeInNetwork(nodeId);
    this.flushChanges();

    // Get path to node, which may contain clusters
    var nodePath = this.network.findNode(nodeId);

    // Highlight the node / cluster the node is in
    this.network?.selectNodes([nodePath[0]], true);

    // If it was already there, zoom in to make it obvious where it is
    if (!wasAdded) {
      this.network.focus(nodePath[0], {
        scale: 2,
        animation: true,
      });
    }
  }

  /**
   * Delete all nodes from network
   */
  deleteAll() {
    this.shownInNetwork.clear();
    this.networkData.nodes.clear();
    this.networkData.edges.clear();
    this.flushChanges();
  }

  /**
   * Create a new cluster for all selected nodes
   */
  clusterSelected(clusterId: string) {
    const selectedNodes = new Set<IdType>(this.network?.getSelectedNodes());
    var options: ClusterOptions = {
      joinCondition: function (node: NetworkNode) {
        return selectedNodes.has(node.id);
      },
      clusterNodeProperties: {
        label: clusterId,
        group: "cluster",
      },
    };
    this.network?.cluster(options);
    this.flushChanges();
  }

  /**
   * Delete all selected nodes
   */
  deleteSelected() {
    const selectedNodes = new Set<IdType>(this.network?.getSelectedNodes());
    // Delete all selected nodes
    if (selectedNodes) {
      selectedNodes.forEach((n) => {
        this.networkData.nodes.remove(n);
        this.shownInNetwork.delete(n);
      });
    }

    // Delete all connected edges
    var edges = this.networkData.edges.get({
      filter: (e: DataSet.Edge) =>
        selectedNodes.has(e.from) || selectedNodes.has(e.to),
    });
    edges.forEach((e: DataSet.Edge) => this.networkData.edges.remove(e));

    // Find nodes which we need to update group for
    var nodesToUpdate = new Set<IdType>();
    edges.forEach((e: DataSet.Edge) => {
      nodesToUpdate.add(e.from);
      nodesToUpdate.add(e.to);
    });
    nodesToUpdate.forEach((n) => this.updateGroupOfNode(n));

    this.flushChanges();
  }

  /**
   * Get number of selected nodes
   */
  numberOfSelectedNodes = () => this.network?.getSelectedNodes()?.length || 0;

  /**
   * After data has been changed in the network, we need to
   * make sure they are flushed. DataSet instances are crated with
   * a queue enabled, making it possible to add multiple changes before
   * the network is re-drawn.
   */
  private flushChanges() {
    this.networkData.nodes.flush();
    this.networkData.edges.flush();
  }

  /**
   * Ensure that node is shown in the network, and that all connections to
   * already existing shown nodes are inserted
   * @param nodeId Index of node to ad to network
   * @readonly true if the node was added, false is if was already in the network
   */
  private showNodeInNetwork(nodeId: IdType): boolean {
    if (this.shownInNetwork.has(nodeId)) {
      return false;
    }

    this.shownInNetwork.add(nodeId);
    let node = this.nodesMap.get(nodeId);
    if (!node) {
      return false;
    }

    this.networkData.nodes.add({
      id: nodeId,
      label: node.label,
      group: node.group,
    });

    node.connections
      .filter((con) => this.shownInNetwork.has(con))
      .forEach((con) => {
        this.networkData.edges.add({
          from: nodeId < con ? nodeId : con,
          to: nodeId > con ? nodeId : con,
        });
      });

    // Update groups to reflect which nodes are now fully expanded
    this.updateGroupOfNode(nodeId);
    node.connections.forEach((con) => this.updateGroupOfNode(con));

    return true;
  }

  /**
   * The group of the node is used to indicate what type of node it is, and if all connections
   * of the node are shown in the graph. This way, the user can see which nodes can be futher
   * expanded
   */
  private updateGroupOfNode(nodeId: IdType) {
    if (!this.shownInNetwork.has(nodeId)) {
      return;
    }

    var node = this.nodesMap.get(nodeId);
    if (!node) {
      return;
    }

    // Nodes with connections that are not all shown are shown in special group where outline is marked
    var allDependenciesShown = node.connections.every((con) =>
      this.shownInNetwork.has(con)
    );

    const newGroup = allDependenciesShown ? node.group : node.group + "i";

    this.networkData.nodes.update({
      id: nodeId,
      label: node.label,
      group: newGroup,
    });
  }
}
