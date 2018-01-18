using System;
using System.Collections.Generic;
using System.Linq;

namespace AseModelHost.Models {
  public class VariableDescription {
    public VariableDescription( string id, string type, IReadOnlyList<string> domain = null, string guid = null ) {
      Id = id;
      Type = type;
      Domain = domain;
      Guid = guid ?? System.Guid.NewGuid().ToString();
    }

    public VariableDescription Copy() => new VariableDescription( Id, Type, Domain.ToList() );

    public string Id { get; }

    public string Type { get; }

    public IReadOnlyList<string> Domain { get; }

    public string Guid { get; }
  }
}