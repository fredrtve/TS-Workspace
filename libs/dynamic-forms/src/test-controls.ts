import { DynamicControlGroup } from './lib/interfaces';
import { DynamicFormBuilder } from './public-api';
import { TestFieldComponent } from './test-assets/test-control-field.component';
import { TestControlGroupComponent } from './test-assets/test-control-group.component';

interface TestForm { nest1: string, nest2: string, group1: { nest1: string }, group2: { nest1: string }};
interface TestState { state1: string, state2: string }
const builder = new DynamicFormBuilder<TestForm, TestState>();
const builder2 = new DynamicFormBuilder<{}, {state1: string, state2: string}>();
const iBuilder = new DynamicFormBuilder<{ nest1: string, nest2: string, nest3: string}, {state1: string, nostate: number}>();
const binding = builder.bindObserver([], ["state1"], (f,s) => s);

const stringControl = builder.field<TestFieldComponent<string>>({
  required$: true,
  viewComponent: TestFieldComponent,
  viewOptions: { width$: "" }
});

const group1 = builder.group<{ nest1: string }>()({
  viewComponent: null,
  viewOptions: { testOption$: 2 }, controls: { nest1: stringControl },   
});
const group2 = builder.group<{ nest1: string }>()({
    viewComponent: TestControlGroupComponent,
    viewOptions: { someOption$: "" }, controls: { nest1: stringControl },   
});

const group = builder.group()({
  viewComponent: undefined,
  disabled$: true,
  controls: {
    nest1: stringControl,
    nest2: stringControl,
    group1: group1,
    group2: group2
  },
  viewOptions: { testOption$: ""  },
  overrides: {
    group2: { viewOptions: { someOption$: "" } },
    group1: { viewOptions: { testOption$: "" } },
    nest1: { disabled$: iBuilder.bindState("state1", (arr) => arr != null ? true : false) }
  }
});

const arr = builder2.array({
  controlTemplate: group,
  viewOptions: { testOption$: "" },
  templateOverrides: {
    viewOptions: { testOption$: "" },
    disabled$: iBuilder.bindState("state1", (arr) => arr != null ? true : false) 
  }
}) 