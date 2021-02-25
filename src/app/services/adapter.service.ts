import { Injectable } from '@angular/core';
import {
  IAppConfigFromBackend,
  IAppConfig
} from '../../app/themes-custom/interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AdapterService {
  constructor() {}

  fetchAppAdapter(appConfigFromBackend: IAppConfigFromBackend) {
    const appConfig: IAppConfig = {
    backgroundImage : appConfigFromBackend.background_image,
    mobileBackgroundImage : appConfigFromBackend.mobile_background_image,
    showDateFilter : appConfigFromBackend.show_date_filter,
    appDescription : appConfigFromBackend.app_description,
    webHeaderLogo: appConfigFromBackend.web_header_logo,
    formName: appConfigFromBackend.form_name,
    headerColor: appConfigFromBackend.header_color,
    color: appConfigFromBackend.color,
    isDualUserEnable: appConfigFromBackend.is_dual_user_enable,
    terminology: appConfigFromBackend.terminology,
    };
    return appConfig;
  }

  reverseAppAdapter(appConfig: IAppConfig) {
    const reverseAppConfig: IAppConfigFromBackend = {
      background_image : appConfig.backgroundImage,
      mobile_background_image : appConfig.mobileBackgroundImage,
      show_date_filter : appConfig.showDateFilter,
      app_description : appConfig.appDescription,
      web_header_logo: appConfig.webHeaderLogo,
      form_name: appConfig.formName,
      header_color: appConfig.headerColor,
      color: appConfig.color,
      is_dual_user_enable: appConfig.isDualUserEnable,
      terminology: appConfig.terminology,
      };
      return reverseAppConfig;
  }

}
