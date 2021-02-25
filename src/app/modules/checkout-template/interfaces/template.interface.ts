import { DynamicTemplateDataType } from '../../../constants/constant';

export interface ITemplates {
  allowed_values: Array<string>;
  data_type: DynamicTemplateDataType;
  display_name: string;
  filter: number;
  group: number;
  group_headline: string;
  input: string;
  label: string;
  required: number;
  value: string;
  option: IOption[];
}

export interface IOption {
  text: StringConstructor;
  cost: number;
}

export interface templateCharges {
  indexId : number,
  value : any 
}