import { ControlComponentRenderer } from "./services/control-component.renderer";
import { ControlFactory } from "./services/control.factory";
import { FormStateResolver } from "./services/form-state.resolver";

export const ControlArrayEntryProviders = [FormStateResolver, ControlFactory, ControlComponentRenderer]