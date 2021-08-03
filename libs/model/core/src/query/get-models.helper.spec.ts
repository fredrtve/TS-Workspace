
import { Test1Child1, Test1Foreign1 } from '../../test-types';
import { ModelConfigMap } from '../interfaces';
import { _registerModelStateConfig } from '../model-state-config-helpers';
import { _getModel } from './get-model.helper';
import { _getModels } from './get-models.helper';

interface Test1 { id?: string, children1?: Test1Child1[], children2?: Test1Child1[] 
    foreignKey1?: string, foreign1?:Test1Foreign1, foreignKey2?: string, foreign2?: Test1Foreign1,  }

interface TestState  { 
    test1s: Test1[], 
    test1Foreign1s: Test1Foreign1[],
    test1Foreign2s: Test1Foreign1[],
    test1Child1s: Test1Child1[],  
    test1Child2s: Test1Child1[], 
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
          children: { }, 
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
    test1Child2s: [ 
        {id: 'modelChild21', test1Id: 'model1', foreignKey1: 'modelChildForeign1'}, 
        {id: 'modelChild22', test1Id: 'model1', foreignKey1: 'modelChildForeign1'}, 
        {id: 'modelChild23', test1Id: 'model2', foreignKey1: 'modelChildForeign2'} 
    ],
}

describe('_getModels', () => {

  beforeEach(() => {});

  it('should get all models with all relations', () => {
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s", children: 'all', foreigns: 'all' } )
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
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s", foreigns: ['foreign1'] } )
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
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s", foreigns: ['foreign1', 'foreign2'] } )
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
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s", children: ['children2'] } )
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
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s", children: ['children1', 'children2'] } )
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

  it('should get all models by condition', () => {
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s" }, (t) => t.id === "model1")
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual("model1")
  });

  it('should get all models with no relations', () => {
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>(state, { prop: "test1s" } )
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

  it('should return undefined if model not found', () => {
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModel<Partial<TestState>, Test1>(state, "notfound", { prop: "test1s" } )
    expect(result).toBeUndefined();   
  });
  
  it('should return empty array if empty model state', () => {
    _registerModelStateConfig<TestState>(getModelConfigMap());
    var result = _getModels<Partial<TestState>, Test1>({}, { prop: "test1s" } )
    expect(result.length).toEqual(0);   
  });
});
