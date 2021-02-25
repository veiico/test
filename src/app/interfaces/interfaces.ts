/**
 * Created by cl-macmini-51 on 31/07/18.
 */
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}

export interface IDynamicCompilerData {
  templateRef: any;
  inputData?: any;
  template?: string;
  templateUrl?: string;
  css?: string;
  stylesURL?: string;
  inputs?: any;
  rootClass: any;
  imports?: any[];
  animations?: any[];
  declarations?: any;
  outputs?: any;
  encapsulation?:any
}
