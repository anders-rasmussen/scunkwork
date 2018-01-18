namespace AseModelHost.Models {
  /// <summary>
  /// Used for communicating model updates as JSON
  /// </summary>
  public class ModelDescriptionUpdate {

    public string Guid { get; set; }
    public string Id { get; set; }
    public string Description { get; set; }
  }
}
