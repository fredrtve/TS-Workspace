[Root](../../../README.md) &gt; [model](../README.md) &gt; [core](./README.md)

# Core

A library consisting of core logic required for configuring, querying and saving models.

[API documentation](../../../docs/model-core.md)


## Configuring models
Configure the models with `ModelConfigMap` interface. Provide an interface that represents the models that should be configured. All configurable models should be represented as an array. 

To register the configurations, use `_registerModelStateConfig`

**Example state:**
````
interface ModelState {
	missions: Mission[];
	employers: Employer[];
	missionNotes: MissionNote[];
}
````
**Example configuration:**
````
const ModelConfigMap: ModelConfigMap<ModelState> = {
	missions: {
		stateProp: "missions",
		idProp: "id",
		idGenerator: _idGenerator,
		children: {
			missionNotes: {
				stateProp:  "missionNotes", 
				childKey:  "missionId", 
				cascadeDelete:  true
			},
		},
		foreigns: {
			employer: {
				stateProp:  "employers", 
				foreignKey:  "employerId"
			}
		}
	}
}
````

## Querying models
To query for models, create an instance of `ModelContext` with the model state interface. 

Use the `get` function to receive a `ModelQuery` instance for a specific model, with these functions available:

 - `where` : Filter the models based on an expression.
 - `include` : Include related models with an optional nested query. 
 - `select` : Returns the models from state mapped with an expression.
 - `first` : Returns the first model from state that matches the query.
 - `run` : Returns the models from state that matches the query.

**Example query:**
````
const modelCtx = new ModelContext<ModelState>();

modelCtx.get("missions")
	.where(x => x.id === 34)
	.include("missionNotes", q => q.where(note => note.title != null))
	.first(state)
````

## Saving & deleting models

To save or delete models, use the functions `_saveModel` and `_deleteModel`. 

When using `_saveModel`, any relations set on the model will also be saved. Models with existing ids are updated, otherwise the model will be added to state. 

When using `_deleteModel`, any child relations with `cascadeDelete` set to `true` in configuration, will also be deleted.
