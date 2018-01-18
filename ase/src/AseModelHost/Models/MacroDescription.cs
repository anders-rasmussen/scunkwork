namespace AseModelHost.Models {
  public class MacroDescription {
    public MacroDescription( string id, string description, string body, string guid = null ) {
      Id = id;
      Description = description;
      Body = body;
      Guid = guid ?? System.Guid.NewGuid().ToString();
    }

    public MacroDescription Copy() => new MacroDescription( Id, Description, Body );

    public string Id { get; }

    public string Description { get; }

    public string Body { get; }

    public string Guid { get; }
  }
}