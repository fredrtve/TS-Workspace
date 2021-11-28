import { AppChip } from "../../interfaces/app-chip.interface";
import { translations } from "../../constants/translations.const";
import { Immutable } from "@fretve/global-types";

export function _enumSelectionChipsFactory<TEnum extends { [s: number]: string }>(
    _enum: TEnum, 
    currentSelection: unknown,
    selectFn: (val: Immutable<unknown>) => void
  ): AppChip[] {
  const chips: AppChip[] = [];
  const options = Object.keys(_enum).filter(key => isNaN(Number(_enum[key as unknown as number])));
  for(const strVal of options){
    const value = parseInt(strVal);
    const selected = (value === currentSelection)
    chips.push({ 
      text: translations[_enum[value].toLowerCase()] , color: selected ? "accent" : "background", 
      onClick: !selected ? () => selectFn(value) : undefined
    })
  }
  return chips;
}