using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using Configit.Core.Model.Logic.Json;
using Configit.Core.Utils.Base;

using Microsoft.Extensions.Configuration;


namespace AseModelHost.Models {
  /// <summary>
  /// Definition of how models are stored.
  /// </summary>

  public interface IModelStorage {
    /// <summary>
    /// Get list of all available models
    /// </summary>
    IReadOnlyList<ModelDescription> ModelDescriptions { get; }

    /// <summary>
    /// Get all variables for model with specified <paramref name="modelId"/>.
    /// </summary>
    /// <returns>Variables for model, or null if <paramref name="modelId"/> is not a valid
    /// model ID.</returns>
    IReadOnlyList<VariableDescription> GetVariables( string modelId );

    /// <summary>
    /// Get all rules for model with specified <paramref name="modelId"/>.
    /// </summary>
    /// <returns>Rules for model, or null if <paramref name="modelId"/> is not a valid
    /// model ID.</returns>
    IReadOnlyList<RuleDescription> GetRules( string modelId );

    /// <summary>
    /// Create a copy of an existing model
    /// </summary>
    ModelDescription CopyModel( string guid );

    /// <summary>
    /// Create a new model
    /// </summary>
    ModelDescription NewModel();

    /// <summary>
    /// Delete given model
    /// </summary>
    void DeleteModel( string guid );

    /// <summary>
    /// Update model - set <paramref name="id"/> and <paramref name="description"/>
    /// </summary>
    ModelDescription UpdateModel( string guid, string id, string description );
  }

  /// <summary>
  /// In-memory storage of models, which loads models only once. All changes are kept in memory,
  /// and not saved to disc.
  /// </summary>
  public class ModelStorage : IModelStorage {
    // model Guid -> variable Guid*
    private readonly ConcurrentDictionary<string, ConcurrentBag<string>> _modelVariables;

    // model Guid -> rule Guid*
    private readonly ConcurrentDictionary<string, ConcurrentBag<string>> _modelRules;

    // model Guid -> macro Guid*
    private readonly ConcurrentDictionary<string, ConcurrentBag<string>> _modelMacros;

    // variable Guid -> Variable
    private readonly ConcurrentDictionary<string,VariableDescription> _variables;

    // rule Guid -> Rule
    private readonly ConcurrentDictionary<string, RuleDescription> _rules;

    private readonly ConcurrentDictionary<string, ModelDescription> _models;

    private readonly ConcurrentDictionary<string, MacroDescription> _macros;

    public ModelStorage( IConfiguration configuration ) {
      var modelPath = configuration["ModelPath"];

      _models = new ConcurrentDictionary<string, ModelDescription>();
      _variables = new ConcurrentDictionary<string, VariableDescription>();
      _rules = new ConcurrentDictionary<string, RuleDescription>();
      _macros = new ConcurrentDictionary<string, MacroDescription>();
      _modelVariables = new ConcurrentDictionary<string, ConcurrentBag<string>>();
      _modelRules = new ConcurrentDictionary<string, ConcurrentBag<string>>();
      _modelMacros = new ConcurrentDictionary<string, ConcurrentBag<string>>();

      if ( !Directory.Exists( modelPath ) ) {
        throw new InvalidDataException( "Please put a valid ModelPath in appsettings.json file" );
      }

      foreach ( var modelFile in Directory.GetFiles( modelPath, "*.json" )) {
        var logicModel = LogicModelJsonSerializer.ReadAsync( modelFile ).Result;
        var modelDescription = AddModel(
          new ModelDescription( this, logicModel.Id, logicModel.Description ) );

        foreach ( var variable in logicModel.Variables ) {
          var variableDescription = new VariableDescription(
            variable.Id,
            variable.VarType.ToString(),
            variable.Domain.Select( val => val.ToString() ).ToList() );
          _variables[variableDescription.Guid] = variableDescription;
          _modelVariables[modelDescription.Guid].Add( variableDescription.Guid );
        }

        foreach( var rule in logicModel.Rules ) {
          var ruleDescription = new RuleDescription(
            rule.Id,
            rule.Description,
            rule.Expr.ToString() );
          _rules[ruleDescription.Guid] = ruleDescription;
          _modelRules[modelDescription.Guid].Add( ruleDescription.Guid );
        }
      }
    }

    /// <inheritdoc />
    public IReadOnlyList<ModelDescription> ModelDescriptions => _models.Values.ToList();

    /// <inheritdoc />
    public IReadOnlyList<VariableDescription> GetVariables( string modelId ) {
      if ( !_modelVariables.TryGetValue( modelId, out ConcurrentBag<string> variables )) {
        return null;
      }

      return variables.Select( vGuid => _variables[vGuid] ).ToArray();
    }

    public IReadOnlyList<RuleDescription> GetRules( string modelId ) {
      throw new NotImplementedException();
    }

    public int VariableCount( string modelId ) {
      if ( !_modelVariables.TryGetValue( modelId, out ConcurrentBag<string> variables ) ) {
        return 0;
      }

      return variables.Count;
    }

    public int RuleCount( string modelId ) {
      if ( !_modelRules.TryGetValue( modelId, out ConcurrentBag<string> rules ) ) {
        return 0;
      }

      return rules.Count;
    }

    public int MacroCount( string modelId ) {
      if ( !_modelMacros.TryGetValue( modelId, out ConcurrentBag<string> macros )) {
        return 0;
      }

      return macros.Count;
    }

    /// <summary>
    /// Copy existing model
    /// </summary>
    /// <returns>Description of new model, or null if no model with <paramref name="guid"/>
    /// exists</returns>
    public ModelDescription CopyModel( string guid ) {
      if ( guid == null || !_models.TryGetValue( guid, out ModelDescription model ) ) {
        return null;
      }

      var existingIds = new HashSet<string>( _models.Values.Select( m => m.Id ) );
      var newId = $"Copy of {model.Id}";
      for ( int i = 1; existingIds.Contains( newId ); i++ ) {
        newId = $"Copy({i}) of {model.Id}";
      }

      var newModel = AddModel( new ModelDescription( this, newId, model.Description ));

      foreach ( var vguid in _modelVariables[guid] ) {
        var copy = _variables[vguid].Copy();
        _variables[copy.Guid] = copy;
        _modelVariables[newModel.Guid].Add( copy.Guid );
      };

      foreach ( var rguid in _modelRules[guid] ) {
        var copy = _rules[rguid].Copy();
        _rules[copy.Guid] = copy;
        _modelRules[newModel.Guid].Add( copy.Guid );
      };

      foreach ( var mguid in _modelMacros[guid] ) {
        var copy = _macros[mguid].Copy();
        _macros[copy.Guid] = copy;
        _modelMacros[newModel.Guid].Add( copy.Guid );
      };

      return newModel;
    }

    public ModelDescription NewModel() {
      var existingIds = new HashSet<string>( _models.Values.Select( m => m.Id ) );
      var newId = "New Model";
      for ( int i = 1; existingIds.Contains( newId ); i++ ) {
        newId = $"New Model({i})";
      }

      return AddModel( new ModelDescription( this, newId, string.Empty ) );
    }

    public void DeleteModel( string guid ) {
      _models.Remove( guid, out ModelDescription _ );

      _modelVariables[guid].ForEach( v => _variables.Remove( v, out VariableDescription _ ) );
      _modelVariables.Remove( guid, out ConcurrentBag<string> _ );

      _modelRules[guid].ForEach( r => _rules.Remove( r, out RuleDescription _ ) );
      _modelRules.Remove( guid, out ConcurrentBag<string> _ );

      _modelMacros[guid].ForEach( m => _macros.Remove( m, out MacroDescription _ ) );
      _modelMacros.Remove( guid, out ConcurrentBag<string> _ );
    }

    public ModelDescription UpdateModel( string guid, string id, string description ) {
      if ( !_models.TryGetValue( guid, out ModelDescription modelDescription )) {
        return null;
      }

      modelDescription.Id = id;
      modelDescription.Description = description;

      return modelDescription;
    }

    private ModelDescription AddModel( ModelDescription model ) {
      _models[model.Guid] = model;
      _modelMacros[model.Guid] = new ConcurrentBag<string>();
      _modelVariables[model.Guid] = new ConcurrentBag<string>();
      _modelRules[model.Guid] = new ConcurrentBag<string>();

      return model;
    }
  }
}