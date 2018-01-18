namespace AseModelHost.Models {
  /// <summary>
  /// Definition of a model, containing ID and description of model
  /// </summary>
  public class ModelDescription {
    private readonly ModelStorage _storage;
    private static int _globalCount = 0;

    public ModelDescription( ModelStorage storage, string id, string description, string guid = null ) {
      _storage = storage;
      InternalNumber = _globalCount++;

      Id = id;
      Description = description;
      Guid = guid ?? System.Guid.NewGuid().ToString();
    }

    public ModelDescription Copy( ModelDescription modelDescription ) {
      return new ModelDescription(
        modelDescription._storage,
        modelDescription.Id,
        modelDescription.Description );
    }

    /// <summary>
    /// Internal number is used to ensure, that models are not re-ordered
    /// </summary>
    public int InternalNumber { get; }

    public string Id { get; set; }

    public string Description { get; set; }

    public string Guid { get; }

    public int VariableCount => _storage.VariableCount( Guid );

    public int RuleCount => _storage.RuleCount( Guid );

    public int MacroCount => _storage.MacroCount( Guid );
  }
}