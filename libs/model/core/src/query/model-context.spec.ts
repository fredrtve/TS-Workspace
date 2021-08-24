
import { Test1Child1, Test1Child1Child1, Test1Foreign1 } from '../../test-types';
import { ModelConfigMap } from '../interfaces';
import { _getModelConfig, _registerModelStateConfig } from '../model-state-config-helpers';
import { ModelContext } from './model-context';

interface Test1 { id?: string, children1?: Test1Child1[], children2?: Test1Child1[] 
    foreignKey1?: string, foreign1?:Test1Foreign1, foreignKey2?: string, foreign2?: Test1Foreign1,  }

interface TestState  { 
    test1s: Test1[], 
    test1Foreign1s: Test1Foreign1[],
    test1Foreign2s: Test1Foreign1[],
    test1Child1s: Test1Child1[],  
    test1Child2s: Test1Child1[], 
    test1Child1Child1s: Test1Child1Child1[],  
}
  
function getModelConfigMap(idGenerator?: any): ModelConfigMap<TestState>{
    return <any>{
      test1s: {
        stateProp: "test1s",
        idProp: "id",
        idGenerator,
        children: { 
            children1: { stateProp: "test1Child1s", childKey: "test1Id" }, 
            children2: { stateProp: "test1Child2s", childKey: "test1Id" } 
        },
        foreigns: { 
            foreign1: { stateProp: "test1Foreign1s", foreignKey: "foreignKey1" },
            foreign2: { stateProp: "test1Foreign2s", foreignKey: "foreignKey2" } 
        }
      },
      test1Foreign1s: {
        stateProp: "test1Foreign1s",
        idProp: "id",
        idGenerator,
        children: {},
        foreigns: {}
      },
      test1Foreign2s: {
        stateProp: "test1Foreign2s",
        idProp: "id",
        idGenerator,
        children: {},
        foreigns: {}
      },
      test1Child1s: {
          stateProp: "test1Child1s",
          idProp: "id",
          idGenerator,
          children: {
              children: { stateProp: "test1Child1Child1s", childKey: "test1Child1Id"}
           }, 
          foreigns: { }
      }, 
      test1Child2s: {
          stateProp: "test1Child1s",
          idProp: "id",
          idGenerator,
          children: { }, 
          foreigns: { }
      },
    }
  }

const state: Partial<TestState> = {
    test1s: [ 
        { id: 'model1', foreignKey1: "modelForeign11", foreignKey2: "modelForeign21" },
        { id: 'model2', foreignKey1: "modelForeign12", foreignKey2: "modelForeign22"} 
    ],
    test1Foreign1s: [ 
        { id: 'modelForeign11' }, 
        { id: 'modelForeign12' } 
    ],
    test1Foreign2s: [ 
        { id: 'modelForeign21' }, 
        { id: 'modelForeign22' } 
    ],
    test1Child1s: [ 
        {id: 'modelChild11', test1Id: 'model1', foreignKey1: 'modelChildForeign1'}, 
        {id: 'modelChild12', test1Id: 'model1', foreignKey1: 'modelChildForeign1'}, 
        {id: 'modelChild13', test1Id: 'model2', foreignKey1: 'modelChildForeign2'} 
    ],  
    test1Child1Child1s: [ 
        {id: 'modelChild11', test1Child1Id: 'modelChild11'}, 
        {id: 'modelChild12', test1Child1Id: 'modelChild11'}, 
        {id: 'modelChild13', test1Child1Id: 'modelChild12'}, 
        {id: 'modelChild14', test1Child1Id: 'modelChild13'} 
    ],
    test1Child2s: [ 
        {id: 'modelChild21', test1Id: 'model1', foreignKey1: 'modelChildForeign1'}, 
        {id: 'modelChild22', test1Id: 'model1', foreignKey1: 'modelChildForeign1'}, 
        {id: 'modelChild23', test1Id: 'model2', foreignKey1: 'modelChildForeign2'} 
    ],
}

const ctx = new ModelContext<TestState>();

describe('ModelContext', () => {

  beforeEach(() => { _registerModelStateConfig<TestState>(getModelConfigMap()); });

  it('Should get all models with all relations', () => {
    const config = _getModelConfig<TestState, Test1>("test1s");
    var query = ctx.get("test1s");
    for(const child in config.children) query.include(<any> child);
    for(const foreign in config.foreigns) query.include(<any> foreign);
    var result = query.run(state);
    var m1 = result[0];
    var m2 = result[1];

    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1?.foreign1).toBeDefined();
    expect(m1!.foreign1!.id).toEqual("modelForeign11");    
    expect(m1?.foreign2).toBeDefined();
    expect(m1!.foreign2!.id).toEqual("modelForeign21");

    expect(m1?.children1).toBeDefined();
    expect(m1!.children1!.length).toEqual(2);
    expect(m1!.children1![0].id).toMatch("modelChild11");
    expect(m1!.children1![1].id).toMatch("modelChild12");  
    expect(m1?.children2).toBeDefined();
    expect(m1!.children2!.length).toEqual(2);
    expect(m1!.children2![0].id).toMatch("modelChild21");
    expect(m1!.children2![1].id).toMatch("modelChild22");

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");

    expect(m2?.foreign1).toBeDefined();
    expect(m2!.foreign1!.id).toEqual("modelForeign12");    
    expect(m2?.foreign2).toBeDefined();
    expect(m2!.foreign2!.id).toEqual("modelForeign22");

    expect(m2?.children1).toBeDefined();
    expect(m2!.children1!.length).toEqual(1);
    expect(m2!.children1![0].id).toMatch("modelChild13");
    expect(m2?.children2).toBeDefined();
    expect(m2!.children2!.length).toEqual(1);
    expect(m2!.children2![0].id).toMatch("modelChild23");
  });

  it('should get all models with only 1 foreign relation', () => {
    var result = ctx.get("test1s").include("foreign1").run(state);

    var m1 = result[0];
    var m2 = result[1];
    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1?.foreign1).toBeDefined();
    expect(m1!.foreign1!.id).toEqual("modelForeign11");    

    expect(m1!.foreign2).toBeUndefined();  
    expect(m1!.children1).toBeUndefined(); 
    expect(m1!.children2).toBeUndefined();  

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");

    expect(m2?.foreign1).toBeDefined();
    expect(m2!.foreign1!.id).toEqual("modelForeign12");    

    expect(m2!.foreign2).toBeUndefined();  
    expect(m2!.children1).toBeUndefined(); 
    expect(m2!.children2).toBeUndefined();  
  });

  it('should get all models with only 2 foreign relation', () => {
    var result = ctx.get("test1s").include("foreign1").include("foreign2").run(state);
    var m1 = result[0];
    var m2 = result[1];

    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1?.foreign1).toBeDefined();
    expect(m1!.foreign1!.id).toEqual("modelForeign11");    
    expect(m1?.foreign2).toBeDefined();
    expect(m1!.foreign2!.id).toEqual("modelForeign21");

    expect(m1!.children1).toBeUndefined(); 
    expect(m1!.children2).toBeUndefined();  

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");

    expect(m2?.foreign1).toBeDefined();
    expect(m2!.foreign1!.id).toEqual("modelForeign12");    
    expect(m2?.foreign2).toBeDefined();
    expect(m2!.foreign2!.id).toEqual("modelForeign22");

    expect(m2!.children1).toBeUndefined(); 
    expect(m2!.children2).toBeUndefined();  
  });

  it('should get all models with only 1 child relation', () => {
    var result = ctx.get("test1s").include("children2").run(state);
    var m1 = result[0];
    var m2 = result[1];

    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");
    expect(m1?.children2).toBeDefined();
    expect(m1!.children2!.length).toEqual(2);
    expect(m1!.children2![0].id).toMatch("modelChild21");
    expect(m1!.children2![1].id).toMatch("modelChild22");  
    expect(m1!.children1).toBeUndefined();  
    expect(m1!.foreign1).toBeUndefined();  
    expect(m1!.foreign2).toBeUndefined(); 

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");
    expect(m2?.children2).toBeDefined();
    expect(m2!.children2!.length).toEqual(1);
    expect(m2!.children2![0].id).toMatch("modelChild23"); 
    expect(m2!.children1).toBeUndefined();  
    expect(m2!.foreign1).toBeUndefined();  
    expect(m2!.foreign2).toBeUndefined(); 
  });

  it('should get all models with only 2 child relations', () => {
    var result = ctx.get("test1s").include("children1").include("children2").run(state);
    var m1 = result[0];
    var m2 = result[1];
    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1?.children1).toBeDefined();
    expect(m1!.children1!.length).toEqual(2);
    expect(m1!.children1![0].id).toMatch("modelChild11");
    expect(m1!.children1![1].id).toMatch("modelChild12");  
    expect(m1?.children2).toBeDefined();
    expect(m1!.children2!.length).toEqual(2);
    expect(m1!.children2![0].id).toMatch("modelChild21");
    expect(m1!.children2![1].id).toMatch("modelChild22");

    expect(m1!.foreign1).toBeUndefined();  
    expect(m1!.foreign2).toBeUndefined();  

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");

    expect(m2?.children1).toBeDefined();
    expect(m2!.children1!.length).toEqual(1);
    expect(m2!.children1![0].id).toMatch("modelChild13"); 
    expect(m2?.children2).toBeDefined();
    expect(m2!.children2!.length).toEqual(1);
    expect(m2!.children2![0].id).toMatch("modelChild23");

    expect(m1!.foreign1).toBeUndefined();  
    expect(m1!.foreign2).toBeUndefined();  
  });

  it('should get models with nested child relations', () => {
    var result = ctx.get("test1s").include("children1", q => q.include("children")).run(state);
    
    var m1 = result[0];

    expect(result.length).toEqual(2);

    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1?.children1).toBeDefined();
    expect(m1!.children1!.length).toEqual(2);
    expect(m1!.children1![0].children?.length).toEqual(2);
    expect(m1!.children1![1].children?.length).toEqual(1);       
  });

  it('should get models with nested child relation with condition', () => {
    var result = ctx.get("test1s").include("children1", q => q.where(x => x.test1Id !== "model2").include("children")).run(state);

    expect(result.length).toEqual(2);

    var m1 = result[0];

    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1?.children1).toBeDefined();
    expect(m1!.children1!.length).toEqual(2);
    expect(m1!.children1![0].children?.length).toEqual(2);
    expect(m1!.children1![1].children?.length).toEqual(1);  
    
    var m2 = result[1];

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");
    expect(m2!.children1).toBeUndefined();

  });

  it('should get all models by condition', () => {
    var result = ctx.get("test1s").where((t) => t.id === "model1").run(state);
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual("model1")
  });

  it('should get first model by condition', () => {
    var result = ctx.get("test1s").where((t) => t.id === "model1").first(state);
    expect(result!.id).toEqual("model1")
  });

  it('should get all models with no relations', () => {
    var result = ctx.get("test1s").run(state);
    var m1 = result[0];
    var m2 = result[1];

    expect(m1).toBeDefined();
    expect(m1!.id).toEqual("model1");

    expect(m1!.children1).toBeUndefined();  
    expect(m1!.children2).toBeUndefined();
    expect(m1!.foreign1).toBeUndefined();  
    expect(m1!.foreign2).toBeUndefined();    

    expect(m2).toBeDefined();
    expect(m2!.id).toEqual("model2");

    expect(m2!.children1).toBeUndefined();  
    expect(m2!.children2).toBeUndefined();
    expect(m2!.foreign1).toBeUndefined();  
    expect(m2!.foreign2).toBeUndefined();    
  });  

  it('should return empty array if none matches conditions', () => {
    var result = ctx.get("test1s").where(x => x.id === "noonehasthiskey").run(state);
    expect(result.length).toEqual(0);   
  });
  
  it('should return empty array if empty model state', () => {
    var result = ctx.get("test1s").run({});
    expect(result.length).toEqual(0);   
  });
  
});
