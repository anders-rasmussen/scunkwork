using System.Collections.Generic;
using System.Linq;

using AseModelHost.Models;

using Microsoft.AspNetCore.Mvc;

namespace AseModelHost.Controllers {
  [Produces( "application/json" )]
  [Route( "api/variables" )]
  public class VariablesController : Controller {
    private readonly IModelStorage _modelStorage;

    public VariablesController( IModelStorage modelStorage ) {
      _modelStorage = modelStorage;
    }

    // GET: api/variables/<guid>
    [HttpGet("{guid}")]
    public IEnumerable<VariableDescription> Get( string guid ) {
      return _modelStorage.GetVariables( guid ) ?? Enumerable.Empty<VariableDescription>();
    }
  }
}