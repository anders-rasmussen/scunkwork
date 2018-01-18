using System.Collections.Generic;
using System.Linq;

using AseModelHost.Models;

using Microsoft.AspNetCore.Mvc;

namespace AseModelHost.Controllers {
  [Produces( "application/json" )]
  [Route( "api/models" )]
  public class ModelsController: Controller {
    private readonly IModelStorage _modelStorage;

    public ModelsController( IModelStorage modelStorage ) {
      _modelStorage = modelStorage;
    }

    // GET: api/models
    [HttpGet]
    public IEnumerable<ModelDescription> Get() {
      return _modelStorage.ModelDescriptions.OrderBy( m => m.InternalNumber );
    }

    // Empty guid => create
    // guid specified => copy
    // GET: api/models/create
    [HttpPost( "guid" )]
    [Route( "create" )]
    public ModelDescription CreateOrCopy( string guid ) {
      if ( guid == null ) {
        return _modelStorage.NewModel();
      }
      return _modelStorage.CopyModel( guid );
    }

    // Empty guid => create
    // guid specified => copy
    // GET: api/models/create
    [HttpPost( "guid" )]
    [Route( "update" )]
    public ModelDescription Update( [FromBody]ModelDescriptionUpdate update ) {
      return _modelStorage.UpdateModel( update.Guid, update.Id, update.Description );
    }

    [HttpDelete("guid")]
    [Route( "delete")]
    public void Delete( string guid ) {
      _modelStorage.DeleteModel( guid );
    }
  }
}
