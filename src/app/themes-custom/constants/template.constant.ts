export const templates = {
  footer: {
    html: `
  <div id="footer" class="footer-container" *ngIf="data && is_enabled">
  <div class="container">
  <!-- top row -->
  <div class="top-row">
  <div class="logo col-xs-12 col-sm-3 col-md-3">
  <a *ngIf="data.logo_redirect_url;else plainTextLogo" [href]="data.logo_redirect_url" target="_blank">
  <img [src]="data.logo" alt="company logo">
  </a>
  <ng-template #plainTextLogo>
  <img *ngIf="!data.logo_redirect_url" [src]="data.logo" alt="company logo">
  </ng-template>
  </div>
  <div class="columns">
  <div class="column" *ngFor="let column of data.columns">
  <p class="column-row" *ngFor="let row of column">
  <a *ngIf="row.url;else plainText" [href]="row.url" target="_blank">{{row.label}}</a>
  <ng-template #plainText>
  {{row.label}}
  </ng-template>
  </p>
  </div>
  </div>
  </div>
  <!-- bottom row -->
  <div class="bottom-row" *ngIf="(data.downloadAppLinks && data.downloadAppLinks.length )|| ( data.socialLinks && data.socialLinks.length) ">
  <div class=" download-app-links" *ngIf="data.downloadAppLinks && data.downloadAppLinks.length">
  <div class="inner-section">
  <div class="download-heading">
  {{data.downloadAppText}}
  </div>
  <div class="download-data">

  <ng-container *ngFor="let downloadAppLink of data.downloadAppLinks">
  <a class="link" *ngIf="downloadAppLink.url;else plainTextSocial" [href]="downloadAppLink.url" target="_blank">
  <img class="link-img" [src]="downloadAppLink.image" [alt]="downloadAppLink.text">
  </a>
  <ng-template #plainTextSocial>
  <img class="link-img without-link" [src]="downloadAppLink.image" [alt]="downloadAppLink.text">
  </ng-template>
  </ng-container>
  </div>
  </div>

  </div>
  <div class="social-links" *ngIf="data.socialLinks && data.socialLinks.length">
  <div class="inner-section">
  <div class="social-heading">
  {{data.socialText}}
  </div>
  <div class="social-data">

  <ng-container *ngFor="let social of data.socialLinks">
  <a class="social-link" *ngIf="social.url;else plainTextSocial" [href]="social.url" target="_blank">
  <img class="social-link-img" [src]="social.image" [alt]="social.text">
  </a>
  <ng-template #plainTextSocial>
  <img class="social-link-img social-without-link" [src]="social.image" [alt]="social.text">
  </ng-template>
  </ng-container>
  </div>
  </div>

  </div>

  </div>
  <div class=" copyright" [innerHTML]="data.copyright"></div>
  </div>
  </div>
  `,
    css: `
  .footer-container {
  background-color:var(--footer_bg_color);
  min-height: var(--footer_height);
  color: var(--footer_font_color);
  padding: 20px 0;
  }
  .footer-container .container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  }
  .footer-container .top-row {
  display: flex;
  flex-grow: 1;
  padding: 40px 15px;
  text-align: center;
  justify-content: space-between;
  flex-direction: column;
  }
  .footer-container .top-row .logo {
  padding: 0;
  margin-bottom: 30px;
  }
  .footer-container .top-row .logo img {
  max-height: 50px;
  max-width: 150px;
  }
  .footer-container .top-row .columns {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  flex-direction: column;
  }
  .footer-container .top-row .columns .column {
  text-align: left;
  margin-bottom: 20px;
  }
  .footer-container .top-row .columns .column .column-row {
  font-size: 14px;
  font-family: 'ProximaNova';
  }
  .footer-container .top-row .columns .column .column-row a {
  color: var(--footer_font_color);
  }
  .footer-container .top-row .columns .column .column-row:first-child {
  font-size: 16px !important;
  }
  .footer-container .top-row .columns .column:last-child {
  margin: 0;
  }
  .footer-container .bottom-row {
  border-top: 1px solid #5a5a5a;
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  }
  .footer-container .bottom-row .inner-section {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  }
  .footer-container .bottom-row .inner-section .social-heading {
  margin-right: 25px;
  font-size: 18px;
  font-family: 'ProximaNova';
  font-weight: 600;
  letter-spacing: 1.2px;
  padding-top: 10px;
  }
  .footer-container .bottom-row .inner-section .download-heading {
  margin-right: 25px;
  font-size: 18px;
  font-family: 'ProximaNova';
  font-weight: 600;
  letter-spacing: 1.2px;
  padding-top: 10px;
  }
  .footer-container .bottom-row .inner-section .social-data {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  }
  .footer-container .bottom-row .inner-section .download-data {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  }
  .footer-container .bottom-row .social-links {
  text-align: center;
  margin-bottom: 10px;
  }
  .footer-container .bottom-row .social-links a.social-link {
  text-decoration: none;
  margin-right: 20px;
  }
  .footer-container .bottom-row .social-links .social-without-link {
  text-decoration: none;
  margin-right: 20px;
  }
  .footer-container .bottom-row .social-links .social-link-img {
  height: 25px;
  }
  .footer-container .bottom-row .download-app-links {
  text-align: center;
  margin-bottom: 10px;
  }
  .footer-container .bottom-row .download-app-links a.link {
  text-decoration: none;
  margin-right: 20px;
  }
  .footer-container .bottom-row .download-app-links .without-link {
  text-decoration: none;
  margin-right: 20px;
  }
  .footer-container .bottom-row .download-app-links .link-img {
  max-width: 110px;
  width: 100%;
  height: 40px;
  object-fit: contain;
  }
  .copyright {
  line-height: 2;
  font-size: 13px;
  padding: 2em 0 0 0;
  text-align: center;
  }
  @media screen and (min-width: 768px) {
  .footer-container .top-row {
  padding: 40px 0px;
  flex-direction: row;
  text-align: initial;
  }
  .footer-container .top-row .logo {
  margin-bottom: 0px;
  }
  .footer-container .top-row .columns {
  flex-direction: row;
  }
  .footer-container .top-row .columns .column {
  margin-bottom: 0px;
  max-width: 250px;
  }
  .footer-container .bottom-row {
  flex-direction: row;
  }
  .footer-container .bottom-row .inner-section {
  flex-direction: row;
  align-items: center;
  }
  .footer-container .bottom-row .social-links {
  text-align: left;
  margin-bottom: 0px;
  }
  }
  @media screen and (min-width: 1200px) {
  .footer-container .top-row .columns .column {
  max-width: initial;
  }
  }
  a {
  color: #fff;
  cursor: pointer;
  }
  p {
  margin: 0px 0 18px;
  }
  @media screen and (min-width: 768px) and (max-width: 992px) {
  .footer-container .bottom-row .inner-section {
  flex-direction: column;
  }
  }
  `
  },
  fetchLocation: {
    html: `
    <div class="newPage fetchlocation">
    <app-header-dynamic style="height:0px;padding: 0px;" class="col-xs-12" [headerData]="data"></app-header-dynamic>
    <div class="fetch-location" *ngIf="config" id="fetchLocation"
    [ngStyle]="{'background-image':config && config.background_image ? getBackgroundImage() : 'url(assets/img/background-home.jpg)'}">

    <div class="main" *ngIf="!isPlatformServer;else serverShimmer">
    <div class="root">
    <div class="pop">
    <div class="logo" *ngIf="config.web_header_logo || content">
    <img [src]="content && content.homebox && content.homebox.data.logo ? content.homebox.data.logo : config.web_header_logo" />
    </div>
    <div class="heading">
    <h1>
    {{config ? config.app_description : 'We get what you love'}}
    </h1>
    </div>
    <form [formGroup]="locationForm"
    (ngSubmit)="onLocationSubmit(locationForm,$event,'shake')"
    autocomplete="off">
    <div class="form" [ngClass]="{'flip180': showFindBusiness}">
    <div class="viewContent customView"
    [ngClass]="{'displayCustom': showDefaultCustom && !showFindBusiness,'hideCustom': showFindBusiness}">
    <div class="btnView" title="{{terminology.CUSTOM_ORDER}}">
    <button class="btn" (click)="goToCustomCheckout('1')" type="button">
    {{terminology.CUSTOM_ORDER}}
    </button>
    </div>
    <div class="btnView">
    <button class="btn" title="{{terminology.GO_TO_MARKETPLACE}}">
    {{terminology.GO_TO_MARKETPLACE}}
    </button>
    </div>
    </div>
    <div class="viewContent normalView"
    [ngClass]="{'hideVisibility': !showFindBusiness, 'showVisibility': showFindBusiness}">
    <!-- [@slideInOutState]="!showFindBusiness" -->
    <div class="location">
    <app-dynamic-autocomplete #dynamicAutocompleteComponent>
    </app-dynamic-autocomplete>
    </div>
    <div class="btnView"
    *ngIf="showFindBusiness && showDefaultCustom">
    <button class="btn">
    <ng-container i18n>Continue</ng-container>
    </button>
    </div>
    <div class="btnView"
    *ngIf="showFindBusiness && !showDefaultCustom">
    <button class="btn" title="{{terminology.GO_TO_MARKETPLACE}}">
    <ng-container>
    {{terminology.GO_TO_MARKETPLACE}}
    </ng-container>
    </button>
    </div>
    <div class="text-center back-link"
    *ngIf="showFindBusiness && showDefaultCustom">
    <span (click)="showFindBusiness=false">
    <i class="yfn yfn-left-arrow" style="font-size: 12px;" aria-hidden="true"></i> <ng-container i18n>Back</ng-container>
    </span>
    </div>
    </div>
    </div>
    </form>

    <div class="loginAccount" *ngIf="!loggedIn">
    <p>
    <span class="already" i18n>Already have an account?</span>
    <span class="loginText" (click)="goToLogin()" i18n>Log in</span>
    </p>
    </div>
    </div>
    </div>
    </div>
    <ng-template #serverShimmer>
    <div class="product-shimmer-container">
    <div class="flexDisplay">
    <div class="image-div pulsate block"></div>
    </div>
    <div class="flexDisplay">
    <div class="tagLine pulsate block"></div>
    </div>
    <div class="flexDisplay">
    <div class="button pulsate block"></div>
    </div>
    <div class="flexDisplay">
    <div class="button pulsate block"></div>
    </div>
    <div class="flexDisplay">
    <div class="loginTitle pulsate block"></div>
    </div>
    </div>
    </ng-template>
    </div>
    </div>
  <app-order-placed-popup-dynamic></app-order-placed-popup-dynamic>
    <app-dynamic-footer></app-dynamic-footer>
  `,
    css: `
	@import url("/en/assets/css/block-shimmer.scss");
  /deep/ .fetchlocation app-header-dynamic .top-header {
    height: 7rem !important;
    background-color: transparent !important;
    border-bottom: 2px solid transparent !important;
    position: absolute;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-left .merchant-logo .logo img {
    display: none;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .profile i {
    color: var(--white) !important;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .dropdown-menu {
    top: 34px;
    min-width: 0px;
    left: 0rem !important;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .changeUrl, .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .notification, .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .search {
    display: none;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .language a {
    padding: 5px 10px !important;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items li:not(.drop) a:not(.dropAnchor) {
    background-color: var(--theme);
    color: white;
    border: 1px solid var(--theme);
    border-radius: 4px;
    height: 35px;
    margin-right: 10px;
    transition: 0.5s;
 }
  .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items li:not(.drop) a:not(.dropAnchor):hover {
    opacity: 1 !important;
    color: var(--theme) !important;
    background-color: white;
    border: 1px solid var(--theme);
 }
  .newPage .fetch-location {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    min-height: calc(100vh);
    height: auto;
    position: relative;
 }
  .newPage .fetch-location::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-image: linear-gradient(0deg, rgba(38, 37, 37, 0.61), rgba(38, 37, 37, 0.66));
    opacity: 0.6;
 }
  .newPage .fetch-location .languageDrop {
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: 10;
 }
  .newPage .fetch-location .login {
    position: absolute;
    top: 25px;
    right: 25px;
    z-index: 10;
 }
  .newPage .fetch-location .login .loginBtn {
    font-family: 'ProximaNova-Regular';
    font-size: 16px;
    border-radius: 4px !important;
    color: var(--white);
    background-color: var(--theme);
    border: 1px solid var(--theme);
    transition: 0.5s;
    max-width: 150px;
    min-width: 100px;
    height: 35px;
 }
  .newPage .fetch-location .login .loginBtn:hover {
    color: var(--theme);
    background-color: var(--white);
    border: 1px solid var(--theme);
 }
  .newPage .fetch-location .main {
    position: absolute;
    display: flex !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
    display: table;
 }
  .newPage .fetch-location .main .root {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    max-width: 1040px;
 }
  .newPage .fetch-location .main .root .pop {
    z-index: 10;
    min-width: 538px;
    padding: 25px 80px;
    width: auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.24), 0 5px 20px 0 rgba(0, 0, 0, 0.5);
 }
  .newPage .fetch-location .main .root .pop .logo {
    height: 50px;
    text-align: center;
 }
  .newPage .fetch-location .main .root .pop .logo img {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    width: auto;
 }
  .newPage .fetch-location .main .root .pop .heading h1 {
    text-align: center;
    font-family: 'ProximaNova-Regular';
    font-size: 24px;
    color: #4a4a4a;
    margin: 40px 0 30px;
 }
  .newPage .fetch-location .main .root .pop .form {
    position: relative;
    min-height: 150px;
    height: 100%;
    width: 100%;
    -webkit-transition: all 600ms;
    transition: all 600ms;
    z-index: 20;
 }
  .newPage .fetch-location .main .root .pop .displayCustom {
    display: block;
 }
  .newPage .fetch-location .main .root .pop .hideCustom {
    display: none;
 }
  .newPage .fetch-location .main .root .pop .viewContent {
    position: absolute;
    width: 100%;
 }
  .newPage .fetch-location .main .root .pop .viewContent .location {
    margin-bottom: 20px;
 }
  .newPage .fetch-location .main .root .pop .viewContent .btnView button {
    width: 100%;
    height: 50px;
    color: var(--white);
    border: 1px solid var(--theme);
    background-color: var(--theme);
    border-radius: 4px !important;
    font-size: 20px;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    font-family: 'ProximaNova-Regular';
    margin-bottom: 20px;
    transition: 0.3s all;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
 }
  .newPage .fetch-location .main .root .pop .viewContent .btnView button:hover {
    color: var(--theme);
    border: 1px solid var(--theme);
    background-color: var(--white);
 }
  .newPage .fetch-location .main .root .pop /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
    height: 50px !important;
    width: 100% !important;
 }
  .newPage .fetch-location .main .root .pop /deep/ .autoCompleteGoogle .auto-detect {
    position: absolute;
    right: 0;
    height: 50px !important;
    width: 40px !important;
    background: #fff !important;
    border: 1px solid #e5e5e5 !important;
    border-left: 0px !important;
    border-radius: 4px !important;
 }
  .newPage .fetch-location .main .root .pop /deep/ .autoCompleteGoogle .auto-detect .hideSpan {
    display: none !important;
 }
  .newPage .fetch-location .main .root .pop /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete input {
    background: #fff !important;
    border: 1px solid #e5e5e5 !important;
    border-radius: 4px !important;
    font-family: 'ProximaNova-Regular';
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #343434 !important;
 }
  .newPage .fetch-location .main .root .pop .back-link {
    font-family: 'ProximaNova-Regular';
    font-size: 15px;
    color: #9b9b9b;
    transition: 0.5s;
 }
  .newPage .fetch-location .main .root .pop .back-link span {
    cursor: pointer;
 }
  .newPage .fetch-location .main .root .pop .back-link span:hover {
    color: black;
 }
  .newPage .fetch-location .main .root .pop .hideVisibility {
    visibility: hidden;
    height: 0;
 }
  .newPage .fetch-location .main .root .pop .showVisibility {
    visibility: visible;
    height: auto;
 }
  .newPage .fetch-location .main .root .pop .loginAccount {
    margin-top: 30px;
 }
  .newPage .fetch-location .main .root .pop .loginAccount p {
    font-family: 'ProximaNova-Regular';
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
 }
  .newPage .fetch-location .main .root .pop .loginAccount p .already {
    color: #9b9b9b;
 }
  .newPage .fetch-location .main .root .pop .loginAccount p span.loginText {
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    display: inline-block;
    cursor: pointer;
    color: #2396ff;
 }
  .newPage .fetch-location .main .root .pop .loginAccount p span.loginText:before {
    content: "";
    position: absolute;
    z-index: -1;
    left: 0;
    right: 100%;
    bottom: 0;
    background: #2396ff;
    height: 4px;
    -webkit-transition-property: right;
    transition-property: right;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
 }
  .newPage .fetch-location .main .root .pop .loginAccount p span.loginText:hover:before {
    right: 0;
 }
  .newPage .product-shimmer-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    max-width: 500px;
    height: 100%;
    width: 100%;
    display: table;
    z-index: 100;
    padding: 15px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.24), 0 5px 20px 0 rgba(0, 0, 0, 0.5);
 }
  .newPage .product-shimmer-container .flexDisplay {
    display: flex;
    justify-content: center;
 }
  .newPage .product-shimmer-container .flexDisplay .image-div {
    height: 50px;
    width: 120px;
 }
  .newPage .product-shimmer-container .flexDisplay .tagLine {
    margin-top: 20px;
    width: 50%;
    height: 20px;
 }
  .newPage .product-shimmer-container .flexDisplay .button {
    margin-top: 20px;
    width: 70%;
    height: 50px;
 }
  .newPage .product-shimmer-container .flexDisplay .loginTitle {
    margin-top: 20px;
    width: 70%;
    height: 15px;
 }
  @media only screen and (max-width: 990px) {
    .fetch-location {
      background-size: cover;
      background-position: bottom;
   }
 }
  @media only screen and (max-width: 730px) {
    .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .profile .profileDrop i {
      color: var(--white) !important;
   }
    .newPage /deep/ app-header-dynamic .top-header .header .nav-right .items .profile .dropdown-menu {
      left: -6rem !important;
   }
    .newPage .fetch-location {
      background-size: contain;
      background-position: top;
      background-color: #fff;
   }
    .newPage .fetch-location::before {
      background: -moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 32%);
      background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 32%);
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 32%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0);
      opacity: 1;
   }
    .newPage .fetch-location .main {
      padding-top: 0px;
      position: absolute;
      bottom: 80px;
      width: 100%;
   }
    .newPage .fetch-location .main .root .pop {
      border-radius: 0px;
      width: 100%;
      min-width: unset;
      box-shadow: none;
      padding: 30px;
      background: transparent;
   }
 }
  :host /deep/ app-autocomplete app-map-popup app-modal div.model-dialog {
    margin-top: 85px !important;
 }


 .card-shimmer-container {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
 }
  .card-shimmer-container:after {
    content: '';
    background: linear-gradient(-45deg, #ddd 0, #f0f0f0 0, #ddd 12, #f0f0f0 4a);
    background-size: 535% 100%;
    -webkit-animation: 2.25s infinite Gradient;
    animation: 2.25s infinite Gradient;
    width: 100%;
    z-index: 9999;
    position: absolute;
    height: 100%;
    background-repeat: no-repeat;
 }
  .fpo {
    position: relative;
    margin: 25% auto;
    display: block;
 }
  .pulsate {
    background: linear-gradient(-45deg, #ddd, #f0f0f0, #ddd, #f0f0f0);
    background-size: 400% 400%;
    -webkit-animation: Gradient 2.25s ease infinite;
    -moz-animation: Gradient 2.25s ease infinite;
    animation: Gradient 2.25s ease infinite;
 }
  .block {
    display: block;
    width: 271px;
    height: 16px;
    color: black;
 }
  .block2 {
    width: 78px;
    height: 8px;
    margin-bottom: 8px;
 }
  .block3 {
    width: 131px;
    height: 8px;
    margin-bottom: 16px;
 }
  .circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    float: right;
 }
  #card {
    box-sizing: border-box;
    width: 335px;
    background: #fff;
    position: relative;
    margin: auto;
    margin-bottom: 10px;
    top: 25%;
 }
  .card-image {
    box-sizing: border-box;
    display: block;
    width: 335px;
    height: 243px;
    background: #fafafa;
    padding: 16px;
 }
  .card-content {
    clear: both;
    box-sizing: border-box;
    padding: 16px;
    background: #fff;
 }
  @-webkit-keyframes Gradient {
    0% {
      background-position: 0% 50%;
   }
    50% {
      background-position: 100% 50%;
   }
    100% {
      background-position: 0% 50%;
   }
 }
  @-moz-keyframes Gradient {
    0% {
      background-position: 0% 50%;
   }
    50% {
      background-position: 100% 50%;
   }
    100% {
      background-position: 0% 50%;
   }
 }
  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
   }
    50% {
      background-position: 100% 50%;
   }
    100% {
      background-position: 0% 50%;
   }
 }



  `
  },
  header: {
    html: `
    <div class="top-header">
    <div class="header">
        <div class="nav-left">
            <div class="merchant-logo">
                <a class="logo" (click)="goToHome()">
                    <img [src]="headerWrapper.clientLogo" [alt]="title">
                </a>
            </div>
            <div class="deliveryMode deliveryHideAt700"
                [ngClass]="{'white-theme': (formSettings.header_color == '#fff' || formSettings.header_color == '#ffffff' )}">
                <app-delivery-modes-dynamic *ngIf="showAddressBarOnlyRestaurant || showOnlyInSingleStore"  [method]="deliveryHTMLToShow"></app-delivery-modes-dynamic>
                <app-dynamic-autocomplete [hideMapIcon]="hideMapIcon" *ngIf="showAddressBarOnlyRestaurant"  [ngClass]="{'width350': (formSettings.admin_home_delivery && formSettings.admin_self_pickup)}"  class="ml-10"></app-dynamic-autocomplete>
            </div>
        </div>
        <div class="nav-right">
            <ul class="items">

                <li class="login" *ngIf="formSettings.map_view">
                    <a *ngIf="!mapViewFlag && showAddressBarOnlyRestaurant && (businessCategoryPageHidden || !businessCategoryPage)" (click)="goToMapView(true)">
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                        <span class="hideText">
                            <ng-container i18n>Map View </ng-container>
                        </span>
                    </a>

                    <a *ngIf="mapViewFlag && showAddressBarOnlyRestaurant && (businessCategoryPageHidden || !businessCategoryPage)" (click)="goToMapView(false)">
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                        <span class="hideText">
                            <ng-container i18n>List View </ng-container>
                        </span>
                    </a>
                </li>

                <li *ngIf="headerWrapper.showSearchBar &&
                 headerWrapper.configData.onboarding_business_type !== 805" class="search">
                    <a (click)="goToSearch()">
                        <i class="fa fa-search" aria-hidden="true"></i>
                        <span class="hideText"><ng-container i18n>Search</ng-container></span>
                    </a>
                </li>
                <li *ngIf="!loggedIn" class="login">
                    <a (click)="goToLogin()" data-toggle="modal" data-target="#loginDialog"
                        *ngIf="headerWrapper.configData && headerWrapper.showLoginBtn">
                        <i class="fa fa-user-o" aria-hidden="true"></i>
                        <span class="hideText"><ng-container i18n>Login</ng-container></span>
                    </a>
                </li>
                <li *ngIf="headerWrapper.languageArray && headerWrapper.languageArray.length > 1 &&  !loggedIn" class="language">
                    <a class="text-uppercase dropdown-toggle" data-toggle="dropdown">
                        {{languageSelected}}
                        <span class="caret ml-10"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="drop" *ngFor="let lang of headerWrapper.languageArray">
                            <a class="dropAnchor"
                                (click)="languageChanged(lang.language_code)">{{lang.language_display_name}}</a>
                        </li>
                    </ul>
                </li>
                <li *ngIf="loggedIn" class="notification">
                    <a class="notification">
                        <app-notifications-dynamic (logout)="logout()"></app-notifications-dynamic>
                    </a>
                </li>
                <li *ngIf="loggedIn" class="profile">
                    <a class="dropdown-toggle profileDrop" data-toggle="dropdown">
                        <i class="fa fa-user" aria-hidden="true" *ngIf="!headerWrapper.profileImage"></i>
                        <img [src]="headerWrapper.profileImage" alt="profile image" onerror="this.src='assets/img/name-icon.svg';" *ngIf="headerWrapper.profileImage">
                        <span class="hidden-xs hidden-sm">{{name}}</span>
                        <span class="caret ml-5"></span>
                    </a>
                    <ul class="dropdown-menu" [ngStyle]="{ 'direction' : direction }"
                        [ngClass]="{'dual-user': headerWrapper.headerData ?  headerWrapper.headerData.is_dual_user_enable :0}">
                        <li class="drop"
                            *ngIf="headerWrapper.headerData && headerWrapper.headerData.is_dual_user_enable"
                            (click)="$event.stopPropagation()">
                            <a class="switchA dropAnchor">
                                <ng-container i18n>Switch to
                                    {{headerWrapper.headerData && headerWrapper.headerData.terminology.MERCHANT}} Panel
                                </ng-container>
                                <label class="switch switch custom-switch"
                                 style="margin-bottom: 0px;margin-left: 3px;">
                                    <input type="checkbox"
                                     value="false"
                                      [ngStyle]="{'direction': direction}"
                                        (change)="onAccountSwitch($event)"
                                        attr.aria-label="Switch to {{headerWrapper.headerData && headerWrapper.headerData.terminology.MERCHANT}} Panel">
                                    <span></span>
                                </label>
                            </a>
                        </li>
                        <li class="drop">
                            <a class="dropAnchor" (click)="goToProfile()">
                                <ng-container i18n>Profile</ng-container>
                            </a>
                        </li>
                        <li class="drop" *ngIf="headerWrapper.configData.business_model_type === 'FREELANCER'">
                            <a class="dropAnchor text-capitalize" (click)="freelancerOrders()">
                                {{terminology.ORDERS || 'Orders'}}
                            </a>
                        </li>

                        <li class="drop" *ngIf="terminology">
                            <a class="dropAnchor" (click)="goToOrders()">
                                {{terminology.ORDERS || 'Orders'}}
                            </a>
                        </li>
                        <li class="drop" *ngIf="formSettings.is_recurring_enabled">
                            <a class="dropAnchor" (click)="goToSubscription()">
                            <ng-container>{{terminology.SUBSCRIPTIONS || 'Subscriptions'}}</ng-container>
                            </a>
                        </li>
                        <li class="drop" *ngIf="headerWrapper.refStatus">
                            <a class="dropAnchor" (click)="goToRefer()">
                                {{terminology.REFERRAL}}
                            </a>
                        </li>
                        <li class="drop" *ngIf="headerWrapper.configData.is_loyalty_point_enabled">
                            <a class="dropAnchor" (click)="goToLoyaltyPoints()">
                                {{terminology.LOYALTY_POINTS}}
                            </a>
                        </li>
                        <li class="drop"
                            *ngIf="!headerWrapper.configData.is_demo && !headerWrapper.configData.hide_gdpr && terminology && langJson"
                            [hidden]="headerWrapper.configData.business_model_type === 'FREELANCER'">
                            <a class="dropAnchor text-capitalize" (click)="goToSettings()">
                            {{terminology.CUSTOMER_RIGHTS || 'Customer Rights'}}
                            </a>
                        </li>
                        <li class="drop" *ngIf="headerWrapper.walletEnabled && terminology">
                            <a class="dropAnchor text-capitalize" (click)="goToWallet()">
                                {{terminology.WALLET}}
                            </a>
                        </li>
                        <li class="drop" *ngIf="terminology &&
                     headerWrapper.configData.is_gift_card_activated">
                            <a class="dropAnchor text-capitalize" (click)="goToGiftCard()">
                                {{terminology.GIFT_CARD}}
                            </a>
                        </li>
                        <li *ngIf="terminology && (headerWrapper.configData.is_reward_active || (loginData && loginData.vendor_details.is_reward_active_for_customer))"
                            class="drop">
                            <a (click)="goToReward()" class="text-capitalize dropAnchor">
                                <ng-container i18n>{{terminology.REWARD}} Plans</ng-container>
                            </a>
                        </li>
                        <li class="drop">
                            <a class="dropAnchor text-capitalize" (click)="logout()">
                                <ng-container i18n>Logout</ng-container>
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>
        </div>
    </div>
    <div class="deliveryMode deliveryShowAt700" [ngClass]="{'white-theme': (formSettings.header_color == '#fff' || formSettings.header_color== '#ffffff' )}"
      *ngIf="showAddressBarOnlyRestaurant">
	    <app-delivery-modes-dynamic [method]="deliveryHTMLToShow" [ngClass]="{'width32': showDeliveryMode}"></app-delivery-modes-dynamic>
	    <app-dynamic-autocomplete [hideMapIcon]="hideMapIcon" [ngClass]="{'width80': !showDeliveryMode}" class="ml-5 width64"></app-dynamic-autocomplete>
	</div>
</div>

<!-- for showing error messages start-->
<app-pop-up-dynamic></app-pop-up-dynamic>
<app-pop-up-modal-dynamic></app-pop-up-modal-dynamic>
<!-- for showing error messages end -->

<!-- login dialog -->
<div id="loginDialog" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <div class="modal-content">
            <div class="modal-body">
                <button type="button"
                 class="close"
                  (click)="showSignInFalse()"
                   data-dismiss="modal">&times;</button>
                <app-login-dynamic [showFbSignIn]="showFbSignIn" [headerData]="headerData">
                </app-login-dynamic>
            </div>
        </div>
    </div>
</div>

<!-- signup dialog -->
<div id="signupDialog" style="max-height:calc( 100% - 12px ); overflow:scroll;" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <div class="modal-content">
            <div class="modal-body">
                <button type="button"
                 class="close"
                  data-dismiss="modal">&times;</button>
                <app-signup-dynamic></app-signup-dynamic>
            </div>
        </div>
    </div>
</div>

<!-- forgot modal dialog -->
<div id="forgotModal" class="modal fade" role="dialog" style="margin: 10px;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button"
                 class="close"
                  style="margin-top: -15px!important;"
                    data-dismiss="modal">&times;</button>
                <h4 class="modal-title" [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Forgot Password ?</ng-container>
                </h4>
            </div>
            <form role="form" [formGroup]="forgotForm" (keydown)="keyDownFunction($event)">
                <div class="modal-body">
                    <div class="form-group frm-grp-set">
                        <!-- email phone input field -->
                        <app-phone-email-hybrid-dynamic (valueUpdate)="phoneEmailValueChange($event)">
                        </app-phone-email-hybrid-dynamic>
                        <app-control-messages-dynamic *ngIf="forgotForm.controls.phone_email" [control]="forgotForm.controls.phone_email"></app-control-messages-dynamic>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit"
                     [ngStyle]="{ 'direction' : direction }"
                      class="btn forgotButton"
                        (click)="forgotEmailOtp()"
                         [disabled]="!forgotForm.valid">
                        <ng-container i18n>Submit</ng-container>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- otp modal dialog -->
<div id="otpDialog" style="max-height:calc( 100% - 12px ); overflow:scroll;"
class="modal fade"
role="dialog">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-body">
      <button type="button" class="close"
        (click)="closeOTPDialog()"
        >&times;</button>
   <app-otp-verification-dynamic *ngIf="otpObjectDetails" [otpData]="otpObjectDetails"></app-otp-verification-dynamic>
    </div>
  </div>
</div>
</div>



  `,
    css: `
  .top-header {
    background: var(--header_bg_color);
    height: 7rem;
    border-bottom: 2px solid var(--header_bg_color);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1005;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    padding: 1rem 1rem;
 }
  .top-header.heightHeader {
    height: 10rem;
 }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
 }
  .forgotButton {
    color: white;
    border-color: var(--theme);
    background-color: var(--theme);
 }
  .merchant-logo .logo {
    height: 50px;
    display: flex;
    align-items: center;
 }
  .merchant-logo .logo img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
 }
  @media only screen and (max-width: 576px) {
    .nav-left .white-theme .autoCompleteGoogle form .input-group app-jw-google-autocomplete, .deliveryShowAt700 .white-theme .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
      background-color: #f9f8f8 !important;
   }
 }
  .nav-left /deep/ .autoCompleteGoogle, .deliveryShowAt700 /deep/ .autoCompleteGoogle {
    position: relative;
    border-radius: 3px;
 }
  .nav-left /deep/ .autoCompleteGoogle .errorpop, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop, .nav-left /deep/ .autoCompleteGoogle .infopop, .deliveryShowAt700 /deep/ .autoCompleteGoogle .infopop {
    width: 100%;
    background-color: #2396ff;
    position: absolute;
 }
  .nav-left /deep/ .autoCompleteGoogle .errorpop::before, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop::before, .nav-left /deep/ .autoCompleteGoogle .infopop::before, .deliveryShowAt700 /deep/ .autoCompleteGoogle .infopop::before {
    content: " ";
    border: 9px solid transparent;
    position: absolute;
    bottom: 100%;
    border-bottom: 7px solid #2396ff;
 }
  .nav-left /deep/ .autoCompleteGoogle .errorpop::after, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop::after, .nav-left /deep/ .autoCompleteGoogle .infopop::after, .deliveryShowAt700 /deep/ .autoCompleteGoogle .infopop::after {
    content: " ";
    border: 9px solid transparent;
    position: absolute;
    bottom: 100%;
    border-bottom: 7px solid transparent;
    width: 100%;
 }
  .nav-left /deep/ .autoCompleteGoogle .errorpop div.cross-class, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop div.cross-class, .nav-left /deep/ .autoCompleteGoogle .infopop div.cross-class, .deliveryShowAt700 /deep/ .autoCompleteGoogle .infopop div.cross-class {
    top: 12px;
    position: absolute;
    right: 20px;
 }
  .nav-left /deep/ .autoCompleteGoogle .errorpop .dFlex span i.fa.fa-times-circle, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop .dFlex span i.fa.fa-times-circle, .nav-left /deep/ .autoCompleteGoogle .errorpop .dFlex span i.fa.fa-info-circle, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop .dFlex span i.fa.fa-info-circle {
    display: none;
 }
  .nav-left /deep/ .autoCompleteGoogle .errorpop .dFlex span, .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop .dFlex span {
    margin-left: 0 !important;
 }
  .nav-left /deep/ .autoCompleteGoogle app-control-messages div.errorR, .deliveryShowAt700 /deep/ .autoCompleteGoogle app-control-messages div.errorR {
    padding-left: 10px !important;
    position: absolute;
    background: red;
    width: 100%;
    padding: 10px;
    color: white !important;
 }
  .nav-left /deep/ .autoCompleteGoogle app-control-messages div.errorR::before, .deliveryShowAt700 /deep/ .autoCompleteGoogle app-control-messages div.errorR::before {
    content: " ";
    border: 9px solid transparent;
    position: absolute;
    bottom: 100%;
    border-bottom: 7px solid red;
 }
  .nav-left /deep/ .autoCompleteGoogle app-control-messages div.errorR::after, .deliveryShowAt700 /deep/ .autoCompleteGoogle app-control-messages div.errorR::after {
    content: " ";
    border: 9px solid transparent;
    position: absolute;
    bottom: 100%;
    border-bottom: 7px solid transparent;
    width: 100%;
 }
  .nav-left /deep/ .autoCompleteGoogle .auto-detect, .deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect {
    background-color: transparent !important;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    color: white;
    border: 1px solid #fff;
    height: 35px !important;
 }
  .nav-left /deep/ .autoCompleteGoogle .auto-detect span i, .deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect span i {
    top: 0 !important;
    color: var(--header_font_color) !important;
 }
  .nav-left /deep/ .autoCompleteGoogle .auto-detect span .load-span, .deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect span .load-span {
    font-size: 14px;
    margin-left: 12px;
    color: var(--header_font_color);
 }
  @media only screen and (min-width: 768px) {
    .nav-left /deep/ .autoCompleteGoogle .auto-detect, .deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect {
      width: 130px !important;
   }
    .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect {
      width: 130px !important;
   }
    .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect {
      width: 130px !important;
   }
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect {
    background-color: var(--theme) !important;
    color: white;
    border: none;
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect span i, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect span i {
    color: white !important;
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect span .load-span, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect span .load-span {
    color: white !important;
 }
  .nav-left /deep/ .autoCompleteGoogle form .input-group, .deliveryShowAt700 /deep/ .autoCompleteGoogle form .input-group {
    border-radius: 3px;
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect {
    background-color: var(--theme) !important;
    color: white;
    border: none;
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect span i, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect span i {
    color: white !important;
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle .auto-detect span .load-span, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle .auto-detect span .load-span {
    color: white !important;
 }
  .nav-left /deep/ .autoCompleteGoogle form .input-group, .deliveryShowAt700 /deep/ .autoCompleteGoogle form .input-group {
    border-radius: 3px;
 }
  .nav-left /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete, .deliveryShowAt700 /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
    background-color: #fff !important;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    height: 35px !important;
    width: 100% !important;
 }
  .nav-left .white-theme /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
    background-color: #f9f8f8 !important;
 }
  @media only screen and (min-width: 768px) {
    .nav-left /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete, .deliveryShowAt700 /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
      height: 35px !important;
      width: 350px !important;
   }
    .nav-left .width350 /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete, .deliveryShowAt700 .width350 /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
      width: 280px !important;
   }
    .nav-left .white-theme /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete, .deliveryShowAt700 .white-theme /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
      background-color: #f9f8f8 !important;
   }
 }
  .nav-left /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete div input, .deliveryShowAt700 /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete div input {
    padding-left: 10px !important;
    color: #191919;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 20px;
 }
  .nav-left {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    position: relative;
    top: 0;
    left: 0;
 }
  .nav-right {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    position: relative;
    top: 0px;
    right: 0px;
 }
  .nav-right .items {
    display: flex;
    list-style-type: none;
    align-items: center;
    flex-direction: row;
    height: 100%;
    position: relative;
    right: 0;
    top: 0;
    margin-bottom: 0px;
    box-shadow: none;
 }
  .nav-right .items li:not(.drop) {
    display: flex;
    align-items: center;
    height: 100%;
    width: auto;
    position: relative;
 }
  .nav-right .items li:not(.drop) a:not(.dropAnchor) {
    padding: 5px 20px;
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    font-family: 'ProximaNova-Regular';
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--header_font_color);
 }
  .nav-right .items li:not(.drop) a:not(.dropAnchor) i {
    margin-right: 5px;
    font-size: 18px;
 }
  .nav-right .items li:not(.drop) a:not(.dropAnchor):hover:not(.notification) {
    opacity: 0.7;
 }
  .nav-right .items li:not(.drop) .profileDrop i {
    padding: 1rem;
   /* border: 1px solid red;
    */
    border-radius: 40px;
    width: 30px;
    height: 30px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: var(--theme);
    color: var(--header_bg_color);
    margin-right: 0.5rem;
 }
  .nav-right .items li:not(.drop) .profileDrop img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 5px;
 }
  .nav-right .items .dropdown-menu {
    top: 47px;
    border-radius: 0;
    left: -90px;
    background: var(--header_bg_color);
 }
  .nav-right .items .dropdown-menu li.drop a.dropAnchor {
    cursor: pointer;
    color: var(--header_font_color);
 }
  .nav-right .items .dropdown-menu li.drop a.dropAnchor:hover {
    background: #fff;
    color: var(--theme) !important;
 }
  .deliveryShowAt700 {
    display: none !important;
 }
  .dFlex {
    display: flex;
    align-items: center;
 }
  .ml-10 {
    margin-left: 10px;
 }
  .ml-5 {
    margin-left: 5px;
 }
  .deliveryMode {
    margin-left: 40px;
    display: flex;
    align-items: center;
 }
  .pt-10 {
    padding-top: 10px;
 }
  .switchA {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: inherit;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
 }
  @media only screen and (min-width: 700px) {
    .top-header {
      padding: 5px 5rem;
      height: 70px !important;
      display: flex;
      align-items: center;
   }
    .dropdown-menu {
      left: -1rem !important;
   }
 }
  @media only screen and (max-width: 1200px) {
    .items li a {
      padding: 5px 10px !important;
   }
    .items li a i {
      margin-right: 0px !important;
   }
    .items li a .hideText {
      display: none;
   }
 }
  @media only screen and (max-width: 1090px) {
    .deliveryHideAt700 {
      display: none;
   }
    .white-theme.deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect {
      background-color: var(--theme) !important;
      border: none;
   }
    .white-theme.deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect span i {
      color: white !important;
   }
    .white-theme.deliveryShowAt700 /deep/ .autoCompleteGoogle .auto-detect span .load-span {
      color: white !important;
   }
    .white-theme.deliveryShowAt700 /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete {
      background-color: #f9f8f8 !important;
   }
    .deliveryShowAt700 {
      display: flex !important;
      height: 40px !important;
   }
    .deliveryShowAt700 .width32 {
      width: 32%;
   }
    .deliveryShowAt700 .width64 {
      width: 100%;
   }
    .deliveryShowAt700 .width80 {
      width: 100% !important;
      margin-left: 0px;
   }
    .deliveryShowAt700 /deep/ .autoCompleteGoogle app-control-messages div.errorR {
      padding-left: 10px !important;
   }
    .deliveryShowAt700 /deep/ .autoCompleteGoogle .errorpop, .deliveryShowAt700 /deep/ .autoCompleteGoogle .infopop {
      margin-left: 0px !important;
   }
    .deliveryMode {
      margin-left: 0px;
      padding-top: 5px;
   }
 }
  @media only screen and (max-width: 1090px) {
    .top-header {
      height: auto !important;
      flex-direction: column;
   }
    .deliveryMode {
      padding-top: 27px;
      width: 100%;
      padding-bottom: 20px;
   }
 }
  @media only screen and (max-width: 750px) {
    /deep/ .autoCompleteGoogle .auto-detect {
      width: 18% !important;
   }
    /deep/ .autoCompleteGoogle .auto-detect span i {
      color: var(--header_font_color) !important;
   }
    /deep/ .autoCompleteGoogle .auto-detect span .load-span {
      display: none;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect {
      background-color: var(--theme) !important;
      color: white;
      border: none;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect span i {
      color: white !important;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect span .load-span {
      color: white !important;
   }
 }
  @media only screen and (max-width: 1255px) {
    .newDeliveryModes {
      height: 40px;
   }
 }
  @media only screen and (max-width: 361px) {
    /deep/ .autoCompleteGoogle .auto-detect {
      width: 5rem !important;
   }
    /deep/ .autoCompleteGoogle .auto-detect span .locateme-logo {
      width: 17px;
      height: 17px;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect {
      background-color: var(--theme) !important;
      color: white;
      border: none;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect span i {
      color: white !important;
   }
 }
  @media only screen and (max-width: 411px) {
    /deep/ .autoCompleteGoogle .auto-detect {
      width: 5rem !important;
   }
    /deep/ .autoCompleteGoogle .auto-detect span .locateme-logo {
      width: 17px;
      height: 17px;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect {
      background-color: var(--theme) !important;
      color: white;
      border: none;
   }
    .white-theme /deep/ .autoCompleteGoogle .auto-detect span i {
      color: white !important;
   }
    /deep/ .autoCompleteGoogle .errorpop, /deep/ .autoCompleteGoogle .infopop {
      font-size: 11px;
   }
    /deep/ .autoCompleteGoogle form .input-group app-jw-google-autocomplete div input {
      font-size: 13px;
   }
    /deep/ .autoCompleteGoogle app-control-messages div.errorR {
      font-size: 13px;
      width: 54%;
   }
 }
  @media only screen and (min-width: 415px) and (max-width: 768px) {
    .top-header {
      padding: 5px 3rem;
   }
 }
  .white-theme /deep/ app-delivery-modes div.newDeliveryModes div.delivery-mode-heading {
    background-color: #f9f8f8 !important;
 }
  @media only screen and (min-width: 750px) {
    /deep/ .autoCompleteGoogleForm i {
      position: absolute;
   }
 }
  /deep/ .errorpop, /deep/ .infopop {
    position: relative;
 }
  /deep/ .errorpop div.cross-class, /deep/ .infopop div.cross-class {
    top: 12px;
    position: absolute;
    right: 20px;
 }
  @media only screen and (max-width: 414px) {
    /deep/ .errorpop div.cross-class, /deep/ .infopop div.cross-class {
      top: 10px !important;
      right: 10px !important;
   }
 }
  /deep/ app-delivery-modes .newDeliveryModes .dropdown-menu {
    min-width: auto !important;
 }
 .otpFormStyle {

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  a {
    cursor: pointer;
  }
}
.otpWidth {
  text-align: center;
  text-align: -webkit-center;

  input {
    width: 100%;
  }

  .form-group {
    width: 100%;
  }

  app-control-messages {
    width: 100%;
    display: block;
    text-align: left !important;
  }
}
.fontSize {
  font-size: 20px;
  margin-bottom: 9px!important;
  margin-top: 15px;
}
.otpOption {
  font-family: ProximaNova-Regular;
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.7px;
  text-align: left;
  color: #06aed5;
  padding: 0;
}


  `
  },
  login: {
    html: `
    <div class='container-fluid' id="signinPopup">
  <!-- parent -->
  <div class="row">
    <div class="col-xs-12 card-login">
      <p class="main-heading" [ngStyle]="{ 'direction' : direction }"  *ngIf="!showOtpPopUp">
        <ng-container>{{themeData.heading || (langJson['Sign in to continue'] ? langJson['Sign in to continue'] : 'Sign in to continue')}}</ng-container>
      </p>
      <hr class="line" *ngIf="!showOtpPopUp" [ngStyle]="{ 'direction' : direction }" [style.border-top-color]="profile_color" />
      <div style="clear: both;"></div>
      <p class="main-sub-heading" *ngIf="themeData.sub_heading && !showOtpPopUp" [ngStyle]="{ 'direction' : direction }">
          <ng-container >{{themeData.sub_heading}}</ng-container>
      </p>

      <form role="form" *ngIf="!showFbSignIn" [formGroup]="loginForm" *ngIf="!showOtpPopUp" (keydown)="keyDownFunction($event)" autocomplete="off" style="padding-top:30px">

      <div class="form-group frm-grp-set">
      <!-- email phone input field -->
     <app-phone-email-hybrid-dynamic (valueUpdate)="phoneEmailValueChange($event)">
      </app-phone-email-hybrid-dynamic>
      <app-control-messages-dynamic [control]="loginForm.controls.phone_email"></app-control-messages-dynamic>
        </div>

        <div class="form-group frm-grp-set" *ngIf=!loginViaOtpFlow>

          <label class="control-label fs18" for="siPassword" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Password</ng-container><span style="color:red">*</span>
          </label>
          <div class="input-group">
            <span class="input-group-addon add-on-set">
              <i class="glyphicon glyphicon-lock" aria-hidden="true"></i>
            </span>
            <input id="siPassword" type="password" autocomplete="off" required="required" formControlName="password" [ngStyle]="{ 'direction' : direction }"
              class="focusable form-control custom_register_form-control input-style" i18n-placeholder placeholder="Password"
              data-parsley-minlength="6" />
          </div>
        <app-control-messages-dynamic  [control]="loginForm.controls.password"></app-control-messages-dynamic>
        </div>
        <div class=" text-right" style="padding-bottom:20px;" *ngIf="!loginViaOtpFlow">
          <button type="submit" (click)="loginCheck()" class="btn btn-red" name="login" [ngStyle]="{ 'direction' : direction }" [style.background-color]="profile_color" [disabled]="!loginForm.valid">
            <ng-container i18n> Sign In</ng-container>
          </button> <!-- (click)="loginCheck()" -->
        </div>
        <div class=" text-right" style="padding-bottom:20px;" *ngIf="loginViaOtpFlow">
        <button type="submit" (click)="verifyLoginOtp(0)" class="btn btn-red" name="login" [ngStyle]="{ 'direction' : direction }" [style.background-color]="profile_color" [disabled]="!loginForm.valid">
          <ng-container i18n>Send OTP</ng-container>
        </button> 
      </div>
        <div class="form-group text-center">
          <div class="form-group text-center" style="border-top: 2px dashed #bcbcbc;
                            padding-top: 20px;">
            <div class="col-xs-6" style="text-align: left" [hidden]="!signupShown">
              <p [ngStyle]="{ 'direction' : direction }">
                <ng-container i18n>Not signed up?</ng-container>
                <a style="cursor: pointer" [style.color]="profile_color" (click)="closeLoginPopup()">
                  <ng-container i18n>Sign Up Here</ng-container>
                </a>
              </p>
            </div>
            <div [ngClass]="{'col-xs-6 right-align': signupShown, 'col-xs-12 center-align': !signupShown}" *ngIf="!loginViaOtpFlow">
              <p>
                <a style="cursor: pointer" [ngStyle]="{ 'direction' : direction }" [style.color]="profile_color" (click)="openForgotPopup()">
                  <ng-container i18n>Forgot Password?</ng-container>
                </a>
              </p>
            </div>
            <div *ngIf="appConfig?(appConfig.is_fb_required && (appConfig.facebook_app_id?appConfig.facebook_app_id.length : 0)):0" class="col-xs-12"
              style="text-align: center;padding:0px">
              <button type="button" (click)="loginWithFacebook()" [ngStyle]="{ 'direction' : direction }" id="fbSignin" style="cursor: pointer" class="btn btn-primary btn-lg social-btn">
                <div class="img">
                  <img src="assets/img/fb-new.jpg" alt="facebook logo" height="30" style="padding-right:10px">
                </div>
                <ng-container i18n>Continue with Facebook</ng-container>
              </button>
            </div>
            
            <div *ngIf="appConfig?(appConfig.is_instagram_required && (appConfig.instagram_app_id?appConfig.instagram_app_id.length : 0)):0"
              class="col-xs-12" style="text-align: center;padding:0px">
              <button type="button" (click)="loginWithInstagram()" [ngStyle]="{ 'direction' : direction }" id="fbSignin" style="cursor: pointer" class="btn btn-primary btn-lg social-btn mt-10">
                <div class="img">
                  <img src="assets/img/insta-icon-new.png" alt="insta logo" height="30">
                </div>
                <ng-container i18n>Continue with Instagram</ng-container>
              </button>
            </div>
            <div class="col-xs-12" style="text-align: center;padding:0px" *ngIf="appConfig?(appConfig.is_google_required && (appConfig.google_client_app_id?appConfig.google_client_app_id.length : 0)):0">
              <app-google-login-dynamic (googleInfoEvent)="getGoogleLoginInfo($event)"></app-google-login-dynamic>
            </div>
          </div>
        </div>
      </form>
      <form role="form" class="otpFormStyle" *ngIf="showOtpPopUp" [formGroup]="otpForm" autocomplete="off" style="padding-top:15px">
        <div class="formHeading">
          <p style="font-size:20px;margin:0px;" [ngStyle]="{ 'direction' : direction }" *ngIf="emailMessage">
            <ng-container i18n>Enter the OTP that you’ve recieved on your phone number</ng-container>
          </p>
          <p style="font-size:20px;margin:0px;text-align: center;" [ngStyle]="{ 'direction' : direction }" *ngIf="!emailMessage">
            <ng-container i18n>Enter the OTP that you’ve recieved on your email</ng-container>
          </p>
        </div>
        <div class="otpWidth">
        <label for="OTP" class="fontSize" [ngStyle]="{ 'direction' : direction }">
          <ng-container i18n>Enter OTP</ng-container><span style="color:red">*</span>
        </label>
          <input  type="text" maxlength="6" appNumberOnly autocomplete="off" formControlName="otpValue" class="focusable form-control custom_register_form-control input-style"
            i18n-placeholder placeholder="6 digit OTP" />
          <app-control-messages [control]="otpForm.controls.otpValue"></app-control-messages>
          <div class=" text-center" style="padding-bottom:20px;margin-top: 10px;">
          <button type="submit" class="btn btn-red" name="OTP" (click)="checkForOtpVerification()" [style.background-color]="profile_color"
            [disabled]="!otpForm.valid"><ng-container i18n>Submit</ng-container></button>
          </div>
          <div class="form-group frm-grp-set" style="padding-bottom:20px;">
            <div class="col-xs-12 otpOption" style="text-align: center;" [ngStyle]="{ 'direction' : direction }">
              <a (click)="verifyLoginOtp(1)" style="color: none;cursor: pointer;">
                <ng-container i18n>Resend OTP</ng-container>
              </a>
            </div>
          </div>
        </div>
      </form>
      <form role="form" *ngIf="showFbSignIn" [formGroup]="fbloginForm" autocomplete="off" style="padding-top:30px">

        <div class="form-group frm-grp-set">

          <label for="fbEmail1" class="control-label fs18" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Email</ng-container><span style="color:red">*</span>
          </label>

          <div class="input-group">
            <span class="input-group-addon add-on-set">
              <i class="glyphicon glyphicon-envelope" aria-hidden="true"></i>
            </span>
            <input id="fbEmail1" type="email" autocomplete="off" required="required" formControlName="email" class="focusable form-control custom_register_form-control input-style"
              i18n-placeholder placeholder="Email" [readonly]="emailDisabled" />
          </div>
          <app-control-messages-dynamic [control]="fbloginForm.controls.email"></app-control-messages-dynamic>
        </div>

        <div id="SignUpformTelephone" class="form-group frm-grp-set">
          <app-fugu-tel-input-dynamic class="phone_style"  (phoneValueChange)="phoneChange($event,fbloginForm.controls.phone)"></app-fugu-tel-input-dynamic>
        </div>

        <div class=" text-right" style="padding-bottom:20px;">
          <button type="submit" class="btn btn-red" name="Register" *ngIf="socialLoginType.FACEBOOK == socialLogin" [style.background-color]="profile_color"
            (click)="signInWithFb()" [disabled]="!fbloginForm.valid">
            <ng-container i18n>Sign In</ng-container>
          </button>
          <!-- <button type="submit" class="btn btn-red" name="Register" *ngIf="socialLogin == 'insta'" [style.background-color]="profile_color" (click)="signInWithFb()" [disabled]="!fbloginForm.valid" > <ng-container i18n>Sign In</ng-container></button> -->
        </div>
      </form>
    </div>
  </div>
</div>

  `,
    css: `.parent {
      height: 100%;
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-align-items: center;
      align-items: center;
      font-family: ProximaNova-Regular;
   }
    .card-login {
      background-color: #fff;
      border-radius: 6px;
      padding: 20px;
      padding-bottom: 0;
   }
    .main-heading {
      font-size: 24px;
      font-weight: 300;
      color: #333;
      opacity: 0.8;
      margin-bottom: 0;
      word-break: break-all;
   }
    .add-on-set {
      padding: 17px;
      color: #ccc;
      font-size: 20px;
      background-color: #fff;
   }
    .input-style {
      height: 60px;
      color: #333;
      font-size: 20px;
   }
    .btn-red {
      background-color: #e13d36;
      color: white !important;
      font-size: 18px;
   }
    #fbSignin {
      cursor: pointer;
      font-size: 14px;
   }
    .card-login .line {
      margin: 10px auto;
      width: 60px;
      float: left;
   }
    .social-btn {
      width: 100%;
      background: white;
      border: 1px solid #999;
      color: #999;
      font-size: 15px;
   }
    .social-btn .img {
      display: inline-block;
      padding-right: 10px;
      margin-right: 6px;
   }
    .mt-10 {
      margin-top: 10px;
   }

    .main-sub-heading {
      font-size: 16px;
      margin: 0;
   }
    :host /deep/ app-phone-email-hybrid input {
      height: 60px;
      color: #333;
      font-size: 20px;
   }
    :host /deep/ app-phone-email-hybrid .add-on-set {
      padding: 15px;
      color: #ccc;
      font-size: 20px;
      background-color: #fff;
   }
    `
  },

  signup: {
    html: `
    <div class='container-fluid signup' [ngClass]="{'withoutParent': showSignUp == 3}">
  <div class="row">
    <div class="col-xs-12 card-signup">

      <div class="progressbar" *ngIf="showSignUp!=0 && count>1">
        <ul class="steps" >
          <li class="step" *ngFor="let item of progressBar" [ngClass]="{'step--incomplete': progress < 1, 'step--active': progress ==  item,
              'step--complete': progress >= item+1, 'step--inactive': progress != item}">
            <span class="step__icon"></span>
          </li>
        </ul>
      </div>
      <p class="main-heading" *ngIf="showSignUp == 0" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Sign Up for a new account</ng-container>
      </p>
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showSignUp == 1" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Verification</ng-container>
      </p>
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showSignUp == 2" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Change your phone number</ng-container>
      </p>
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showSignUp == 3" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Enter Additional information</ng-container>
      </p>
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showSignUp == 4" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Confirm Your Email Address</ng-container>
      </p>
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showSignUp == 5" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Change your email address</ng-container>
      </p>

      <!--======================= signup form==================================-->
      <form role="form" *ngIf="showSignUp == 0" [formGroup]="signupForm" autocomplete="off" style="padding-top:30px">

        <div class="form-group">

          <label class="fontSize" for="sFname" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Name</ng-container><span style="color:red">*</span>
          </label>
          <div class="input-group">
            <span class="input-group-addon add-on-set">
              <i class="glyphicon glyphicon-user" aria-hidden="true"></i>
            </span>
            <input id="sFname" type="text" autocomplete="off" [ngStyle]="{ 'direction' : direction }" formControlName="name" class="focusable form-control custom_register_form-control input-style"
              i18n-placeholder placeholder="Name" />
          </div>
          <app-control-messages-dynamic [control]="signupForm.controls.name"></app-control-messages-dynamic>
        </div>

        <label class="fontSize" for="sEmail1" [ngStyle]="{ 'direction' : direction }">
          <ng-container i18n>Email</ng-container><span style="color:red">*</span>
        </label>
        <div class="form-group frm-grp-set">
          <div class="input-group">
            <span class="input-group-addon add-on-set">
              <i class="glyphicon glyphicon-envelope" aria-hidden="true"></i>
            </span>
            <input id="sEmail1" type="email" autocomplete="off" formControlName="email" [ngStyle]="{ 'direction' : direction }" class="focusable form-control custom_register_form-control input-style"
              i18n-placeholder placeholder="Email" [readonly]="emailDisabled" />
          </div>
          <app-control-messages-dynamic [control]="signupForm.controls.email"></app-control-messages-dynamic>
        </div>

        <div class="form-group frm-grp-set" *ngIf="!hidePassword">
            <label class="fontSize" for="sPassword" [ngStyle]="{ 'direction' : direction }">
              <ng-container i18n>Password</ng-container><span style="color:red">*</span>
            </label>
            <div class="input-group">
            <span class="input-group-addon add-on-set">
              <i class="glyphicon glyphicon-lock" aria-hidden="true"></i>
            </span>
            <input id="sPassword" type="password" autocomplete="off" formControlName="password" [ngStyle]="{ 'direction' : direction }"
              class="focusable form-control custom_register_form-control input-style" i18n-placeholder placeholder="Password"
              data-parsley-minlength="6" />
          </div>
          <app-control-messages-dynamic [control]="signupForm.controls.password"></app-control-messages-dynamic>
        </div>

        <div id="SignUpformTelephone" class="form-group frm-grp-set">
          <label class="fontSize" aria-hidden="true" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Phone No.</ng-container><span style="color:red">*</span>
          </label>
          <app-fugu-tel-input-dynamic class="phone_style" [(dialCode)]="country_code"  (phoneValueChange)="phoneChange($event,signupForm.controls.phone)"></app-fugu-tel-input-dynamic>
        </div>

        <div class="form-group frm-grp-set" [ngStyle]="{ 'direction' : direction }" *ngIf="showTerms">
          <label style="font-size: 16px;font-weight: normal;">
            <input type="checkbox" [(ngModel)]="termsPolicy" aria-label="Accept terms of Service and Privacy Policy" [ngModelOptions]="{standalone: true}" />&nbsp;
            <ng-container i18n>By clicking Sign Up, you agree to our</ng-container>
            <a style="cursor: pointer;" *ngIf="!tnc_url" [routerLink]="['/terms-condition']" [target]="'_blank'">
              <ng-container i18n>Terms of Service & Privacy Policy</ng-container>
            </a>
            <a style="cursor: pointer;" *ngIf="tnc_url" [href]="tnc_url" [target]="'_blank'">
              <ng-container i18n>Terms of Service & Privacy Policy</ng-container>
            </a>
          </label>
        </div>

        <div class=" text-right" style="padding-bottom:20px;">
          <button type="submit" *ngIf="!hidePassword" class="btn btn-red" name="Register" [style.background-color]="profile_color"
            (click)="registerCheck()" [disabled]="!signupForm.valid">
            <ng-container i18n>Sign Up</ng-container>
          </button>
          <button type="submit" *ngIf="hidePassword && socialLogin == 'fb'" class="btn btn-red" name="Register" [style.background-color]="profile_color"
                  (click)="registerWithFbCheck()" [disabled]="!phone">
            <ng-container i18n>Sign Up</ng-container>
          </button>
          <button type="submit" *ngIf="hidePassword && socialLogin == 'insta'" class="btn btn-red" name="Register" [style.background-color]="profile_color"
                  (click)="registerWithInstaCheck()" [disabled]="!signupForm.valid" >
            <ng-container i18n>Sign Up</ng-container>
          </button>
          <button type="submit" *ngIf="hidePassword && socialLogin == 'google'" class="btn btn-red" name="Register" [style.background-color]="profile_color"
                  (click)="registerWithGoogleCheck()" [disabled]="!signupForm.valid" >
            <ng-container i18n>Sign Up</ng-container>
          </button>
        </div>
        <div class="form-group text-center">
          <div class="form-group text-center" style="border-top: 2px dashed #bcbcbc;
                            padding-top: 10px;">
            <p class="already_text" [ngStyle]="{ 'direction' : direction }">
              <ng-container i18n>Already have an account?</ng-container>
              <a style="cursor: pointer" [style.color]="profile_color" (click)="openLoginModal()">
                <ng-container i18n>Sign In Here</ng-container>
              </a>
            </p>
          </div>
        </div>
      </form>

      <!--======================= change number form==================================-->
      <form role="form" class="changeNumberFormStyle" *ngIf="showSignUp == 2" [formGroup]="changeNumberForm" autocomplete="off"
        style="padding-top:30px">
        <div class="form-group frm-grp-set">
          <app-fugu-tel-input-dynamic  class="phone_style" [(dialCode)]="country_code"  (phoneValueChange)="phoneChange($event,changeNumberForm.controls.newMobileNumber)"></app-fugu-tel-input-dynamic>
          <app-control-messages-dynamic [control]="changeNumberForm.controls.newMobileNumber"></app-control-messages-dynamic>
        </div>
        <div class=" text-right" style="padding-bottom:20px;">
          <button type="button" class="btn btn-red" name="Back" [ngStyle]="{ 'direction' : direction }" [style.background-color]="profile_color"
            (click)="goBackToOTP()">
            <ng-container i18n>Back</ng-container>
          </button>
          <button type="submit" class="btn btn-red" name="Phone" [ngStyle]="{ 'direction' : direction }" [style.background-color]="profile_color"
            (click)="changeNumberVerification()" [disabled]="!changeNumberForm.valid">
            <ng-container i18n>Submit</ng-container>
          </button>
        </div>
      </form>
      <!--======================= additional form==================================-->
      <form role="form" class="addForm" [formGroup]="form" *ngIf="showSignUp == 3 && fields.length > 0" autocomplete="off" style="padding-top:30px">
        <div class="form-group frm-grp-set" *ngFor="let field of fields; let j = index;">
          <div class="input-group full-width" *ngIf="field.data_type == 'Text'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <div>
              <input [id]="field.display_name" type="text" autocomplete="off" [formControlName]="field.label" class="focusable form-control custom_register_form-control input-style"
                [placeholder]="field.display_name" />
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Number'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <div>
              <input [id]="field.display_name" type="number" autocomplete="off" [formControlName]="field.label" class="focusable form-control custom_register_form-control input-style"
                [placeholder]="field.display_name" />
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Image'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <div>
              <input type="file" [id]="field.label" [formControlName]="field.label" (change)="onFileChange($event)" #fileInput style="display:none;">
              <button class="btn uploadFileButton" appColor hoverbgSimple="true" mat-button (click)="fileInput.click()">
                <ng-container i18n>Upload File</ng-container>
              </button>
              <div style="width:100%;max-height: 100px;overflow: scroll;">
                <div style="width:80px;height:80px;margin: 5px;margin-left: 0;float:left" *ngFor="let img of imageList[field.label];let i = index">
                  <img style="height: 100%;width: 100%;" [src]="img" aria-hidden="true">
                  <span style="position: relative;left: 65px;bottom: 80px;background: #ddd;padding: 1px 2px;" (click)="clearFile(field.label,i)">
                    <i class="fa fa-times" style="color:red"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Date'">
            <label class="fontSze" [for]="field.display_name">{{field.display_name}}</label>
            <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                         [inputId]="field.display_name" [showTime]="false" [id]="field.display_name"
                         [readonlyInput]="true" [formControlName]="field.label"
                         [hideOnDateTimeSelect]="true"
                         placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
            <div>

            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Date-Past'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                         [inputId]="field.display_name" [showTime]="false" [id]="field.display_name"
                         [maxDate]="maxDate" [readonlyInput]="true" [formControlName]="field.label"
                         [hideOnDateTimeSelect]="true"
                         placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
            <div>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Date-Future'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                         [inputId]="field.display_name" [showTime]="false" [id]="field.display_name"
                         [minDate]="minDate" [readonlyInput]="true" [formControlName]="field.label"
                         [hideOnDateTimeSelect]="true"
                         placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
            <div>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Date-Time'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <p-calendar  [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                         [inputId]="field.display_name" [showTime]="true" [id]="field.display_name"
                         [hourFormat]="appConfig.time_format === timeFormat.TWELVE_HOURS ? 12 : 24"
                         [readonlyInput]="true" [formControlName]="field.label"
                         [hideOnDateTimeSelect]="true"
                         placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
            <div>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Datetime-Past'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <p-calendar  [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                         [inputId]="field.display_name" [showTime]="true" [id]="field.display_name"
                         [hourFormat]="appConfig.time_format === timeFormat.TWELVE_HOURS ? 12 : 24"
                         [maxDate]="maxDate" [readonlyInput]="true" [formControlName]="field.label"
                         [hideOnDateTimeSelect]="true"
                         placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
            <div>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Datetime-Future'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <p-calendar  [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                         [inputId]="field.display_name" [showTime]="true" [id]="field.display_name"
                         [hourFormat]="appConfig.time_format === timeFormat.TWELVE_HOURS ? 12 : 24"
                         [minDate]="minDate" [readonlyInput]="true" [formControlName]="field.label"
                         [hideOnDateTimeSelect]="true"
                         placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
            <div>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Email'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <input [id]="field.display_name" type="email" [formControlName]="field.label" class="focusable form-control custom_register_form-control input-style"
              [placeholder]="field.display_name" />
          </div>
          <div id="formTelephone" class="input-group full-width" *ngIf="field.data_type == 'Telephone'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <app-fugu-tel-input-dynamic class="phone_style" [id]="field.display_name"  [(dialCode)]="country_code"  (phoneValueChange)="phoneChange($event,form.controls[field.label])"></app-fugu-tel-input-dynamic>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Checkbox'">
            <div class="">
              <mat-checkbox [formControlName]="field.label" [id]="field.display_name">{{field.display_name}}</mat-checkbox>
            </div>
          </div>
          <div class="input-group full-width" *ngIf="field.data_type == 'Dropdown'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <div class="dropdown">
              <button [id]="field.display_name" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{{field.display_name}}
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                <li [id]="option.id" *ngFor="let option of field.dropdown">
                  <a href="#">{{option.value}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="input-group full-width"  *ngIf="field.data_type == 'Single-Select'">
          <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
          <p-dropdown [options]="field.allowed_values" [formControlName]="field.label" placeholder="Select a value" optionLabel="name"></p-dropdown>
        </div>
        <div class="input-group full-width" *ngIf="field.data_type == 'Multi-Select'">
            <label class="fontSize" [for]="field.display_name">{{field.display_name}}</label>
            <p-multiSelect [options]="field.allowed_values" [formControlName]="field.label" optionLabel="name"></p-multiSelect>
          </div>
          <app-control-messages-dynamic [control]="form.controls[field.label]"></app-control-messages-dynamic>
        </div>
        <div class=" text-right" style="padding-bottom:20px;">
          <button type="submit" mat-button class="btn btn-red" name="Register" [style.background-color]="profile_color" (click)="fieldsRegister()"
            [disabled]="form?!form.valid:0">
            <ng-container i18n>Submit</ng-container>
          </button>
        </div>
      </form>

      <!--=========New Otp form===========-->
      <form role="form" class="otpFormStyle" *ngIf="showSignUp == 1" [formGroup]="otpForm" autocomplete="off" style="padding-top:15px">
        <div class="formHeading">
          <p style="font-size:16px;margin:0px;" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Enter the OTP that you’ve recieved on your phone number</ng-container>
          </p>
        </div>
        <div class="otpWidth">
        <label for="OTP" class="fontSize" [ngStyle]="{ 'direction' : direction }">
          <ng-container i18n>Enter OTP</ng-container><span style="color:red">*</span>
        </label>
          <input [id]="OTP" type="text" maxlength="6" appNumberOnly autocomplete="off" formControlName="otpValue" class="focusable form-control custom_register_form-control input-style"
            i18n-placeholder placeholder="6 digit OTP" />
          <app-control-messages-dynamic [control]="otpForm.controls.otpValue"></app-control-messages-dynamic>
          <button type="submit" class="btn btn-sm btnSubmit" name="OTP" (click)="checkOtpVerification()" [style.background-color]="profile_color"
            [disabled]="!otpForm.valid"><ng-container i18n>Submit</ng-container></button>
          <div class="form-group frm-grp-set" style="padding-bottom:20px;">
            <div class="col-xs-6 otpOption" style="text-align: left;">
              <a (click)="changeMobileNumberUI()" style="color:none;cursor: pointer;" [ngStyle]="{ 'direction' : direction }" [style.color]="profile_color">
                <ng-container i18n>Change Number</ng-container>
              </a>
            </div>
            <div class="col-xs-6 otpOption" style="text-align: right;" [ngStyle]="{ 'direction' : direction }">
              <a (click)="checkResendOTP()" style="color: none;cursor: pointer;" [style.color]="profile_color">
                <ng-container i18n>Resend OTP</ng-container>
              </a>
            </div>
          </div>
        </div>
      </form>

      <!--==========New Email Confirmation Form===============-->
      <div *ngIf="showSignUp == 4" style="padding-top: 15px">
        <div class="formHeading" style="padding-bottom: 0;">
          <p>A confirmation mail is sent to your email {{contact_email}}. If you dont see it check your spam folder or click
            the button below to resend the email. Once it is done click on the link to confirm your email address.</p>
        </div>
        <div>
          <button class="btn btn-sm btnSubmit" (click)="checkEmailVerified()" [style.background-color]="profile_color">Continue</button>
        </div>
        <div class="form-group frm-grp-set" style="padding-bottom:20px;">
          <div class="col-xs-6 otpOption" style="text-align: left;" [ngStyle]="{ 'direction' : direction }">
            <a (click)="checkResendMail()" style="color: none;cursor: pointer;" [style.color]="profile_color">
              <ng-container i18n>Resend confirmation email</ng-container>
            </a>
          </div>
          <div class="col-xs-6 otpOption" style="text-align: right;" *ngIf="!emailChanged">
            <a (click)="changeEmail()" style="color:none;cursor: pointer;" [ngStyle]="{ 'direction' : direction }" [style.color]="profile_color">
              <ng-container i18n>Change Email</ng-container>
            </a>
          </div>
        </div>
      </div>

      <!--======================= change email form==================================-->
      <form role="form" class="changeNumberFormStyle" *ngIf="showSignUp == 5" [formGroup]="changeEmailForm" autocomplete="off"
            style="padding-top:30px">
        <div class="form-group frm-grp-set">


        <label class="fontSize" for="resend-mail" [ngStyle]="{ 'direction' : direction }">
          <ng-container i18n>Email</ng-container><span style="color:red">*</span>
        </label>
          <div class="input-group">
            <span class="input-group-addon add-on-set">
              <i class="glyphicon glyphicon-envelope" aria-hidden="true"></i>
            </span>
            <input type="email" id="resend-mail" autocomplete="off" formControlName="newEmailAddress" [ngStyle]="{ 'direction' : direction }" class="focusable form-control custom_register_form-control input-style"
                   i18n-placeholder placeholder="Email" />
          </div>
          <app-control-messages-dynamic [control]="changeEmailForm.controls.newEmailAddress"></app-control-messages-dynamic>
        </div>
        <div class=" text-right" style="padding-bottom:20px;">
          <button type="button" class="btn btn-red" name="Back" [ngStyle]="{ 'direction' : direction }" [style.background-color]="profile_color"
                  (click)="goBackToEmailVerification()">
            <ng-container i18n>Back</ng-container>
          </button>
          <button type="submit" class="btn btn-red" name="Phone" [ngStyle]="{ 'direction' : direction }" [style.background-color]="profile_color"
                  (click)="changeEmailVerification()" [disabled]="!changeEmailForm.valid">
            <ng-container i18n>Submit</ng-container>
          </button>
        </div>
      </form>

      <!--======================= signup fee ==================================-->
      <section *ngIf="showSignUp == 6" class="changeNumberFormStyle">
        <app-customer-subscription-dynamic [loginResponse]="signUpResponse" (successfullLogin)="successfullLogin($event)"></app-customer-subscription-dynamic>
      </section>
    </div>
  </div>
</div>`,
    css: `.parent {
  height: 100%;
  display: flex;
  display: -webkit-flex;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  align-items: center;
  font-family: 'ProximaNova-Regular';
}
.withoutParent {
  height: 100%;
  width: 100%;
  font-family: 'ProximaNova-Regular';
}

.card-signup {
background-color: #fff;
border-radius: 6px;
padding: 20px;
padding-bottom: 0;
}
.card-signup .line {
margin: 5px auto;
width: 60px;
float: left;
}

.otpWidth {
text-align: center;
text-align: -webkit-center;
}
.otpWidth input {
width: 100%;
}
.otpWidth .form-group {
width: 100%;
}

.otpWidth app-control-messages-dynamic {
width: 100%;
display: block;
text-align: left !important;
}
.formHeading {
opacity: 0.6;
font-family: 'ProximaNova-Regular';
font-size: 16px;
font-weight: normal;
font-style: normal;
font-stretch: normal;
line-height: normal;
letter-spacing: normal;
text-align: left;
color: #525252;
padding-bottom: 25px;
}

@media only screen and (max-width: 768px) {
.card-signup {
padding: 5px;
}
.otpWidth {
text-align: center;
text-align: -webkit-center;
}
.otpWidth input {
width: 100%;
}
.otpWidth .form-group {
width: 100%;
}
.otpWidth app-control-messages-dynamic {
width: 100%;
display: block;
text-align: left !important;
}
}

#fbSignin {
cursor: pointer;
border: none;
background: none;
padding: 0;
font-size: 14px;
}
.main-heading {
font-size: 24px;
font-weight: 300;
color: #333;
opacity: 0.8;
text-align: center;
font-family: 'ProximaNova-Regular';
font-size: 22px;
font-weight: bold;
font-style: normal;
font-stretch: normal;
line-height: normal;
letter-spacing: 0.7px;
text-align: center;
color: #000;
margin-top: 10px;
}

@media screen and (max-width: 576px) {
.main-heading {
font-size: 18px;
}
}
.add-on-set {
padding: 17px;
color: #ccc;
font-size: 20px;
background-color: #fff;
}
.input-style {
color: #333;
height: 60px;
font-size: 20px;
}
.btnSubmit {
border-radius: 8px;
border: solid 1px #fff;
font-size: 16px;
font-style: normal;
font-stretch: normal;
line-height: normal;
letter-spacing: normal;
text-align: center;
color: #fff;
margin: 30px 0 15px 0;
padding: 15px 0;
width: 100%;
}

.otpOption {
font-family: 'ProximaNova-Regular';
font-size: 18.5px;
font-weight: normal;
font-style: normal;
font-stretch: normal;
line-height: normal;
letter-spacing: 0.7px;
text-align: left;
color: #06aed5;
padding: 0;
}
.btn-red {
background-color: #e13d36;
color: white !important;
font-size: 18px;
}
.already_text {
opacity: 0.8;
text-align: center;
color: #7f8388 !important;
}
/deep/ .signup-input {
height: 60px !important;
font-size: 20px;
}

/deep/ .flagInput {
background-color: white !important;
width: 57px !important;
text-align: center !important;
}
/deep/ .flagInput button {
outline: none;
}
.cdk-overlay-container {
position: fixed;
z-index: 9999 !important;
}


.full-width {
width: 100%;
}
.fontSize {
font-size: 18px;
}
.checkbox input[type=checkbox] {
margin-top: 7px;
}
#formTelephone .input-group {
height: 60px !important;
}
#formTelephone .input-group .flagInput {
height: 60px !important;
}
#formTelephone .input-group .fugu-tel-input {
height: 60px !important;
}
#SignUpformTelephone .input-group {
height: 60px !important;
}
#SignUpformTelephone .input-group .flagInput {
height: 60px !important;
}
#SignUpformTelephone .input-group .fugu-tel-input {
height: 60px !important;
}

.addFormData {
display: flex;
flex-wrap: wrap;
justify-content: space-between;
margin-left: 1%;
margin-right: 1%;
}
.input-group {
border: none;
box-shadow: none;
}

.otpFormStyle input[type=number]::-webkit-inner-spin-button, .otpFormStyle input[type=number]::-webkit-outer-spin-button {
-webkit-appearance: none;
-moz-appearance: none;
appearance: none;
margin: 0;
}
.otpFormStyle a {
cursor: pointer;
}
/deep/ .checkbox label, .radio label {
padding-left: 0px !important;
}
/deep/ .mat-checkbox-inner-container input[type=checkbox], input[type=radio] {
margin: 2px 2px 0;
}
/deep/ .mat-checkbox-checked.mat-accent .mat-checkbox-background, .mat-checkbox-indeterminate.mat-accent .mat-checkbox-background {
background-color: #28a0ff;
}

.uploadFileButton {
font-family: 'ProximaNova-Regular';
font-size: 18px;
min-width: 150px;
border: 1px solid var(--theme);
background: var(--theme);
color: #ffffff;
}
.uploadFileButton:hover{
      background:#ffffff;
      color: var(--theme);
  }
.progressbar-animated {
width: 100%;
max-width: 590px;
height: 40px;
margin: 10px auto 30px;
text-align: center;
line-height: 36px;
}

.onboarding-animation .checkmark {
width: 26px;
height: 26px !important;
}
.onboarding-animation .span-loader {
width: 26px;
height: 26px;
}
.steps {
display: flex;
width: 100%;
margin: 0;
padding: 0 0 2rem 0;
list-style: none;
}
.step {
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
flex: 1;
position: relative;
pointer-events: none;
}
.step--active, .step--complete {
cursor: pointer;
pointer-events: all;
}
.step:not(:last-child):before, .step:not(:last-child):after {
display: block;
position: absolute;
top: 50%;
left: 50%;
height: 0.25rem;
content: '';
-webkit-transform: translateY(-50%);
transform: translateY(-50%);
will-change: width;
}
.step:before {
width: 100%;
background-color: #cdcdcd;
}
.step:after {
width: 0;
background-color: var(--blue);
}
.step--complete:after {
width: 100% !important;
opacity: 1;
transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.step__icon {
display: flex;
align-items: center;
justify-content: center;
position: relative;
width: 28px;
height: 28px;
background-color: #cdcdcd;
border: 0.25rem solid set-alpha(#e6e7e8, 0.25);
border-radius: 50%;
color: transparent;
font-size: 2rem;
}

.step__icon:before {
content: '\\002E';
font-size: 53px;
margin-top: -60%;
}


.step--complete.step--active .step__icon {
color: #fff;
transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
.step--incomplete.step--active .step__icon {
border-color: var(--blue);
transition-delay: 0.5s;
}
.step--complete .step__icon {
background-color: var(--blue);
border-color: var(--blue);
color: #fff;
}
.step--complete .step__icon::before {
content: '\\f00c';
font-family: 'fontawesome';
font-size: 18px;
margin-top: 0;
z-index: 1;
}
.step__label {
position: absolute;
bottom: -2rem;
left: 50%;
margin-top: 1rem;
font-size: 0.8rem;
text-transform: uppercase;
}
.step--incomplete.step--inactive .step__label {
color: set-alpha(#e6e7e8, 0.25);
}
.step--incomplete.step--active .step__label {
color: #fff;
}
.signup /deep/ .ui-calendar {
font-family: ProximaNova-Regula;
width: 100%;
height: 50px;
opacity: 1;
border-radius: 2px;
background-color: #fff;
border: solid 1px #d2d2d2;
/* padding: 10px;
*/
font-size: 18px;
}
.signup /deep/ .ui-calendar .ui-inputtext {
width: 100%;
height: 100%;
}

`
  },
  banner: {
    html: `<div class="bannerComponent">
    <div class="row marginZero bannerDiv" *ngIf="!showMultipleBanners">
      <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12  paddingZero">
        <div class="bg-image" *ngIf="!ecomView"
          [ngStyle]="{'background-image':config && config.webapp_logo ? 'linear-gradient(0deg, rgba(38, 37, 37, 0.61), rgba(38, 37, 37, 0.66)),url('+config.webapp_logo+')': ''}">
          <div class="brand_text_div">
            <h1 class="brand_text">{{config ? config.app_description : ''}}</h1>
          </div>
        </div>

      </div>
    </div>
    <div class="row marginZero " *ngIf="showMultipleBanners">
      <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 multiBanners" *ngIf="newList && newList.length > 0">
        <div class="carouselDiv">
          <div id="banner" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators" *ngIf="newList && newList.length > 1">
              <li *ngFor="let newData of newList;let i = index;" data-target="#banner" [attr.data-slide-to]="i"
                [ngClass]="{'active' : i==0}"></li>
            </ol>
            <div class="carousel-inner">
              <div class="item" *ngFor="let newData of newList;let i = index;" [ngClass]="{'active' : i==0}">
                <img [src]="newData.image" class="logo hidden-xs" alt="banner image"
                  (click)="goToParticularRestaurant(newData)" />
                <img [src]="newData.mobile_image || newData.image" class="logo visible-xs" alt="banner image"
                  (click)="goToParticularRestaurant(newData)" />
              </div>
            </div>
            <a [hidden]='true' class="left carousel-control" href="#banner" role="button" data-slide="prev"
              aria-label="go to previous slide">
              <span class="glyphicon glyphicon-chevron-left"></span>
              <i class="fa fa-angle-left" aria-hidden="true"></i>
            </a>
            <a [hidden]='true' class="right carousel-control" id='click-event' href="#banner" role="button"
              data-slide="next" aria-label="go to next slide">
              <span class="glyphicon glyphicon-chevron-right"></span>
              <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    css: `
    .bannerComponent {
      background-color: #ececec;
   }
    .bannerComponent .marginZero {
      margin: 0px;
   }
    .bannerComponent .paddingZero {
      padding: 0px;
   }
    .bannerComponent .bannerDiv .bg-image {
      height: auto;
      position: relative;
      min-height: 270px;
      max-height: 270px;
      width: 100%;
      background-repeat: no-repeat;
      background-position-x: 50%;
      background-size: cover;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div {
      position: absolute;
      top: 0px;
      right: 0px;
      left: 0px;
      bottom: 0px;
      margin: auto;
      margin: auto 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 20rem;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div h1 {
      margin: 0px;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .delivery_mode_button {
      color: #fff !important;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .unselect {
      background: transparent !important;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .selected {
      color: #fff !important;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .selected i {
      color: #fff !important;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .selected span {
      color: #fff !important;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .brand_text {
      font-family: ProximaNova-Regular;
      font-size: 2rem;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-align: center;
      color: #fff;
   }
    .bannerComponent .bannerDiv .bg-image /deep/ .brand_text_div .search_input {
      max-width: 30rem;
      margin: 15px auto;
      width: 100%;
   }
    .bannerComponent .addressBar {
      padding: 5px 15px;
      background-color: var(--theme);
   }
    .bannerComponent .addressBar .together {
      display: flex;
   }
    .bannerComponent .addressBar .together .delivery {
      display: flex;
      justify-content: center;
   }
    .bannerComponent .addressBar .together .autoCompleteWidth {
      width: 44%;
      margin-left: 10px;
      margin-top: 0px;
   }
    .bannerComponent .addressBar /deep/ app-delivery-modes .deliveryModes {
      background-color: #fff;
      padding: 2px;
   }
    .bannerComponent .multiBanners {
      margin-top: 0px;
      background-color: #ececec;
   }
    .bannerComponent .multiBanners .carouselDiv {
      width: 100%;
      min-height: 270px;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel {
      min-height: 270px;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel .carousel-inner {
      min-height: 270px;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel .carousel-inner .item {
      text-align: center;
      text-align: -webkit-center;
      text-align: -moz-center;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel .carousel-inner .item img {
      height: 270px;
      cursor: pointer;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-indicators {
      bottom: 0px !important;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-indicators li {
      background-color: #d2d2d2 !important;
      border-color: #d2d2d2 !important;
      width: 8px !important;
      height: 8px !important;
      margin-left: 10px;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-indicators .active {
      background-color: #fff !important;
      border-color: #fff !important;
      width: 10px !important;
      height: 10px !important;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-control {
      opacity: 1 !important;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-control .fa.fa-angle-left {
      width: 46px;
      height: 45px;
      margin-top: -10px;
      font-size: 30px;
      background-color: #fff;
      border-radius: 50%;
      padding-top: 5px;
      padding-right: 5px;
      color: var(--theme);
      left: 50%;
      position: absolute;
      top: 50%;
      z-index: 5;
      display: inline-block;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-control .fa.fa-angle-right {
      width: 46px;
      height: 45px;
      margin-top: -10px;
      font-size: 30px;
      background-color: #fff;
      border-radius: 50%;
      padding-top: 5px;
      padding-left: 5px;
      color: var(--theme);
      right: 50%;
      position: absolute;
      top: 50%;
      z-index: 5;
      display: inline-block;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-control.left {
      background-image: -webkit-gradient(linear, left top, right top, color-stop(0, transparent), to(transparent)) !important;
   }
    .bannerComponent .multiBanners .carouselDiv .carousel-control.right {
      background-image: -webkit-gradient(linear, left top, right top, color-stop(0, transparent), to(transparent)) !important;
   }
    @media only screen and (max-width: 990px) {
      .addressBar {
        padding: 15px 15px !important;
     }
      .addressBar .together {
        display: block !important;
     }
      .addressBar .together .autoCompleteWidth {
        width: 100% !important;
        margin-left: 0px !important;
        margin-top: 10px !important;
     }
   }
    @media only screen and (max-width: 768px) {
      .carouselDiv {
        width: 100%;
        min-height: 25vw !important;
     }
      .carouselDiv .carousel {
        min-height: 25vw !important;
     }
      .carouselDiv .carousel .carousel-inner {
        min-height: 25vw !important;
     }
      .carouselDiv .carousel .carousel-inner .item {
        text-align: center;
        text-align: -webkit-center;
     }
      .carouselDiv .carousel .carousel-inner .item img {
        height: 25vw !important;
        cursor: pointer;
     }
   }
    @media only screen and (min-width: 768px) {
      /deep/ .addressBar {
        padding-left: 80px !important;
     }
      .bannerDiv .brand_text_div {
        width: 60% !important;
        margin: auto !important;
     }
      .bannerDiv .search_input {
        max-width: 70% !important;
     }
      .bannerDiv .brand_text {
        font-size: 3.6rem;
     }
   }
    .bannerAutoComplete /deep/ .autoCompleteGoogleForm > div:not(.errorpop):not(.infopop) {
      display: flex;
      cursor: pointer;
      align-items: center;
      position: relative;
   }
    .bannerAutoComplete /deep/ .autoCompleteGoogleForm > div:not(.errorpop):not(.infopop) i {
      font-size: 2rem;
      position: absolute;
      left: 1rem;
      top: -0.2rem;
      z-index: 100;
      height: 100%;
      display: flex;
      align-items: center;
      color: var(--theme);
   }
    .bannerAutoComplete /deep/ .autoCompleteGoogleForm > div:not(.errorpop):not(.infopop) span {
      border: 0;
   }
    .bannerAutoComplete /deep/ .autoCompleteGoogleForm > div:not(.errorpop):not(.infopop) input {
      direction: ltr;
      border: 0;
     /* color: var(--theme);
      */
      display: inline-block;
      cursor: pointer;
      background: #f7f7f7;
      height: 3.5rem !important;
      padding-left: 4rem;
      color: rgba(0, 0, 0, 0.6);
   }
    @media only screen and (max-width: 411px) {
      .bannerComponent .bannerDiv .bg-image .brand_text_div .brand_text {
        font-size: 30px;
     }
   }

    `
  },
  deliveryModes: {
    html: `<div class="deliveryModes" *ngIf="showMode && method === 1">
    <button class="btn delivery_mode_button delivery"
      [ngClass]="{'selected': selectedMethod == 1, 'unselect': selectedMethod != 1}" (click)="selectDeliveryMode(1)">
      <div>
        <span class="yf yf-group-25"></span>
        <span [pTooltip]="terminology.HOME_DELIVERY || 'Home Delivery'" tooltipPosition="bottom"
          class="ellipses">{{terminology.HOME_DELIVERY || 'Home Delivery'}}</span>
      </div>
    </button>
    <button class="btn delivery_mode_button pick" (click)="selectDeliveryMode(2)"
      [ngClass]="{'selected': selectedMethod == 2, 'unselect': selectedMethod != 2}">
      <div>
        <span class="yf yf-group-24"></span>
        <span [pTooltip]="terminology.SELF_PICKUP || 'Take Away'" tooltipPosition="bottom"
          class="ellipses">{{terminology.SELF_PICKUP || 'Take Away'}}</span>
      </div>
    </button>
  </div>

  <div class="newDeliveryModes" *ngIf="showMode && method === 2">
    <div class="delivery-mode-heading">
      <a class="delivery-name text-uppercase dropdown-toggle" data-toggle="dropdown">
        <span class="del-name">
          {{selectedMethod == 1 ? (terminology.HOME_DELIVERY || 'Home Delivery') : (terminology.SELF_PICKUP || 'Take Away') }}
        </span>

        <span class="caret ml-10"></span>
      </a>
      <ul class="dropdown-menu">
        <li>
          <a (click)="selectDeliveryMode(1)"
            [pTooltip]="terminology.HOME_DELIVERY.length > 13 ? terminology.HOME_DELIVERY || 'Home Delivery' : ''"
            class="btn">
            {{terminology.HOME_DELIVERY || 'Home Delivery'}}
          </a>
        </li>
        <li>
          <a (click)="selectDeliveryMode(2)"
            [pTooltip]="terminology.SELF_PICKUP.length > 13 ? terminology.SELF_PICKUP || 'Take Away' : ''" class="btn">
            {{terminology.SELF_PICKUP || 'Take Away'}}
          </a>
        </li>
      </ul>
    </div>
  </div>`,
    css: `
    .deliveryModes {
      width: 100%;
      text-align: center;
   }
    .deliveryModes .btn {
      background: transparent;
   }
    .deliveryModes .delivery_mode_button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      outline: none !important;
      box-shadow: none !important;
   }
    .deliveryModes .delivery_mode_button.unselect {
      height: 40px;
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #333;
      width: auto;
   }
    .deliveryModes .delivery_mode_button.unselect div {
      display: flex;
      align-items: center;
   }
    .deliveryModes .delivery_mode_button.unselect div span {
      padding-left: 5px;
   }
    .deliveryModes .delivery_mode_button.unselect div svg path {
      fill: var(--theme);
   }
    .deliveryModes .delivery_mode_button.pick.selected {
      height: 40px;
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      width: auto;
      color: var(--theme);
      border-bottom: 2px solid var(--theme);
   }
    .deliveryModes .delivery_mode_button.pick.selected div {
      display: flex;
      align-items: center;
   }
    .deliveryModes .delivery_mode_button.pick.selected div span {
      padding-left: 5px;
   }
    .deliveryModes .delivery_mode_button.pick.selected div svg path {
      fill: #fff;
   }
    .deliveryModes .delivery_mode_button.delivery.selected {
      height: 40px;
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      width: auto;
      color: var(--theme);
      border-bottom: 2px solid var(--theme);
   }
    .deliveryModes .delivery_mode_button.delivery.selected div {
      display: flex;
      align-items: center;
   }
    .deliveryModes .delivery_mode_button.delivery.selected div span {
      padding-left: 5px;
   }
    .deliveryModes .delivery_mode_button.delivery.selected div svg path {
      fill: #fff;
   }
    .ellipses {
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      max-width: 110px;
   }
    @media only screen and (min-width: 1280px) {
      .delivery_mode_button {
        width: 150px !important;
     }
   }
    .newDeliveryModes {
      cursor: pointer;
      list-style: none;
   }
    .newDeliveryModes .delivery-mode-heading {
      position: relative;
      color: #191919;
      background-color: #fff;
      padding-top: 7px;
      padding-bottom: 7px;
      padding-right: 16px;
      padding-left: 20px;
      border-radius: 3px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: space-between;
   }
    .newDeliveryModes .delivery-mode-heading .delivery-name {
      display: flex;
      align-items: center;
      width: 100%;
      color: #191919;
      font-family: 'ProximaNova-Semibold';
      font-weight: bold;
      font-size: 14px;
      text-transform: capitalize;
   }
    .newDeliveryModes .delivery-mode-heading .delivery-name:hover {
      text-decoration: none;
   }
    .newDeliveryModes .delivery-mode-heading .delivery-name .caret {
      border-top: 5px dashed;
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      margin-left: 16px !important;
      color: #89959b;
   }
    .newDeliveryModes .dropdown-menu {
      top: 34px;
      position: absolute;
      box-shadow: none;
      border-radius: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      background: #fff;
   }
    .newDeliveryModes .dropdown-menu li > a {
      color: #191919 !important;
      text-align: left;
      font-family: 'ProximaNova-Regular';
      padding: 7px 20px;
      text-overflow: ellipsis;
      width: 100%;
      display: block;
      overflow: hidden;
      white-space: nowrap;
   }
    .newDeliveryModes .dropdown-menu li > a:hover {
      text-decoration: none;
      background-color: #fbeed5;
   }
    .newDeliveryModes .selectedMode p {
      font-family: 'ProximaNova-Regular';
      font-size: 16px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: var(--header_font_color);
      border-bottom: 2px solid var(--theme);
   }
    .newDeliveryModes .selectedMode .ellipses {
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      max-width: 125px;
      white-space: nowrap;
      user-select: none;
   }
    @media only screen and (max-width: 1255px) {
      .newDeliveryModes .delivery-mode-heading .delivery-name .caret {
        margin-left: 0 !important;
     }
   }
    @media only screen and (max-width: 411px) {
      .newDeliveryModes .delivery-mode-heading {
        cursor: pointer;
        padding: 8px 5px;
     }
      .newDeliveryModes .delivery-mode-heading .delivery-name {
        font-size: 13px;
     }
      .newDeliveryModes .delivery-mode-heading .dropdown-menu {
        top: 39px;
     }
      .newDeliveryModes .delivery-mode-heading .dropdown-menu li > a {
        font-size: 13px;
        padding: 7px 6px !important;
     }
   }
    .del-name {
      text-overflow: ellipsis;
      width: 96px;
      display: block;
      overflow: hidden;
      white-space: nowrap;
   }
    @media only screen and (max-width: 450px) {
      .newDeliveryModes .delivery-mode-heading {
        padding: 7px 7px !important;
     }
   }
    @media only screen and (min-width: 411px) and (max-width: 1024px) {
      .del-name {
        width: 215px;
     }
      .newDeliveryModes .dropdown-menu {
        top: 40px;
        width: 100% !important;
     }
   }
    `
  },
  merchantFilter: {
    html: `<div class="cotainer-elem merchant-filter-div">
    <form [formGroup]="filterForm">
        <div class="col-md-12 filter-header">
            <span>
                <span>
                    <img src="assets/img/cancel.svg" alt="close" (click)="closeComponent()" height="15px" width="15px">
                </span>
                <span class="title-head">
                    <ng-container i18n>Filters</ng-container>
                </span>
            </span>
        </div>
        <div class="col-md-12 filter-body-area" *ngIf="(defaultFilters && defaultFilters.length>0) || (specificFilters && specificFilters.length>0)">
            <div class="row">
                <div class="col-md-10" formArrayName="defaultFilters" *ngFor="let default of filterForm.get('defaultFilters')['controls'];let i = index">
                    <div class="row">
                        <div class="col-md-12">
                            <span class="filter-heading"> {{default.controls.display_name.value}} </span>
                        </div>
                        <div class="col-md-12 filter-options-div" *ngIf="default.controls.data_type.value === dynamicTemplateDataType.MULTI_SELECT">
                            <div class="col-md-12">
                                <span class="clear-text" (click)="clearSelectedFilter(default)" *ngIf="default.controls.selected_values.value &&  default.controls.selected_values.value.length>0">Clear</span>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6" style="padding-left:7px" *ngFor="let options of default.controls.allowed_values.value">
                                <p-checkbox [name]="default.controls.label.value" [value]="options" [label]="options" [formControl]="default.controls.selected_values"
                                    (onChange)="checkForEnableClearFilter()"></p-checkbox>
                            </div>

                        </div>
                        <div class="col-md-12 filter-options-div" *ngIf="default.controls.data_type.value === dynamicTemplateDataType.SINGLE_SELECT">
                            <div class="col-md-12">
                                <span class="clear-text" (click)="clearSelectedFilter(default)" *ngIf="default.controls.selected_values.value && default.controls.selected_values.value?.length>0">Clear</span>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6" style="padding-left:7px" *ngFor="let options of default.controls.allowed_values.value">
                                <p-radioButton [name]="default.controls.label.value" [value]="options" [label]="options" [formControl]="default.controls.selected_values"
                                    (click)="checkForEnableClearFilter()"></p-radioButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-10" formArrayName="specificFilters" *ngFor="let default of filterForm.get('specificFilters')['controls'];let i = index">
                    <div class="row">
                        <div class="col-md-12">
                            <span class="filter-heading"> {{default.controls.display_name.value}} </span>
                        </div>
                        <div class="col-md-12 filter-options-div" *ngIf="default.controls.data_type.value === dynamicTemplateDataType.MULTI_SELECT">
                            <div class="col-md-12">
                                <span class="clear-text" (click)="clearSelectedFilter(default)" *ngIf="default.controls.selected_values.value && default.controls.selected_values.value.length>0">Clear</span>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6" style="padding-left:7px" *ngFor="let options of default.controls.allowed_values.value">
                                <p-checkbox [name]="default.controls.label.value" [value]="options" [label]="options" [formControl]="default.controls.selected_values"
                                    (onChange)="checkForEnableClearFilter()"></p-checkbox>
                            </div>

                        </div>
                        <div class="col-md-12 filter-options-div" *ngIf="default.controls.data_type.value === dynamicTemplateDataType.SINGLE_SELECT">
                            <div class="col-md-12">
                                <span class="clear-text" (click)="clearSelectedFilter(default)" *ngIf="default.controls.selected_values.value && default.controls.selected_values.value?.length>0">Clear</span>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6" style="padding-left:7px" *ngFor="let options of default.controls.allowed_values.value">
                                <p-radioButton [name]="default.controls.label.value" [value]="options" [label]="options" [formControl]="default.controls.selected_values"
                                    (click)="checkForEnableClearFilter()"></p-radioButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 filter-body-area" *ngIf="!(defaultFilters && defaultFilters.length>0) && !(specificFilters && specificFilters.length>0)">
            <div class="row text-center">
                <ng-container i18n>No filters Available</ng-container>
            </div>
        </div>


        <div class="col-md-12 filter-actions" *ngIf="(defaultFilters && defaultFilters.length>0) || (specificFilters && specificFilters.length>0)">
            <div class="row">
                <div class="col-md-4 col-sm-6 col-xs-6">
                    <button class="clear-btn btn" (click)="clearFilters()" [disabled]="!enableClearFilter">
                        <ng-container i18n>Reset</ng-container>
                    </button>
                </div>
                <div class="col-md-7 col-sm-6 col-xs-6">
                    <button type="butttom" (click)="setFilters()" class="apply-btn btn">
                        <ng-container i18n>Apply Filters</ng-container>
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>`,
    css: `
    .merchant-filter-div * {
      outline: 0;
   }
    .merchant-filter-div .container-elem {
      height: 100%;
   }
    .merchant-filter-div .filter-header {
      padding-bottom: 26px;
      padding-top: 50px;
      font-size: 22px;
      color: #282c3f;
   }
    .merchant-filter-div .filter-header img {
      margin-left: 10px;
      cursor: pointer;
   }
    .merchant-filter-div .filter-heading {
      font-size: 20px;
      font-weight: 500;
      padding-left: 10px;
   }
    .merchant-filter-div .filter-options-div {
      padding: 20px;
   }
    .merchant-filter-div .filter-options {
      font-weight: 300;
      color: #282c3f;
      margin-left: 10px;
   }
    .merchant-filter-div .filter-options:hover {
      font-weight: 500;
   }
    .merchant-filter-div .clear-btn {
      width: 100%;
      text-decoration: none;
      cursor: pointer;
      display: inline-block;
      text-align: center;
      border: none;
      line-height: 50px;
      font-size: 14px;
      font-weight: 600;
      height: 50px;
      padding: 0 2rem;
      color: #535665;
      letter-spacing: 0;
      border: 1px solid #535665;
      border-radius: 0px;
   }
    .merchant-filter-div .apply-btn {
      border: 1px solid var(--theme);
      -webkit-box-flex: 0;
      background: var(--theme);
      color: #fff;
      color: #fff;
      width: 100%;
      height: 50px;
      font-size: 15px;
      border-radius: 0px;
   }
    .merchant-filter-div .apply-btn:hover {
      background: #fff;
      color: var(--theme);
   }
    .merchant-filter-div .filter-actions {
      position: absolute;
      bottom: 0;
      padding-right: 14%;
      padding-bottom: 23px;
      padding-top: 22px;
      box-shadow: 0 -2px 4px 0 #e9e9eb;
      width: 100%;
      background: white;
   }
    .merchant-filter-div .filter-header {
      padding-right: 14%;
      padding-bottom: 23px;
      padding-top: 22px;
   }
    .merchant-filter-div .filter-body-area {
      height: calc(100vh - 150px);
      overflow: auto;
   }
    :host /deep/ .ui-chkbox-box.ui-state-active, :host /deep/.ui-radiobutton-box.ui-state-active {
      background: var(--theme);
      border: 1px solid var(--theme);
   }
    .merchant-filter-div :host /deep/ .ui-chkbox-label {
      color: #282c3f;
      opacity: 0.7;
      cursor: pointer;
      padding-top: 5px;
   }
    .merchant-filter-div :host /deep/ .ui-chkbox-label:hover {
      opacity: 1;
      color: var(--theme);
   }
    .merchant-filter-div :host /deep/ .ui-radiobutton-label {
      color: #282c3f;
      opacity: 0.7;
      cursor: pointer;
      padding-top: 5px;
   }
    .merchant-filter-div :host /deep/ .ui-radiobutton-label:hover {
      opacity: 1;
      color: var(--theme);
   }
    .merchant-filter-div :host /deep/ .ui-radiobutton-box.ui-state-active {
      border: 1px solid var(--theme);
      background: var(--theme);
   }
    .merchant-filter-div .title-head {
      padding: 7px;
      position: absolute;
      top: 17px;
      left: 45px;
   }
    .merchant-filter-div .clear-text {
      margin-top: -45px;
      float: right;
      color: var(--theme);
      cursor: pointer;
   }
    .merchant-filter-div .clear-text:hover {
      border-bottom: 1px solid var(--theme);
   }
    `
  },
  merchantListing: {
    html: `<div class="listView">
    <div class="row marginApp" [ngClass]="{'row-eq-height':!mapInitCheck}">

        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <app-business-categories-dynamic (hideCategoryPage)="hideCategories($event.detail)"></app-business-categories-dynamic>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" *ngIf="showFilterIcon && (categoryHidden || !showCategoriesBusinessCategoriesPage)">
            <div class="row">
                <div class="col-md-12 filter-triggers">
                    <div class="selected-category pull-left text-left" *ngIf="categoryName && businessData && businessData.data">
                        <span class="cat-name"><b>{{categoryName}}</b></span><span class="cat-list"> ({{businessData.data.length || '0'}}
                            {{terminology.BUSINESSES}})</span>
                    </div>
                    <div class="col-md-1 pull-right text-right filter-column" (click)="showFilterArea = !showFilterArea">
                        <span class="filter-icon">
                            <span class="yfn yfn-controls-1"></span>
                            <span class="filter-text" i18n>Filters</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div *ngIf="config.map_view && (categoryHidden || !showCategoriesBusinessCategoriesPage)">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" *ngIf="mapInitCheck">
        <app-map-view-dynamic [lat]="lat" [lng]="lng"></app-map-view-dynamic>
        </div>
        </div>


        <ng-container *ngIf="!isPlatformServer && businessData && businessData.data && !mapInitCheck  && (categoryHidden || !showCategoriesBusinessCategoriesPage)">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 card_parent row-col-eq" *ngFor="let item of businessData.data">
                <div class="card" (click)="navigate(item)">
                    <div class="card_inner">
                        <div class="card_image">
                            <img class="card_image_view" [src]="item.thumb_url || item.logo || 'assets/img/image-placeholder.svg'">

                            <restaurant-tags-dynamic *ngIf="content && content.preorder_tag" [previewOn]="previewOn" [item]="item" [data]="content"></restaurant-tags-dynamic>

                        </div>
                        <div class="card_right">
                            <p class="card_heading" [style.color]="config ? config.color: ''" [ngClass]="{'marginBottomStore':!item.description, 'marginBZero':item.description}">{{item.store_name}}</p>
                            <p class="card_description marginBottomStore" *ngIf="item.description" [tooltip]="item.description?item.description:''">{{item.description}}</p>
                            <p *ngIf="content.show_location && content.show_location.is_enabled" class="card_distance marginBottomStore" [tooltip]="item.display_address ? item.display_address : item.address">{{item.distance}}
                                &nbsp;&nbsp;-&nbsp;&nbsp;{{item.display_address?item.display_address:item.address }}</p>
                            <p class="card_address m-0" *ngIf="item.merchantMinimumOrder">
                                <ng-container i18n>Minimum Order</ng-container>: {{currency + '' + (item.merchantMinimumOrder)}}
                            </p>
                            <!-- home delivery -->
                            <p class="card_order_prep marginBottomStore" *ngIf="deliveryMode === 1 && item.combined_time && item.business_type === 1 && config.onboarding_business_type === onboardingBusinessType.FOOD && config.business_model_type === 'HYPERLOCAL_PRODUCT' && (deliveryContent && deliveryContent.show_delivery_time && deliveryContent.show_delivery_time.is_enabled)">
                                <i class="yfn yfn-clock color-theme" aria-hidden="true"></i> {{item.combined_time}}
                            </p>
                            <!-- self pickup -->
                            <p class="card_order_prep marginBottomStore" *ngIf="deliveryMode === 2 && item.business_type === 1 && config.onboarding_business_type === onboardingBusinessType.FOOD && config.business_model_type === 'HYPERLOCAL_PRODUCT' && (deliveryContent && deliveryContent.show_delivery_time && deliveryContent.show_delivery_time.is_enabled)">
                                <span *ngIf="item.order_preparation_time" >
                                    <i class="yfn yfn-clock color-theme" aria-hidden="true"></i> {{item.order_preparation_time}}
                                </span>
                            </p>
                            <!-- check for delivery inside store -->
                            <p class="card_order_prep marginBottomStore" *ngIf="!deliveryMode && item.business_type === 1 && config.onboarding_business_type === onboardingBusinessType.FOOD && config.business_model_type === 'HYPERLOCAL_PRODUCT'
                     && (deliveryContent && deliveryContent.show_delivery_time && deliveryContent.show_delivery_time.is_enabled)">
                                <span *ngIf="item.home_delivery && item.self_pickup && item.combined_time"><i class="yfn yfn-clock color-theme" aria-hidden="true"></i> {{item.combined_time }}</span>
                                <span *ngIf="item.home_delivery && !item.self_pickup">
                                    <span *ngIf="item.merchant_delivery_time && item.merchant_as_delivery_manager" >
                                    <i class="yfn yfn-clock color-theme" aria-hidden="true"></i> {{item.merchant_delivery_time}}
                                    </span>
                                    <span *ngIf="item.delivery_time && !item.merchant_as_delivery_manager" >
                                        <i class="yfn yfn-clock color-theme" aria-hidden="true"></i> {{item.delivery_time}}
                                    </span>
                                </span>
                                <span *ngIf="!item.home_delivery && item.self_pickup">
                                    <span *ngIf="item.order_preparation_time" >
                                        <i class="yfn yfn-clock color-theme" aria-hidden="true"></i> {{item.order_preparation_time }}
                                    </span>
                                </span>
                            </p>
                            <div class="pull-left hidden-xs visible-sm visible-md visible-lg" *ngIf="config.is_review_rating_enabled && item.store_rating != 0"
                             aria-hidden="false" style="margin-left:-5px;">
                                <star-rating-comp [readOnly]="true" [rating]="item.store_rating?item.store_rating:0" [showHalfStars]="true"
                                 [starType]="'svg'"></star-rating-comp>
                            </div>
                            <div class="pull-left hidden-lg hidden-sm hidden-md visible-xs" *ngIf="config.is_review_rating_enabled && item.store_rating != 0"
                             aria-hidden="false" style="margin-left:-5px;margin-top: -10px;">
                                <star-rating-comp [readOnly]="true" [rating]="item.store_rating?item.store_rating:0" [size]="'small'"
                                 [showHalfStars]="true" [starType]="'svg'"></star-rating-comp>
                            </div>
                            <p class="card_description marginBottom" *ngIf="config.is_review_rating_enabled && item.store_rating == 0 && (content.show_rating && content.show_rating.is_enabled)">
                                {{content.show_rating.data.rating_default_text}}
                            </p>
                            <div class="clearfix"></div>
                            <a (click)="navigate(item)" [ngStyle]="{ 'direction' : direction }">
                                <p class="viewMenu">
                                    {{terminology.VIEW_MENU || langJson['View Menu']}} &nbsp;&nbsp;
                                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div *ngIf="paginatingList && paginatingList.show &&  !loader.active" class="pg-ldr-prt">
                <div class="pg-ldr-cld">
                    <div class="pg-ldr-ctr">
                        <div class="pg-loader" [ngStyle]="{'border-bottom-color': config.color,'border-left-color': config.color}"></div>
                    </div>
                </div>
            </div>
        </ng-container>

        <ng-container *ngIf="isPlatformServer">
            <!-- <app-list-shimmer></app-list-shimmer> -->
        </ng-container>
    </div>

    <div class="col-md-12">
        <div class="overlay-area" *ngIf="showFilterArea"></div>
        <div class="filter-area" [@slideInOutState]="!showFilterArea">
            <app-merchant-filter-dynamic></app-merchant-filter-dynamic>
        </div>
    </div>


    <div *ngIf="result &&  businessData && businessData.data && businessData.data.length == 0 && !businessEnabled && deliveryMode==1 && !loader.active && !mapInitCheck  && (categoryHidden || !showCategoriesBusinessCategoriesPage)" class="col-lg-12 col-xs-12 col-md-12 col-sm-12 no-restaurants-map no-location-map">
        <img src="assets/img/no-location.svg" class="no-location">
        <h3 *ngIf="terminology " [ngStyle]="{ 'direction' : direction }">
            Sorry, we do not serve in this area. Please check back later.
            <!-- {{langJson["We don't serve in your delivery area. Please update the location."]}} -->
        </h3>
    </div>
    <div *ngIf="result && businessData && businessData.data && businessData.data.length == 0 && !businessEnabled && deliveryMode==2 && !loader.active && !mapInitCheck  && (categoryHidden || !showCategoriesBusinessCategoriesPage)" class="col-lg-12 col-xs-12 col-md-12 col-sm-12 no-restaurants-map no-location-map">
        <img src="assets/img/no-marketplace-found.svg" class="no-location">
        <h3  *ngIf="terminology && langJson" [ngStyle]="{ 'direction' : direction }">
            {{langJson["Currently, no restaurant is available for Self_pickup."]}}
        </h3>
    </div>

    <div *ngIf="result && businessData && businessData.data && businessData.data.length == 0 && businessEnabled && !mapInitCheck  && (categoryHidden || !showCategoriesBusinessCategoriesPage)" class="col-lg-12 col-xs-12 col-md-12 col-sm-12 no-restaurants-map no-location-map">
        <img src="assets/img/no-marketplace-found.svg" class="no-location">
        <h3 [ngStyle]="{ 'direction' : direction }" i18n>No {{terminology.MERCHANT}} to display for the selected category</h3>
    </div>

</div>`,
    css: `
    .listView {
      background-color: #fff;
    }
    .listView .marginLeftZero {
      margin: 20px 0px;
    }
    .listView .marginApp {
      margin: 20px 0rem;
    }
    .listView .marginLeftZeroCategory {
      margin: -15px 0px;
    }
    .listView .paddingMobileZero {
      padding: 0px;
    }
    .listView .marginBZero {
      margin-bottom: 0px !important;
    }
    .listView .marginBottomStore {
      margin-bottom: 5px;
    }
    .listView .marginBottomDescription {
      margin-bottom: 10px;
    }
    .listView .marginBottom {
      margin-bottom: 5px;
    }
    .listView .paddingZero {
      padding: 0px;
    }
    .listView .marginZero {
      margin: 0px;
    }
    .listView .card_parent {
      margin-bottom: 30px;
    }
    .listView .sponsored {
      position: absolute;
     /* top: 10px;
      */
      font-family: 'ProximaNova-Regular';
      width: 70px;
      height: 20px;
      bottom: 10px;
      border-radius: 1px;
      background-color: transparent;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      color: #fff;
      text-align: center;
      line-height: 20px;
    }
    .listView .sponsored p {
      background-color: #ffc058;
      width: 110px;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 3px;
    }
    @media only screen and (max-width: 990px) {
      .listView .sponsored {
        font-size: 12px;
        line-height: 18px;
     }
      .listView .sponsored p {
        width: 88px;
     }
    }
    .listView .card {
      cursor: pointer !important;
      border: 1px solid #e6e6e6;
    }
    .listView .card_right {
      cursor: pointer !important;
    }
    .listView .filter-area {
      width: 30%;
      position: fixed;
      top: 0;
      right: 0;
      z-index: 20000;
      height: 100%;
      background: white;
    }
    @media screen and (max-width: 769px) {
      .listView .filter-area {
        width: 80%;
     }
    }
    .listView .filter-triggers {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 15px 20px 25px;
      padding-top: 0px;
    }
    .listView .filter-triggers .selected-category {
      color: #474747;
      font-size: 16px;
    }
    .listView .filter-triggers .selected-category .cat-name {
      font-weight: bold;
      font-family: 'ProximaNova-Semibold';
    }
    .listView .filter-triggers .selected-category .cat-list {
      font-family: 'ProximaNova-Light';
    }
    .listView .filter-column {
      font-size: 18px;
      padding: 5px;
      cursor: pointer;
    }
    .listView .overlay-area {
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
    }
    .listView .filter-text {
      font-size: 14px;
    }
    .listView .filter-icon {
      border-radius: 3px;
      padding: 5px 8px;
      background: #fff;
     /* box-shadow: 1px 2px 3px 0 #d3d3d3;
      */
      margin-right: 0px;
      color: #474747;
      border: 1px solid #d5d5d9;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .listView .filter-icon:hover {
      color: var(--theme);
      border: 1px solid var(--theme);
    }
    .listView .filter-icon:hover /deep/ .yfn.yfn-controls-1::before {
      color: var(--theme) !important;
    }
    @media screen and (min-width: 768px) {
      .listView .marginApp {
        margin: 20px 8rem !important;
     }
    }
    @media screen and (max-width: 1200px) {
      .listView .filter-text {
        padding-left: 12px;
     }
      .listView .filter-icon {
        padding: 6px 10px;
     }
    }
    @media screen and (max-width: 321px) {
      .listView .filter-triggers .selected-category {
        font-size: 14px;
     }
    }
    .listView .card {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      height: 100%;
      background-color: #fff;
      display: -webkit-flex;
      border-radius: 5px;
      -webkit-flex-direction: column;
      transition: 0.5s;
    }
    .listView .card:hover {
      box-shadow: 0 6px 5px 0 rgba(0, 0, 0, .1);
    }
    .listView .card .card_inner {
      padding: 8px;
      display: flex;
      flex-direction: row;
      display: -webkit-flex;
      -webkit-flex-direction: row;
    }
    .listView .card .card_inner .card_image {
      flex: 30%;
      flex-grow: 1;
      position: relative;
    }
    .listView .card .card_inner .card_image img.card_image_view {
      height: 164px;
      min-width: 164px;
      max-width: 164px;
      object-fit: cover;
    }
    .listView .card .card_inner .card_image .closedView {
      position: absolute;
      top: 10px;
      font-family: 'ProximaNova-Regular';
      width: 70px;
      height: 20px;
      border-radius: 1px;
      background-color: transparent;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      color: #fff;
      text-align: center;
      line-height: 20px;
    }
    .listView .card .card_inner .card_image .closedView .closed {
      width: 70px;
      height: 20px;
      background-color: #d63230;
      margin-bottom: 5px;
    }
    .listView .card .card_inner .card_image .closedView .preorder {
      width: 80px;
      height: 20px;
      background-color: #ba68c8;
      margin-bottom: 5px;
    }
    .listView .card .card_inner .card_right {
      flex-grow: 1;
      flex: 70%;
      overflow: hidden;
      margin: 0 8px 0 15px;
    }
    .listView .card .card_inner .card_right .card_heading {
      font-family: ProximaNova-Regular;
      font-size: 18px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: 0.3px;
      color: #333;
      display: block;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      line-height: 20px;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      display: inline-block;
      width: 100%;
      white-space: nowrap;
    }
    .listView .card .card_inner .card_right .card_description {
      height: auto;
      display: block;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      font-size: 14px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      font-family: ProximaNova-Regular;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: var(--show_rating_font_color);
    }
    .listView .card .card_inner .card_right .card_distance {
      font-size: 14px;
      text-align: left;
      height: auto;
      display: block;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-family: ProximaNova-Regular;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: var(--show_location_font_color);
      display: inline-block;
      width: 100%;
      white-space: nowrap;
    }
    .listView .card .card_inner .card_right .card_address {
      height: auto;
      display: block;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      font-size: 14px;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      font-family: ProximaNova-Regular;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #939395;
    }
    .listView .card .card_inner .card_right .viewMenu {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #0a9e44;
      text-align: right;
      position: absolute;
      margin-bottom: 2px;
      right: 30px;
      bottom: 8px;
    }
    .listView .card .card_inner .card_right .viewMenu:hover {
      color: #ba2824;
      transition: 0.5s;
    }
    .listView .no-restaurants-map {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 3% 0;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      padding-bottom: 40px;
    }
    .listView .no-restaurants-map h3 {
      font-size: 18px;
    }
    @media only screen and (max-width: 990px) and (min-width: 651px) {
      .listView .card_image img.card_image_view {
        height: 150px !important;
        min-width: 150px !important;
        max-width: 150px !important;
     }
      .listView .card_image .closedView {
        width: 55px !important;
        height: 20px !important;
        font-size: 12px !important;
     }
      .listView .card_image .closedView .closed {
        width: 55px !important;
        height: 20px !important;
     }
      .listView .card_image .closedView .preorder {
        width: 60px !important;
        height: 20px !important;
     }
    }
    @media only screen and (max-width: 650px) {
      .listView .card_image_view {
        height: 114px !important;
        min-width: 114px !important;
        max-width: 114px !important;
     }
      .listView .card_heading {
        font-size: 14px !important;
     }
      .listView .card_description {
        font-size: 10px !important;
     }
      .listView .card_distance {
        font-size: 10px !important;
     }
      .listView .card_address {
        font-size: 11px !important;
     }
      .listView .viewMenu {
        font-size: 11px !important;
     }
    }
    .card_order_prep {
      color: var(--show_delivery_time_font_color) !important;
   }
    .pg-ldr-prt {
      width: 100%;
      align-items: center;
      display: flex;
      justify-content: center;
   }
    .pg-ldr-ctr {
      background-color: #f5f5f5;
      margin: 0 auto;
      border-radius: 10px;
   }
    .pg-ldr-ctr {
     /* width: 80px;
      */
     /* height: 80px;
      */
      padding: 8px;
   }
    .pg-loader {
      width: 35px;
      height: 35px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, 0.03);
      border-right: 5px solid rgba(0, 0, 0, 0.03);
      border-bottom: 5px solid transparent;
      border-left: 5px solid transparent;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
   }
    .pg-loader, .pg-loader:after {
      border-radius: 50%;
   }
    @-webkit-keyframes pg-loader {
      from {
        -webkit-transform: rotate(0deg);
     }
      to {
        -webkit-transform: rotate(360deg);
     }
   }
    .pg-loader {
      -webkit-animation: gl-loader 0.5s linear infinite;
   }
    .pg-loader {
      display: block !important;
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      width: 35px;
      height: 35px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, .03);
      border-right: 5px solid rgba(0, 0, 0, .03);
      border-bottom: 5px solid #c4253a;
      border-left: 5px solid #c4253a;
      transform: translateZ(0);
   }
   /* Safari */
    @-webkit-keyframes spin {
      0% {
        -webkit-transform: rotate(0deg);
     }
      100% {
        -webkit-transform: rotate(360deg);
     }
   }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
     }
      100% {
        transform: rotate(360deg);
     }
   }

   .listView .no-location-map {
    display: flex;
    text-align: center;
    flex-direction: column;
  }
  .listView .no-location-map img.no-location {
    height: 180px;
  }
  .listView .no-location-map h3 {
    color: #474747;
  }
  @media screen and (max-width: 414px) {
    .listView .no-location-map img.no-location {
      height: 130px;
    }
    .listView .no-location-map h3 {
      font-size: 14px;
      padding: 0px 5px;
    }
  }

  .listView .row-eq-height {
    display: flex;
    flex-wrap: wrap;
  }
  .listView .row-eq-height .row-col-eq {
    margin-bottom: 20px;
  }


    `
  },
  merchantListingPage: {
    html: `
    <app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="headerData" [showAddressBarOnlyRestaurant]="true"></app-header-dynamic>
    <div class="mobileHeaderMargin">
      <app-banner-dynamic *ngIf="merchantFlag"></app-banner-dynamic>
      <app-restaurants-dynamic></app-restaurants-dynamic>
    </div>
    `,
    css: `
@media only screen and (max-width: 770px) {
  .mobileHeaderMargin{
   margin-top: 12rem;
  }
    }
    `
  },
  merchantListSection: {
    html: `
    <div class="resturant-div">

    <div class="business" *ngIf="merchantFlag">

        <!--=======================list view==============================-->
        <app-list-view-dynamic *ngIf="businessData && businessData.data && showListView" [businessData]="businessData" [paginatingList]="paginatingForMerchantList"  [categoryDataChild]="categoryData"></app-list-view-dynamic>
    </div>

    <!--=========================-product view===========================-->
    <div class="productViewOnly" *ngIf="productShowFlag" id="general_background">

        <app-product-only-dynamic [productList]="productDataFull"
         [selectedProductFilterInput]="selectedProductFilter"
            [queryParam]="queryParam"
             *ngIf="productDataFull && productDataFull.length > 0 && !checkIfProductGot"></app-product-only-dynamic>
        <div class="noProductAvail"
            *ngIf="config.business_model_type != 'ECOM' && productDataFull && productDataFull.length == 0  && checkIfProductGot">
            {{langJson['No Product Available.']}}
        </div>

        <div *ngIf="paginating" class="pg-ldr-prt">
            <div class="pg-ldr-cld">
                <div class="pg-ldr-ctr">
                    <div class="pg-loader" [ngStyle]="{'border-bottom-color': config.color,'border-left-color': config.color}"></div>
                </div>
            </div>
        </div>
    </div>

    <!--custom order flotaing button  -->
    <app-custom-order-dynamic *ngIf="config.is_custom_order_active"></app-custom-order-dynamic>
    <app-order-placed-popup-dynamic></app-order-placed-popup-dynamic>
    <app-dynamic-footer></app-dynamic-footer>

</div>`,
    css: `
      .resturant-div .business {
        height: auto;
        background-color: #fff;
        min-height: calc(100vh - 180px);
        width: 100%;
        overflow: hidden;
        font-family: ProximaNova-Regular;
      }
      .resturant-div .noProductAvail {
        max-width: 1280px;
        margin: 13% auto;
        font-family: ProximaNova-Regular;
        font-size: 24px;
        text-align: center;
      }
      .resturant-div .pg-ldr-prt {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 100000;
        text-align: center;
      }
      .resturant-div .pg-ldr-cld {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .resturant-div .pg-ldr-ctr {
        background-color: #f5f5f5;
        margin: 0 auto;
        border-radius: 10px;
      }
      .resturant-div .pg-ldr-ctr {
        padding: 8px;
      }
      .resturant-div .pg-loader {
        width: 35px;
        height: 35px;
        position: relative;
        border-top: 5px solid rgba(0, 0, 0, 0.03);
        border-right: 5px solid rgba(0, 0, 0, 0.03);
        border-bottom: 5px solid #c4253a;
        border-left: 5px solid #c4253a;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
      }
      .resturant-div .pg-loader, .resturant-div .pg-loader:after {
        border-radius: 50%;
      }
      @-webkit-keyframes pg-loader {
        from {
          -webkit-transform: rotate(0deg);
       }
        to {
          -webkit-transform: rotate(360deg);
       }
      }
      .resturant-div .pg-loader {
        -webkit-animation: gl-loader 0.5s linear infinite;
      }
      .resturant-div .pg-loader {
        display: block !important;
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        width: 35px;
        height: 35px;
        position: relative;
        border-top: 5px solid rgba(0, 0, 0, .03);
        border-right: 5px solid rgba(0, 0, 0, .03);
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        transform: translateZ(0);
      }

`
  },
  businessCategory: {
    html: `<div class="business" *ngIf="newList && newList.length > 0 && showCategories  && (!businessCategoryPage || !showCategoriesBusinessCategoriesPage) && !showBoxCategories">
    <p-carousel [value]="newList"  [breakpoint]="10" [numVisible]="numVisible" [ngClass]="{'lastPage': lastPage, 'firstPage': firstPage }"
      (onPage)="onPage($event)">
      <ng-template let-item pTemplate="item">
        <div class="item">
          <div>
            <img (click)="selectCategory(item)" [ngClass]="{'apply-theme-color': item.is_all_category }" [src]="(item.thumb_list && item.thumb_list['200x200']) ? item.thumb_list['200x200'] : item.icon"
              [alt]="item.name + ' image'" class="logo2" />

          </div>
        </div>
        <div class="nameDiv pad-top">
            <span class="name" [ngClass]="{'selected': item.id == selected, 'notSelected': item.id != selected }"
              [tooltip]="item.name?item.name:''">{{item.name}}</span>
          </div>
      </ng-template>
    </p-carousel>
  </div>

  <div class="business-categories-page" *ngIf="(newList && newList.length > 0 && showCategories && !isPlatformServer) && businessCategoryPage && showCategoriesBusinessCategoriesPage  && showBoxCategories">
    <div class="row-eq-height" *ngIf="!categoryHidden">
      <ng-container *ngFor="let category of list;let index =index">
        <div class="row-col-eq" *ngIf="!category.is_all_category">
          <div class="grid-item" (click)="selectCategory(category)">
            <div class="image_div">
              <img [src]="category.icon" onerror="this.src='assets/img/image-placeholder.svg';"
                [alt]="category.name + ' image'" class="image-cat" [alt]="category.name">
            </div>
            <div class="name_div">
              <span>{{category.name}}</span>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  </div>


  `,
    css: `:root {
      --category_color_without_selected: #424242;
      --category_bg: #fff;
      --category_border_color: #979797;
   }
    .business {
      background-color: #fff;
      margin-bottom: 20px;
      position: relative;
      padding-top: 10px;
   }
    .business .carouselDiv {
      width: 100%;
   }
    .business .carouselDiv .categories-carousel.carousel-inner {
      margin: 0;
      width: auto !important;
   }
    .business .carouselDiv .carouselWidthAuto {
      max-width: 1200px;
   }
    .business .carouselDiv .carouselWidthFull {
      max-width: 100%;
      margin: auto;
   }
    .business .ui-carousel-prev-button {
      background-image: -webkit-gradient(linear, left top, right top, color-stop(0, transparent), to(transparent)) !important;
   }
    .business .ui-carousel-next-button {
      background-image: -webkit-gradient(linear, left top, right top, color-stop(0, transparent), to(transparent)) !important;
   }
    .business :host /deep/ .ui-carousel-button {
      opacity: 1 !important;
      cursor: pointer;
   }
    .business :host /deep/ .ui-carousel-button.ui-carousel-prev-button {
      width: 38px;
      height: 38px;
      font-size: 13px;
      background-color: #fff;
      border-radius: 50%;
      padding-top: 13px;
      color: #9b9b9b;
      left: -25px;
      position: absolute;
      top: 36%;
      z-index: 5;
      display: inline-block;
      text-align: center;
      box-shadow: -1px 1px 2px 1px #dedede;
   }
    .business :host /deep/ .ui-carousel-button.ui-carousel-prev-button:hover {
      color: var(--theme);
   }
    .business :host /deep/ .ui-carousel-button.ui-carousel-next-button {
      width: 38px;
      height: 38px;
      font-size: 13px;
      background-color: #fff;
      border-radius: 50%;
      padding-top: 13px;
      color: #9b9b9b;
      right: 15px;
      position: absolute;
      top: 38%;
      z-index: 5;
      display: inline-block;
      text-align: center;
      box-shadow: 1px 1px 2px 1px #dedede;
   }
    .business :host /deep/ .ui-carousel-button.ui-carousel-next-button:hover {
      color: var(--theme);
   }
    .business .item {
      padding: 5px;
   }
    .business .item > div {
      width: 90px;
      margin: 0 auto;
   }
    .business .item > div img {
      cursor: pointer;
      height: 90px;
      border-radius: 50%;
      box-shadow: 0 0 5px 0 #ccc;
      object-fit: cover;
      transition: transform 500ms ease-out;
   }
    .business .item > div img:hover {
      box-shadow: 0 2px 13px 1px rgba(0, 0, 0, 0.12);
      transform: scale(1.1);
   }
    .business .item > div div.nameDiv {
      cursor: pointer;
   }
    .business .item > div div.nameDiv .name.notSelected {
      color: var(--category_color_without_selected);
   }
    .business .item > div div.nameDiv .name.selected {
      color: var(--theme);
   }
    .business .item > div .apply-theme-color.logo2 {
      background-color: var(--theme);
      object-fit: contain;
   }
    .business .item > div .apply-theme-color.name {
      color: var(--theme) !important;
   }
    .business div.nameDiv .name.notSelected {
      color: var(--category_color_without_selected);
   }
    .business div.nameDiv .name.selected {
      color: var(--theme);
   }
    .business .apply-theme-color.name {
      color: var(--theme) !important;
   }
    .business :host /deep/ .ui-carousel-item {
      background: transparent;
      border: 0;
   }
    .business .item.apply-theme-color {
      background-color: var(--theme);
   }
    .business .item.apply-theme-color .nameDiv .name {
      color: var(--theme) !important;
   }
    .business .categories {
      cursor: pointer;
      position: relative;
      padding: 0px;
   }
    .business .categories .repeat {
      display: flex;
      height: 100%;
      align-items: center;
      flex-direction: column;
   }
    .business .categories .logoDiv {
      text-align: center;
      padding: 15px;
   }
    .business .categories .logoDiv .logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      transition: all 0.25s ease-out;
   }
    .business .categories .nameDiv {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
   }
    .business .categories .nameDiv .name {
      font-size: 17px;
      font-family: 'ProximaNova-Regular';
      color: var(--category_color_without_selected);
   }
    .business .categories .nameDiv .name.notSelected {
      color: var(--category_color_without_selected);
   }
    .business .categories .nameDiv .name.selected {
      color: var(--theme);
   }
    .business :host /deep/ .ui-carousel {
      background: transparent;
      border: none;
   }
    .business :host /deep/ .ui-carousel .ui-carousel-page-links {
      display: none;
   }
    .business :host /deep/ .ui-carousel .ui-carousel-mobiledropdown {
      display: none;
   }
    @media screen and (max-width: 768px) {
      .business :host /deep/ .ui-carousel .ui-carousel-mobiledropdown {
        display: none !important;
     }
   }
    .business :host /deep/ .ui-carousel .ui-carousel-mobiledropdown {
      display: none !important;
   }
    .business .lastPage .ui-carousel-next-button {
      display: none;
   }
    .business :host /deep/ .lastPage .ui-carousel-next-button {
      display: none !important;
   }
    .business :host /deep/ .firstPage .ui-carousel-prev-button {
      display: none !important;
   }
    .business :host /deep/ .ui-widget-header {
      position: absolute;
      width: 100%;
      background: transparent;
      height: 0;
      padding: 0;
      overflow: visible;
      border: 0;
      top: 36px;
   }
    .business .logo2 {
      height: 100%;
      width: 100%;
      border-radius: 50%;
   }
    .business .pad-top {
      padding: 16px 5px 20px 5px;
      text-align: center;
   }
    @media screen and (max-width: 414px) {
      .business .business {
        margin-bottom: 0px;
        padding-top: 0;
     }
      .business .item > div {
        width: 65px;
     }
      .business .item > div img {
        height: 65px;
     }
      .business /deep/ .ui-carousel-button.ui-carousel-next-button {
        right: 9px !important;
        top: -8px !important;
     }
      .business /deep/ .ui-carousel-button.ui-carousel-prev-button {
        left: -33px !important;
        top: -8px !important;
     }
   }
    .business :host /deep/ .ui-carousel-button.ui-carousel-prev-button.pi.pi-arrow-circle-left::before {
      content: '\\e91a' !important;
   }
    .business :host /deep/ .ui-carousel-button.ui-carousel-next-button.pi.pi-arrow-circle-right::before {
      content: '\\e91b' !important;
   }
    @media screen and (max-width: 321px) {
      .business /deep/ .ui-carousel-button.ui-carousel-next-button {
        width: 30px !important;
        height: 30px !important;
        padding-top: 9px !important;
     }
      .business /deep/ .ui-carousel-button.ui-carousel-prev-button {
        width: 30px !important;
        height: 30px !important;
        padding-top: 9px !important;
     }
   }
    .business /deep/ .ui-carousel.ui-widget {
      padding: 0 20px !important;
   }

   .business-categories-page .row-eq-height {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    padding: 0 2rem 0 0;
    margin-top: 1rem;
  }
  .business-categories-page .row-eq-height .row-col-eq {
    min-width: 25%;
    max-width: 25%;
    margin-bottom: 15px;
  }
  .business-categories-page .grid-item {
    margin: 1rem;
  }
  .business-categories-page .image-cat {
    width: 100%;
    height: 18vw;
    min-height: 18vw;
    min-width: 100%;
    background-color: transparent;
    object-fit: cover;
    cursor: pointer;
    transition: transform 800ms ease-out;
  }
  .business-categories-page .image-cat:hover {
    transform: scale(1.09);
  }
  .business-categories-page .image_div {
    margin: 0.5rem;
    overflow: hidden;
    margin-bottom: 0px;
    border-radius: 5px !important;
    border: 1px solid lightgrey;
  }
  .business-categories-page .name_div {
    margin: 0.5rem;
    margin-top: 0px;
    font-size: 16px;
    text-overflow: ellipsis;
    padding: 0.5rem 10px;
    color: #474747;
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
    letter-spacing: 1.1px;
  }
  @media only screen and (max-width: 425px) {
    .business-categories-page .row-col-eq {
      min-width: 100% !important;
      max-width: 100% !important;
    }
    .business-categories-page .image-cat {
      height: 60vw !important;
    }
    .business-categories-page .row-eq-height {
      padding: 1rem !important;
    }
    .business-categories-page .grid-item {
      margin: 0.5rem !important;
    }
  }
  @media only screen and (min-width: 425px) and (max-width: 767px) {
    .business-categories-page .row-col-eq {
      min-width: 50% !important;
      max-width: 50% !important;
    }
    .business-categories-page .image-cat {
      height: 30vw !important;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    .business-categories-page .row-col-eq {
      min-width: 33% !important;
      max-width: 33% !important;
    }
    .business-categories-page .image-cat {
      height: 15vw !important;
    }
  }
  .business-categories-page .explore-cat {
    padding: 20px;
  }
  .business-categories-page .centerhead {
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    padding: 15px;
  }
  @media only screen and (min-width: 1024px) {
    .business-categories-page .half-div {
      min-width: 40% !important;
      max-width: 40% !important;
    }
  }




    `
  },
  restaurantTags: {
    html: `
    <p class="preorder-tag-data"
    *ngIf="(previewOn ? true : item.available == 0 && item.scheduled_task == 1) && showPreOrderTag">
    {{tagsData.preorder_tag.data.heading}}</p>

    <p class="closed-tag-data" *ngIf="(previewOn ? true : item.available == 0) && showClosedTag">
    {{tagsData.closed_tag.data.heading}}</p>

    <p class="sponsored-tag-data"
    *ngIf="(previewOn ? true : item.is_sponsored == 1 && (item.available == 1 || item.scheduled_task == 1)) && showSponsoredTag">
    {{tagsData.sponsored_tag.data.heading}}</p>`,
    css: `
    .preorder-tag-data {
      position: absolute;
      min-width: 100px;
      max-width: 164px;
      overflow: hidden;
      font-family: 'ProximaNova-Regular';
      margin-bottom: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 1px;
      background-color: var(--preorder_tag_bg_color);
      color: var(--preorder_tag_font_color);
      top: var(--preorder_tag_top);
      text-align: center;
    }
    .sponsored-tag-data {
      min-width: 110px;
      max-width: 164px;
      overflow: hidden;
      text-align: center;
      position: absolute;
      font-family: 'ProximaNova-Regular';
      margin-bottom: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 3px;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      background-color: var(--sponsored_tag_bg_color);
      color: var(--sponsored_tag_font_color);
      bottom: var(--sponsored_tag_bottom);
    }
    .closed-tag-data {
      position: absolute;
      min-width: 80px;
      max-width: 164px;
      overflow: hidden;
      text-align: center;
      font-family: 'ProximaNova-Regular';
      margin-bottom: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 1px;
      background-color: var(--closed_tag_bg_color);
      color: var(--closed_tag_font_color);
      top: var(--closed_tag_top);
    }
    @media only screen and (max-width: 650px) {
      .preorder-tag-data {
        max-width: 114px;
     }
      .sponsored-tag-data {
        max-width: 114px;
     }
      .closed-tag-data {
        max-width: 114px;
     }
    }

    `
  },
  customOrder: {
    html: `
    <div (click)="goToCheckout()" class="custom-order">
      <div class="custom-order-text">
        <ng-container>{{terminology.CUSTOM_ORDER || 'Custom Order'}}</ng-container>
      </div>
      <img src="assets/images/custom.svg" alt="custom order">
    </div>
  `,
    css: `.custom-order {
      position: fixed;
      z-index: 5;
      top: 174px;
      right: 20px;
      height: 56px;
      border-radius: 30px;
      background: var(--theme);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0 15px;
      max-width: 60px;
      font-size: 18px;
      font-family: 'ProximaNova-Semibold';
      color: #fff;
      transition: max-width 0.5s ease-in;
   }

    @media only screen and (max-width: 1200px) {
      .custom-order {
        top: 80px;
        height: 40px;
        max-width: 40px;
        font-size: 14px;
        border-radius: 20px;
     }
      .custom-order img {
        width: 20px;
     }
   }
    .custom-order .custom-order-text {
      display: none;
      overflow: hidden;
      white-space: nowrap;
   }
    .custom-order img {
      padding-left: 0;
   }
    @media only screen and (min-width: 1200px) {
      .custom-order:hover {
        max-width: 100%;
     }
      .custom-order:hover .custom-order-text {
        display: block;
     }
      .custom-order:hover img {
        padding-left: 10px;
     }
   }
    @media only screen and (max-width: 700px) {
      .custom-order {
        top: 67vh !important;
     }
   }
    @media only screen and (max-width: 1090px) {
      .custom-order {
        top: 170px;
     }
   }
    `
  },
  store: {
    html: `
    <app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="headerData"></app-header-dynamic>
<div id="general_background" class="general_background_color select_category" *ngIf="restaurantInfo">
<div class="closedRestro"
  *ngIf="restaurantInfo && !restaurantInfo.available && !restaurantInfo.scheduled_task">
  <img src="assets/images/sleepy.svg"
    style="margin-right:1rem;" /> Not accepting online orders currently
</div>
  <div class="row margin_zero select_category_cover card_big">
    <div class="row col-lg-12 col-xs-12 col-md-12 col-sm-12 m0 p0"
      *ngIf="formSettings.onboarding_business_type === 805 || (restaurantInfo && restaurantInfo.business_type === 2)">
      <app-sub-header-dynamic></app-sub-header-dynamic>
    </div>
    <div *ngIf="noOffering">
      <div class="row bannerDivMain">
        <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 paddingZero">
        <div class="bannerDiv" [ngClass]="{'tapri-class': ([151121,166930].includes(+restaurantInfo.storefront_user_id))}"
        [ngStyle]="{'background':bannerImage?'linear-gradient(0deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.27)),url('+bannerImage+')': 'grey'}">
            <div class="inner-search-div">
              <div class="heading_cvr">
                <div class="name" *ngIf="!([151121,166930].includes(+restaurantInfo.storefront_user_id))">
                  {{restaurantInfo.store_name}}
                  <div *ngIf="appConfig.is_review_rating_enabled && restaurantInfo.store_rating!=0"
                    [ngClass]="{'averageRating': restaurantInfo.store_rating < 3, 'goodRating': restaurantInfo.store_rating > 3}"
                    (click)="showMerchantReviews()" class="customRatingDivCat1">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <span class="ratingCount ng-binding">{{restaurantInfo.store_rating.toFixed(1)}}</span>
                  </div>
                  <div *ngIf="appConfig.is_review_rating_enabled && restaurantInfo.store_rating===0"
                    (click)="addMerchantReviews()" class="customRatingDivCat1 rateNow">
                    <span class="ratingCount rate-now ng-binding" i18n>Rate Now</span>
                  </div>
                </div>
                <p class="description mt-50" *ngIf="restaurantInfo && restaurantInfo.description">
                  {{restaurantInfo.description}}</p>
                <div class="addressDetails displayFlex"
                  [ngClass]="{'mt-50': restaurantInfo && !restaurantInfo.description, 'mt-10': restaurantInfo && restaurantInfo.description}">
                  <div *ngIf="formSettings.display_merchant_address == 1 &&
                              ((restaurantInfo.display_address &&
                              restaurantInfo.display_address != '-') || (restaurantInfo.address &&
                              restaurantInfo.address != '-'))" class="displayFlex">
                    <div>
                      <i class="yfn yfn-locationNew locationColor" alt="location icon"> </i>
                    </div>
                    <div>
                      &nbsp;{{restaurantInfo.display_address ? restaurantInfo.display_address : restaurantInfo.address}}&nbsp;|&nbsp;
                    </div>
                  </div>
                  <div *ngIf="formSettings.display_merchant_phone == 1 && cardInfo.phone" class="displayFlex">
                    <div><i class="yfn yfn-phoneNew locationColor" alt="phone icon"> </i></div>
                    <div>&nbsp;{{cardInfo.phone}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="storeLogo">
              <img class="storeLogoBend"
                [src]="restaurantInfo.logo ? restaurantInfo.logo: 'assets/img/image-placeholder.svg'"
                [alt]="restaurantInfo.store_name + ' image'">
            </div>
          </div>
        </div>
      </div>
      <div class="prodSearch" [ngClass]="formSettings.enable_veg_non_veg_filter == 1?'nv-enable-changes':''">
        <div class="container">
          <div class="row">
            <div *ngIf="formSettings.enable_veg_non_veg_filter == 1" class="col-md-3 veg_only_check">
              <mat-checkbox class="primary" [(ngModel)]="onlyVegCheck" [ngModelOptions]="{standalone: true}"
                (change)="onVegOnlyCheckChange($event)">Veg. Only</mat-checkbox>
            </div>
            <div [ngClass]="formSettings.enable_veg_non_veg_filter == 1?'col-md-7':'col-md-10 search-bar'"
              *ngIf="langJson">
              <form [formGroup]="form">
                <div class="input-group add-on">
                  <input class="form-control ng-untouched ng-pristine ng-valid" [ngStyle]="{ 'direction' : direction }"
                    formControlName="searchControl" placeholder="{{terminology.SEARCH_PRODUCT}}" autocomplete="off"
                    attr.aria-label="{{terminology.SEARCH_PRODUCT}}">
                  <span class="input-group-addon">
                    <i class="fa fa-search" [ngStyle]="{'color':appConfig.color}" style="font-size:17px;"
                      aria-hidden="true"></i>
                  </span>
                </div>
              </form>
            </div>

            <div class="col-md-2 pre-order-btn" [ngClass]="formSettings.enable_veg_non_veg_filter == 1?'':'veg-filer-disable'" [hidden]="!isPreorderTimeRequired">
                            <div class="preorder-btn-cvr" (mouseenter)="showPreorderInfo = true" (mouseleave)="showPreorderInfo = false">
                              <button type="button" class="btn accept" appColor bg="true" [ngStyle]="{ 'direction' : direction }"
                                (click)="showPreorderTimeSelectionModal()" >
                                <ng-container i18n>Pre Order</ng-container>
                              </button>
                              <div class="preorder-popover" *ngIf="preOrderDatetime && showPreorderInfo">
                                <i class="fa fa-caret-up caret-icon" aria-hidden="true"></i>
                                <p class="preorder-time">Pre ordering for {{preOrderDatetime}}</p>
                                <p class="instant" *ngIf="restaurantInfo && restaurantInfo.available">click for <a class="instant_order" (click)="instantOrder()">Instant Order</a></p>
                              </div>
                            </div>
                          </div>
                         <div class="pre-order-btn" *ngIf="restaurantInfo.custom_order_active_for_store && catalogueList && formSettings.is_custom_order_active && searchItems">
                            <div class="preorder-btn-cvr">
                              <button type="button" class="btn accept" appColor bg="true" [ngStyle]="{ 'direction' : direction }"
                                (click)="moveToCustomOrder()" >
                                <ng-container i18n>Custom Order
                                 </ng-container>
                              </button>
                            </div>
                          </div>

          </div>
        </div>
      </div>

      <div class="cls-home-cat"
        *ngIf="formSettings.onboarding_business_type !== 805 && all_category_depth > category_depth_limit">
        <ng-container>
          <app-n-level-category-path-dynamic *ngIf="categoryPathData" [allCategoryName]="langJson['All']"
            [depthAllCategory]="all_category_depth" [depthLimit]="category_depth_limit"
            [categoryData]="categoryPathData" (categorySelected)="selectCategoryFromNLevel($event.detail)">
          </app-n-level-category-path-dynamic>
        </ng-container>
      </div>
      <div class="cls-home-cat"
        [ngStyle]="{'grid-template-columns':!dataBool ? '700px 250px':'250px 700px 250px','width':'100%'}"
        *ngIf="formSettings.onboarding_business_type !== 805">
        <div [ngClass]="{'withoutAppCategory' : dataBool}" *ngIf="hideCategory"></div>
        <ng-container *ngIf="current_category_depth <= category_depth_limit">
          <ng-container *ngIf="!categoryShimmer">
            <app-category-dynamic *ngIf="dataBool && !hideCategory" [categoryData]="loopData"
              (showSearchProducts)="updateSearchProducts($event.detail)"
              (updateProduct)="changeCategory($event.detail)"></app-category-dynamic>

          </ng-container>
          <div class="hidden-xs hidden-sm category-shimmer" *ngIf="categoryShimmer">
            <div class="category-shimmer-container">
              <div class="pulsate block"></div>
              <div class="pulsate block"></div>
              <div class="pulsate block"></div>
              <div class="pulsate block"></div>
            </div>
          </div>
        </ng-container>
        <div style=" display: flex;width: 100%;" [ngStyle]="{'margin-top': dataBool ? '0px' : '0px'}">

          <ng-container *ngIf="current_category_depth > category_depth_limit && restaurantInfo.has_categories && !hideCategory">
            <app-n-level-category-dynamic class="product-app" [categoryData]="loopData"
              (categorySelected)="selectCategoryFromNLevel($event.detail)" [categoryDepthLimit]="category_depth_limit"
              *ngIf="!categoryShimmer"></app-n-level-category-dynamic>

            <div class="product-app product-app-shimmer" *ngIf="categoryShimmer">
              <div class="n-level-category-shimmer-container">
                <div class="row-eq-height">
                  <div class="row-col-eq" *ngFor="let category of [1,2,3,4]">
                    <div class="grid-item">
                      <div class="image_div">
                        <div class="image-cat pulsate block"></div>
                      </div>
                      <div class="name_div">
                        <div class="pulsate block"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </ng-container>

          <ng-container *ngIf="(current_category_depth <= category_depth_limit) || !restaurantInfo.has_categories  || hideCategory">
            <app-product-dynamic class="product-app"
              [ngClass]="{'product-app': productList && productList.length, 'product-app_without_product': !productList.length}"
              [hidden]="!productbool" *ngIf="!productShimmer" [productData]="productList" [cardInfo]="cardInfo"
              [searchProducts]="searchOn" [isRestaurantActive]="restaurantInfo.available || restaurantInfo.scheduled_task" [currentCategoryName]="catHead" [paginating]="paginating"
              [hasImages]="product_has_images" [layout_type]="product_layout_type"></app-product-dynamic>
            <div class="product-app product-app-shimmer" *ngIf="productShimmer">
              <div class="product-shimmer-container list">
                <div class="image-div pulsate block">
                </div>
                <div class="detail-div">
                  <div class="detail-grp-1">
                    <div class="pulsate block"></div>
                    <div class="pulsate block"></div>
                    <div class="pulsate block"></div>
                  </div>
                  <div class="detail-grp-2">
                    <div class="pulsate block"></div>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>

          <app-cart-dynamic *ngIf="!isPlatformServer && !cartShimmer && productbool"
            class="cart-app hidden-xs hidden-sm" (askLocation)="askLocation()" [notDeliverable]="showNotDiliverable">
          </app-cart-dynamic>
          <div class="cart-app cart-shimmer hidden-xs hidden-sm"
            *ngIf="cartShimmer && (isPlatformServer || !((productbool && productList && productList.length) || ((!productList || !productList.length) && checkCartData && checkCartData.length)))">
            <div class="category-shimmer-container">
              <div class="pulsate block"></div>
              <div class="pulsate block"></div>
              <div class="pulsate block"></div>
              <div class="pulsate block"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed-bottom visible-xs visible-sm" *ngIf="formSettings.onboarding_business_type !== 805">
        <app-cart-dynamic *ngIf="(!isPlatformServer && productbool) || (checkCartData && checkCartData.length > 0)"
          class="cart-app" (askLocation)="askLocation()" [notDeliverable]="showNotDiliverable"></app-cart-dynamic>
      </div>

    </div>
    <div *ngIf="!noOffering" class="ptb0-lr30 npf">
      <div [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Catalog is not enabled for this offering.</ng-container>
      </div>
    </div>
    <div *ngIf="!productbool && !showNoProduct" style="text-align: center;padding: 13% 0px;font-size: 20px;"
      class="ptb0-lr30 ">
      <div class="text-capitalize" *ngIf="!formSettings.is_custom_order_active">{{langJson['No Product Available.']}}</div>
      <div class="no-prod-text" *ngIf="restaurantInfo.custom_order_active_for_store && formSettings.is_custom_order_active">

      <span class="font-20"><ng-container i18n>Ready to Place your</ng-container><b>{{' '+terminology.ORDER+' '}}</b><ng-container i18n> with {{restaurantInfo.store_name}}</ng-container></span>
      <span class="custom-order-but" (click)="moveToCustomOrder()" ><a class="tk-link"><ng-container i18n>Place </ng-container> {{' '+terminology.CUSTOM_ORDER}}</a></span>
    </div>
    <div class="no-prod-text" *ngIf="formSettings.is_custom_order_active && !restaurantInfo.custom_order_active_for_store">
      <span class="font-18" i18n>Couldn’t find what you were looking for?</span>
      <span class="font-20"><ng-container i18n>Don’t worry we have got your back. Place a </ng-container><b>{{' '+terminology.CUSTOM_ORDER+' '}}</b><ng-container i18n> as per your requirement.</ng-container></span>
      <span class="custom-order-but" (click)="redirectToCustomOrder()" ><a class="tk-link"><ng-container i18n>Place </ng-container> {{' '+terminology.CUSTOM_ORDER}}</a></span>
    </div>
    </div>
  </div>
</div>

 <app-dynamic-footer></app-dynamic-footer>
<app-order-placed-popup-dynamic></app-order-placed-popup-dynamic>
<!-- for time selection in case of pre order  -->
<app-preorder-time-dynamic (onClose)="onClosePreorder()" [hideClose]="hideClosePreorder"
  (onPreorderDateTime)="onPreorderDateTime($event.detail)" [storeData]="restaurantInfo" *ngIf="showPreorderTimeSelection">
</app-preorder-time-dynamic>

<app-ask-for-delivery-address-dynamic *ngIf="showAskLocationPopup" (hide)="hideAskLocation()"
  (askToFetchLocation)="askToFetchLocation()"></app-ask-for-delivery-address-dynamic>
<app-fetch-delivery-address-dynamic *ngIf="showFetchLocationPopup" (hideFetchLocation)="hideFetchLocation()"
  (locationFetched)="locationFetched()"></app-fetch-delivery-address-dynamic>
<app-not-diliverable-dynamic *ngIf="showNotDiliverable" (changeLocationEvent)="changeLocation($event.detail)">
</app-not-diliverable-dynamic>`,
    css: `
    app-category {
      flex: 1 1 25%;
      max-width: 25%;
   }
   .closedRestro {
    position: fixed;
    top: 70px;
    /* border: 2px solid red; */
    z-index: 1000;
    width: 100%;
    background: #c7c7c7;
    color: #fff;
    height: 4rem;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .closedRestro span {
    right: 1%;
    position: absolute;
  }
    #general_background {
      margin-top: 0;
   }
    .select_category {
      padding-bottom: 20px;
      height: auto;
      min-height: calc(100vh - 180px);
   }
    .select_category .padding_35 {
      padding: 0px 35px;
      margin-top: 20px;
   }
    .select_category .fix_search_div {
      box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
   }
    @media screen and (max-width: 991px) {
      .select_category .search_div {
        right: 0%;
     }
      app-category {
        flex: 0;
        max-width: 100%;
     }
   }
    .select_category .fix_search_div hr {
      display: none;
   }
    .search_div {
      z-index: 1;
      position: relative;
      width: 100%;
      top: 0;
      left: 0;
      background-size: cover;
      background-repeat: no-repeat;
      display: table;
      background-color: rgba(0, 0, 0, .3);
   }
    .search_div div.inner-search-div {
      width: 100%;
      height: 240px;
      background-color: rgba(0, 0, 0, 0.35);
      align-items: center;
      justify-content: center;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      padding-top: 30px;
   }
    .search_div div.inner-search-div div span {
      font-size: 50px;
      font-weight: 300;
      letter-spacing: 0.5px;
      color: #fff;
   }
    .search_div div.inner-search-div div hr {
      width: 50px;
      margin-bottom: 0;
      border-top: solid 2px;
   }
    div.heading_cvr {
      margin: 25px auto;
   }
    div.heading_cvr .name {
      font-family: ProximaNova-Regular;
      font-size: 36px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-align: center;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
   }
    div.heading_cvr .description {
      font-family: ProximaNova-Regular;
      font-size: 30px;
      letter-spacing: 0.2px;
      text-align: center;
      color: #fff;
   }
    div.heading_cvr .card_description {
      font-family: ProximaNova-Light;
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 0.3px;
      text-align: center;
      color: #fff;
   }
    div.heading_cvr .addressDetails {
      font-family: ProximaNova-Light;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.3px;
      text-align: center;
      color: #fff;
   }
    @media screen and (max-width: 991px) {
      div.heading_cvr .name {
        font-family: ProximaNova-Regular;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-align: center;
        color: #fff;
     }
      div.heading_cvr .description {
        font-family: ProximaNova-Regular;
        font-size: 18px;
        margin-bottom: 2px;
        letter-spacing: 0.2px;
        text-align: center;
        color: #fff;
     }
      div.heading_cvr .addressDetails {
        font-family: ProximaNova-Regular;
        font-size: 10px;
     }
      div.heading_cvr .locationColor {
        font-size: 16px;
     }
   }
    @media screen and (max-width: 650px) {
      div.heading_cvr .name {
        font-family: ProximaNova-Regular;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-align: center;
        color: #fff;
     }
      div.heading_cvr .description {
        font-family: ProximaNova-Regular;
        font-size: 12px;
        margin-bottom: 2px;
        letter-spacing: 0.2px;
        text-align: center;
        color: #fff;
     }
      div.heading_cvr .addressDetails {
        font-family: ProximaNova-Regular;
        font-size: 10px;
     }
      div.heading_cvr .locationColor {
        font-size: 16px;
     }
   }
    span.ratingCount {
      opacity: 0.9;
      background-color: white;
      font-family: 'ProximaNova-Regular';
      font-size: 20px !important;
      font-weight: bold !important;
      letter-spacing: 1px !important;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      display: inline-block;
      margin-left: 3px;
      padding: 5px;
   }
    div.customRatingDivCat1 {
      position: absolute;
      border-radius: 5px;
      display: inline-block;
      margin-right: 8px;
      padding: 4px 6px;
      height: 35px;
      font-size: 21px !important;
      text-align: center;
      color: #fff !important;
      font-weight: 500 !important;
      margin-left: 0px;
      line-height: 20px;
      margin-top: 45px;
      background: #ffc058;
      cursor: pointer;
      font-family: 'ProximaNova-Regular';
   }
    div.customRatingDivCat1.rateNow {
      background: #5ba829 !important;
      color: white;
      cursor: pointer;
      font-family: 'ProximaNova-Regular';
   }
    .averageRating {
      background-color: #f27d3a !important;
   }
    .goodRating {
      background-color: #31b744 !important;
   }
    @media only screen and (max-width: 991px) {
      div.heading_cvr {
        margin: 15px auto;
     }
      div.heading_cvr .name {
        display: flex;
        justify-content: center;
        align-items: center;
     }
      .mt-50 {
        margin-top: 35px !important;
     }
      div.customRatingDivCat1 {
        position: absolute;
        border-radius: 5px;
        display: inline-block;
        margin-right: 8px;
        padding: 4px 6px;
        height: 28px;
        font-size: 15px !important;
        text-align: center;
        color: #fff !important;
        font-weight: 500 !important;
        margin-left: 0px;
        line-height: 11px;
        margin-top: 25px;
        background: #ffc058;
        cursor: pointer;
        font-family: 'ProximaNova-Regular';
     }
      span.ratingCount {
        opacity: 0.9;
        background-color: white;
        font-family: 'ProximaNova-Regular';
        font-size: 14px !important;
        font-weight: bold !important;
        letter-spacing: 1px !important;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display: inline-block;
        margin-left: 3px;
        padding: 5px;
     }
   }
    .select_category_cover {
      margin: 0 auto;
   }
    @media screen and (max-width: 1024px) and (min-width: 992px) {
      .select_category .select_category_cover {
        width: 100%;
     }
   }
    @media screen and (max-width: 991px) {
      .select_category .select_category_cover {
        width: 100%;
     }
   }
    .select_category .search_div img {
      margin-top: -10px;
      margin-right: 10px;
   }
    .magic_search {
      border-radius: 10px;
      width: 30px;
      border: 0;
      outline: 0;
      box-shadow: 0;
      height: 30px;
      position: relative;
      float: right;
      padding: 5px 35px 5px 5px;
      -webkit-transition: all 0.5s ease;
      -moz-transition: all 0.5s ease;
      transition: all 0.5s ease;
   }
    .magic_search_expanded {
      width: 300px;
      border: 2px solid #858585;
   }
    .magic_search_shrinked {
      width: 30px;
      border: 0;
   }
    .cls-cntn-catalog {
      clear: both;
      margin-top: 150px;
      padding: 51px 90px 20px;
   }
    .list-image {
      width: 90px;
      height: 90px;
   }
    .text-left {
      text-align: left;
   }
    .list-catalog {
      height: 131px;
      margin-bottom: 30px;
   }
    .cls-list-view {
      float: left;
      width: 100%;
      position: relative;
      padding: 20px;
      margin: 5px 0;
      cursor: default;
      background-color: #fff;
      border: 1px solid #efefef;
   }
    .cls-list-view:hover {
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.35s;
   }
    .cls-arrow {
      text-align: right;
      font-size: 18px;
   }
    .cls-cate-info {
      flex: 1 1 0;
      padding-left: 20px;
      text-align: left;
      padding-right: 20px;
      word-break: break-word;
      width: 100%;
   }
   /* <===layout type banner===> */
    .cls-cntn-banner {
      clear: both;
      margin-top: 240px;
      padding: 36px 15px 20px;
   }
    @media screen and (max-width: 620px) {
      .cls-cntn-banner {
        padding: 51px 0 20px;
     }
   }
    .banner_cover {
      max-width: calc(100% - 60px);
      margin: 0 auto;
      padding: 0;
   }
    .select_category .content-card {
      display: inline-block;
      border-radius: 10px;
      vertical-align: top;
      width: 240px;
      padding: 10px;
      margin: 10px;
      margin-bottom: 0;
      padding-bottom: 0;
      border: 2px solid #efefef;
      background-color: #fff;
   }
    .select_category .content-card:hover {
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.35s;
   }
    .select_category .img_div {
      width: 100%;
      height: 220px;
      overflow: hidden;
      object-fit: contain;
      display: grid;
      text-align: center;
      background: #fff;
      justify-content: center;
      align-content: center;
   }
    .select_category .img_div img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 220px;
     /*margin: -75px 0 0 -100px;
     */
   }
    .select_category .img_div::before {
      content: '';
   }
    .select_category .tag_div {
      margin-top: 15px;
      margin-bottom: 20px;
      padding: 0 7px;
   }
    .select_category .tag_div p {
      font-size: 16px;
      letter-spacing: 0.5px;
      text-align: left;
      color: #333;
      margin: 0px;
      word-wrap: break-word;
   }
    .select_category .tag_div i {
      float: right;
      color: #e13d36;
      margin-bottom: 20px;
   }
    .cls-pro-parent {
      max-width: 1230px;
      margin: 0 auto;
      text-align: center;
   }
    .cls-pro-parent div.text-center {
      width: 604px;
      padding: 0 15px;
      display: inline-block;
   }
    @media screen and (max-width: 1229px) {
      .cls-pro-parent div.text-center {
        display: block;
        margin: 0 auto;
     }
   }
    .center-arrow {
      position: relative;
      right: 0;
      top: 35px;
   }
    .catloop {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
   }
    .cat-list-view {
      float: right;
      max-width: 589px;
   }
    .cat-list-view-even {
      max-width: 589px;
   }
    .cls-home-cat {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin: 15px auto 0;
   }
    .cls-home-cat-laundry {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin: 15px auto 0;
      justify-content: center;
   }
    .cat-menu {
      background-color: #fff;
      margin: 0;
      position: relative;
   }
    .cat-menu div.cls-menu-text {
      font-size: 18px;
      text-align: left;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding: 10px 15px;
   }
    .cls-cat-list div {
      position: relative;
      padding-top: 2px;
   }
    .cls-cat-list div.cls-hover-cat {
      padding: 10px 15px;
      word-wrap: break-word;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
   }
    .cls-cat-list div.cls-hover-cat.active {
      border-left: 2px solid var(--theme);
      padding-left: 13px;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: 600;
   }
    .cls-cat-list div.cls-hover-cat:hover {
      border-left: 2px solid;
      padding-left: 13px;
      cursor: pointer;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: 600;
   }
    .cls-cat-list div.cls-cat-sub-list p {
      margin-bottom: 10px;
   }
    .cls-cat-list div.cls-cat-sub-list span.sub-active {
      width: 10px;
      height: 10px;
      position: absolute;
      margin-right: 10px;
      top: -6px;
      font-size: 30px;
      color: #e13d36;
      padding: 0;
   }
    .cls-cat-list div.cls-cat-sub-list span.sub-active span {
      padding: 0;
   }
    .cls-cat-list div.cls-cat-sub-list span {
      padding-left: 12px;
   }
    .green-bold {
      background-color: #94c965;
   }
    .yellow-bold {
      background-color: #ffc058 !important;
   }
    .red-bold {
      background-color: #f03c56 !important;
   }
    @media screen and (max-width: 991px) {
      .product-app {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        margin-top: 5px;
        position: relative;
        left: 0px;
        width: 100% !important;
     }
      .product-app_without_product {
        padding: 0 30px;
        flex: 0 0 100% !important;
        max-width: 100% !important;
        margin-top: 15px;
        position: relative;
        left: 0px;
        width: 100% !important;
     }
      .c-res-cat {
        display: inline-block;
        white-space: nowrap;
        overflow-y: hidden;
        overflow-x: auto;
        width: 100%;
        padding-bottom: 0px;
     }
      .cls-home-cat {
        display: block;
        max-width: 1240px;
        margin: 20px auto 0;
     }
      .cls-home-cat-laundry {
        display: block !important;
        max-width: 1240px;
        margin: 20px auto 0;
        justify-content: center;
     }
      .select_category .select_category_cover {
        padding: 0 0 35px;
     }
      .cat-menu {
        border: none;
     }
      .cls-cat-list {
        display: inline-block;
     }
      .cls-cat-list div {
        position: relative;
        padding-top: 2px;
     }
      .cls-cat-list div.cls-hover-cat {
        padding: 10px 15px;
        word-wrap: break-word;
     }
      .cls-cat-list div.cls-hover-cat.active {
        border-bottom: 2px solid;
        border-left: none;
     }
      .cls-cat-list div.cls-hover-cat:hover {
        border-bottom: 2px solid;
        border-left: none;
        cursor: pointer;
     }
      .cls-cat-list div.cls-cat-sub-list p {
        margin-bottom: 10px;
     }
      .cls-cat-list div.cls-cat-sub-list span.sub-active {
        width: 10px;
        height: 10px;
        position: absolute;
        margin-right: 10px;
        top: -6px;
        font-size: 30px;
        color: #e13d36;
        padding: 0;
     }
      .cls-cat-list div.cls-cat-sub-list span.sub-active span {
        padding: 0;
     }
      .cls-cat-list div.cls-cat-sub-list span {
        padding-left: 12px;
     }
   }
    @media screen and (max-width: 891px) {
      .product-app {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        margin-top: 5px;
        position: relative;
        left: 0px;
        width: 100% !important;
     }
      .product-app_without_product {
        padding: 0 30px;
        flex: 0 0 100% !important;
        max-width: 100% !important;
        margin-top: 15px;
        position: relative;
        left: 0px;
        width: 100% !important;
     }
   }
    .product-app {
      flex: 0 0 70%;
      max-width: 70%;
      width: auto;
   }
    .product-app_without_product {
      padding: 0 30px;
      flex: 0 0 70%;
      max-width: 100%;
   }
    .cart-app {
      flex: 0 0 30%;
      max-width: 30%;
   }
    .fixed-bottom {
      bottom: -20px;
      position: fixed;
      z-index: 10;
   }
    .loader {
      display: block !important;
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      width: 50px;
      height: 50px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, .03);
      border-right: 5px solid rgba(0, 0, 0, .03);
      border-bottom: 5px solid #fff;
      border-left: 5px solid #fff;
      transform: translateZ(0);
   }
   /* Safari */
    @-webkit-keyframes spin {
      0% {
        -webkit-transform: rotate(0deg);
     }
      100% {
        -webkit-transform: rotate(360deg);
     }
   }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
     }
      100% {
        transform: rotate(360deg);
     }
   }
    .search-bar {
      margin-top: 8px;
      display: flex;
      display: -webkit-flex;
      -webkit-flex-direction: row;
      flex-direction: row;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-align-items: center;
      align-items: center;
   }
    .search-bar .location-search {
      width: 20%;
   }
    .search-bar .location-search .form-control {
      background-color: #efefef;
      border-left: none;
   }
    .search-bar .location-search .btn {
      border-right: none;
      background-color: #efefef;
   }
    .search-bar .location-search .form-control {
      height: 33px;
   }
    .search-bar .text-search {
      width: 70%;
   }
    .search-bar .text-search .form-control {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      height: 33px;
   }
    .prodSearch {
      margin: 20px auto;
      display: flex;
      max-width: 745px;
   }
    .prodSearch form {
      width: 100%;
   }
    .prodSearch form .input-group {
      width: 100%;
   }
    .prodSearch form .input-group input {
      height: 40px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      border-right: 0px;
   }
    .prodSearch form .input-group input:focus {
      border-color: #ccc;
   }
    .prodSearch form .input-group .input-group-addon {
      background-color: #fff;
   }
    @media only screen and (min-width: 1550px) {
      .prodSearch form {
        margin-left: -43px;
     }
      .nv-enable-changes {
        max-width: 820px !important;
     }
      .nv-enable-changes form {
        margin-left: -60px !important;
     }
      .nv-enable-changes .search-bar {
        width: 95% !important;
     }
   }
    @media only screen and (min-width: 1350px) and (max-width: 1549px) {
      .prodSearch form {
        margin-left: -40px;
     }
      .nv-enable-changes {
        max-width: 800px !important;
     }
      .nv-enable-changes form {
        margin-left: -60px !important;
     }
      .nv-enable-changes .search-bar {
        width: 95% !important;
     }
   }
    @media only screen and (min-width: 1280px) and (max-width: 1349px) {
      .prodSearch {
        max-width: 645px;
     }
      .prodSearch form {
        margin-left: -32px;
     }
      .nv-enable-changes {
        max-width: 710px !important;
     }
      .nv-enable-changes form {
        margin-left: -52px !important;
     }
      .nv-enable-changes .search-bar {
        width: 95% !important;
     }
   }
    .marginZero {
      margin: 0px;
   }
    .paddingZero {
      padding: 0px;
   }
    .bannerDivMain .bannerDiv {
      z-index: 1;
      position: relative;
      width: 100%;
      top: 0;
      left: 0;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      display: table;
      min-height: 250px;
   }
    .bannerDivMain .storeLogo {
      z-index: 2;
      position: absolute;
      width: 100%;
      left: 105px;
      bottom: -60px;
   }
    .bannerDivMain .storeLogo .storeLogoBend {
      box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
      height: 150px;
      width: 150px;
      background-repeat: no-repeat;
      background-size: contain;
      border: 2px solid #fff;
   }
    .bannerDivMain .ratingView {
      padding: 15px 15px 0px 270px;
   }
    .bannerDivMain .ratingView .storeBasicInfo {
      display: inline-flex;
      width: 100%;
      padding-bottom: 5px;
   }
    .bannerDivMain .ratingView .storeBasicInfo .storeName {
      font-family: 'ProximaNova-Semibold';
      font-size: 24px;
      width: 100%;
   }
    .bannerDivMain .ratingView .storeBasicInfo .storeName .starRating {
      display: inline-flex;
      width: 100%;
   }
    .bannerDivMain .ratingView .storeBasicInfo .storeName .starRating .stars {
      padding-left: 10px;
      padding-top: 5px;
   }
    .bannerDivMain .ratingView .storeBasicInfo .storeName .reviewButton {
      text-align: right;
      width: 30%;
   }
    @media only screen and (max-width: 990px) {
      .bannerDivMain .ratingView {
        padding: 15px 15px 0px 15px;
     }
      .bannerDivMain .storeLogo {
        bottom: 10px;
        left: 0px;
        text-align: center;
     }
      .bannerDivMain .storeLogo .storeLogoBend {
        height: 110px;
        width: 110px;
     }
   }
    .withoutAppCategory {
      -webkit-box-flex: 1;
      -ms-flex: 1 1 25%;
      flex: 1 1 25%;
      max-width: 25%;
   }
    .veg_only_check {
      height: 40px;
      display: flex;
      align-items: center;
   }
    #cat-fix, #cart-fix {
      position: sticky;
      top: 0px;
      z-index: 10;
   }
    .m0 {
      margin: 0px;
   }
    .p0 {
      padding: 0px;
   }
    @media screen and (min-width: 768px) {
      .cls-home-cat {
        padding: 0 8rem;
     }
   }
    .pre-order-btn {
      position: relative;
      top: 3px;
      left: 0px;
   }
    .pre-order-btn.veg-filer-disable {
      top: 11px;
   }
    @media screen and (min-width: 768px) {
      .pre-order-btn {
        left: -30px;
     }
   }
    .preorder-btn-cvr {
      position: relative;
   }
    .preorder-btn-cvr .preorder-popover {
      position: absolute;
      top: -18px;
      left: 101px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.13);
      z-index: 5;
      width: 200px;
      padding: 10px 15px;
   }
    @media screen and (max-width: 1300px) {
      .preorder-btn-cvr .preorder-popover {
        top: 40px;
        left: -50px;
     }
   }
    .preorder-btn-cvr .preorder-popover p.preorder-time {
      margin-bottom: 5px;
      font-family: 'ProximaNova-Regular';
   }
    .preorder-btn-cvr .preorder-popover p.instant {
      font-family: 'ProximaNova-Regular';
      margin-bottom: 0;
   }
    .preorder-btn-cvr .preorder-popover p.instant a {
      font-family: 'ProximaNova-Semibold';
      color: var(--theme);
      cursor: pointer;
   }
    .preorder-btn-cvr .preorder-popover .caret-icon {
      top: 19px;
      left: -15px;
      position: absolute;
      font-size: 30px;
      color: #fff;
      transform: rotate(-90deg);
   }
    @media screen and (max-width: 1300px) {
      .preorder-btn-cvr .preorder-popover .caret-icon {
        top: -18px;
        left: 85px;
        transform: rotate(0deg);
     }
   }
    .category-shimmer {
      flex: 1 1 25%;
      margin-top: 20px;
   }
    .product-app-shimmer {
      margin: 20px 15px 0px 15px;
   }
    .cart-shimmer {
      margin-top: 20px;
   }
    .rate-now-star {
      font-size: 19px;
   }
    .rate-now {
      padding-left: 0;
   }
    @media only screen and (max-width: 767px) {
      .product-app {
        margin: 0px;
     }
   }
    .mt-50 {
      margin-top: 50px;
   }
    .mt-10 {
      margin-top: 10px;
   }
    .locationColor {
      color: var(--theme);
      font-size: 24px;
   }
    .displayFlex {
      display: flex;
      align-items: center;
      justify-content: center;
   }
    .new-search {
      display: flex;
      justify-content: center;
   }
    .new-search .input-group {
      width: 100%;
   }
    .new-search .input-group input {
      height: 40px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      border-right: 0px;
   }
    .new-search .input-group input:focus {
      border-color: #ccc;
   }
    .new-search .input-group .input-group-addon {
      background-color: #fff;
   }
    .pad-left-0 {
      padding-left: 0;
   }
    @media screen and (max-width: 414px) {
      .new-search {
        padding: 0px 25px;
     }
      .new-search div.new-box {
        display: flex;
        width: 100% !important;
     }
   }
    @media screen and (min-width: 768px) and (max-width: 970px) {
      .new-search {
        padding: 0;
        margin-left: 50px;
     }
      .new-search.pad-mobile .pad-left-0 {
        padding-left: 15px;
     }
      .new-search div.new-box {
        display: flex;
        width: 90% !important;
     }
   }
    .new-search div.new-box {
      display: flex;
      width: 56%;
   }
    .pad-search-0 {
      padding-left: 0px !important;
   }
    .category-shimmer-container {
      padding: 15px;
      background-color: white;
      max-width: 100%;
      width: 86%;
      margin: 0 auto;
   }
    .category-shimmer-container div {
      margin-top: 12px;
      height: 10px;
      width: 100%;
   }
    .category-shimmer-container div:nth-child(1) {
      height: 25px;
   }
    .category-shimmer-container div:nth-child(2) {
      margin-top: 20px;
      width: 72%;
   }
    .category-shimmer-container div:nth-child(3) {
      width: 83%;
   }
    .category-shimmer-container div:nth-child(4) {
      width: 95%;
   }
    .product-shimmer-container {
      padding: 15px;
      background-color: white;
   }
    .product-shimmer-container.grid {
      display: block;
      padding: 0px !important;
      margin-right: 10px;
      margin-top: 10px;
   }
    .product-shimmer-container.grid .image-div {
      height: 150px;
      width: 100%;
      margin-right: 0px;
   }
    .product-shimmer-container.grid .detail-div {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-1 {
      width: 100%;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-1 div {
      height: 10px;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-1 div:nth-child(1) {
      width: 100%;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-1 div:nth-child(2) {
      margin-top: 20px;
      width: 50%;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-1 div:nth-child(3) {
      margin-top: 20px;
      width: 45%;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-2 {
      margin-top: 10px;
   }
    .product-shimmer-container.grid .detail-div .detail-grp-2 div {
      width: 100%;
      height: 10px;
   }
    .product-shimmer-container.list {
      display: flex;
   }
    .product-shimmer-container.list .image-div {
      height: 120px;
      width: 120px;
      margin-right: 20px;
   }
    .product-shimmer-container.list .detail-div {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
   }
    .product-shimmer-container.list .detail-div .detail-grp-1 {
      width: 80%;
   }
    .product-shimmer-container.list .detail-div .detail-grp-1 div {
      height: 10px;
   }
    .product-shimmer-container.list .detail-div .detail-grp-1 div:nth-child(1) {
      width: 100%;
   }
    .product-shimmer-container.list .detail-div .detail-grp-1 div:nth-child(2) {
      margin-top: 20px;
      width: 50%;
   }
    .product-shimmer-container.list .detail-div .detail-grp-1 div:nth-child(3) {
      margin-top: 20px;
      width: 45%;
   }
    .product-shimmer-container.list .detail-div .detail-grp-2 div {
      width: 70%;
      height: 10px;
   }
    @media only screen and (max-width: 768px) {
      .product-shimmer-container.grid {
        margin-left: 10px;
        margin-right: 0px;
     }
   }
    .n-level-category-shimmer-container .row-eq-height {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      padding: 0 2rem 0 0;
      margin-top: 1rem;
   }
    .n-level-category-shimmer-container .row-eq-height .row-col-eq {
      min-width: 25%;
      max-width: 25%;
      margin-bottom: 15px;
   }
    .n-level-category-shimmer-container .grid-item {
      margin: 1rem;
   }
    .n-level-category-shimmer-container .image-cat {
      width: 100%;
      height: 9vw;
      min-height: 9vw;
      min-width: 100%;
      background-color: #eaeaea;
      object-fit: cover;
      cursor: pointer;
      transition: transform 800ms ease-out;
   }
    .n-level-category-shimmer-container .image-cat:hover {
      transform: scale(1.12);
   }
    .n-level-category-shimmer-container .image_div {
      margin: 0.5rem;
      overflow: hidden;
      margin-bottom: 0px;
      border: 0px solid #eaeaeb;
   }
    .n-level-category-shimmer-container .name_div {
      margin: 0.5rem;
      margin-top: 0px;
      text-align: center;
      font-size: 14px;
      text-overflow: ellipsis;
      padding: 1rem 0;
      border: 2px solid #eaeaeb;
      color: #474747;
      white-space: nowrap;
      overflow: hidden;
   }
    @media only screen and (max-width: 425px) {
      .n-level-category-shimmer-container .row-col-eq {
        min-width: 50% !important;
        max-width: 50% !important;
     }
      .n-level-category-shimmer-container .image-cat {
        height: 22vw !important;
     }
      .n-level-category-shimmer-container .row-eq-height {
        padding: 1rem !important;
     }
      .n-level-category-shimmer-container .grid-item {
        margin: 0.5rem !important;
     }
   }
    @media only screen and (min-width: 425px) and (max-width: 767px) {
      .n-level-category-shimmer-container .row-col-eq {
        min-width: 50% !important;
        max-width: 50% !important;
     }
      .n-level-category-shimmer-container .image-cat {
        height: 25vw !important;
     }
   }
    @media only screen and (min-width: 768px) and (max-width: 1024px) {
      .n-level-category-shimmer-container .row-col-eq {
        min-width: 33% !important;
        max-width: 33% !important;
     }
      .n-level-category-shimmer-container .image-cat {
        height: 15vw !important;
     }
   }

   .card-shimmer-container {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
 }
  .card-shimmer-container:after {
    content: '';
    background: linear-gradient(-45deg, #ddd 0, #f0f0f0 0, #ddd 12, #f0f0f0 4a);
    background-size: 535% 100%;
    -webkit-animation: 2.25s infinite Gradient;
    animation: 2.25s infinite Gradient;
    width: 100%;
    z-index: 9999;
    position: absolute;
    height: 100%;
    background-repeat: no-repeat;
 }
  .fpo {
    position: relative;
    margin: 25% auto;
    display: block;
 }
  .pulsate {
    background: linear-gradient(-45deg, #ddd, #f0f0f0, #ddd, #f0f0f0);
    background-size: 400% 400%;
    -webkit-animation: Gradient 2.25s ease infinite;
    -moz-animation: Gradient 2.25s ease infinite;
    animation: Gradient 2.25s ease infinite;
 }
  .block {
    display: block;
    width: 271px;
    height: 16px;
    color: black;
 }
  .block2 {
    width: 78px;
    height: 8px;
    margin-bottom: 8px;
 }
  .block3 {
    width: 131px;
    height: 8px;
    margin-bottom: 16px;
 }
  .circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    float: right;
 }
  #card {
    box-sizing: border-box;
    width: 335px;
    background: #fff;
    position: relative;
    margin: auto;
    margin-bottom: 10px;
    top: 25%;
 }
  .card-image {
    box-sizing: border-box;
    display: block;
    width: 335px;
    height: 243px;
    background: #fafafa;
    padding: 16px;
 }
  .card-content {
    clear: both;
    box-sizing: border-box;
    padding: 16px;
    background: #fff;
 }
  @-webkit-keyframes Gradient {
    0% {
      background-position: 0% 50%;
   }
    50% {
      background-position: 100% 50%;
   }
    100% {
      background-position: 0% 50%;
   }
 }
  @-moz-keyframes Gradient {
    0% {
      background-position: 0% 50%;
   }
    50% {
      background-position: 100% 50%;
   }
    100% {
      background-position: 0% 50%;
   }
 }
  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
   }
    50% {
      background-position: 100% 50%;
   }
    100% {
      background-position: 0% 50%;
   }
 }
 .tapri-class {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 768px) {
  .tapri-class {
    padding-bottom: 85px !important;
  }
}

.ptb0-lr30 .no-prod-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.ptb0-lr30 .no-prod-text .font-20 {
  font-size: 20px;
}
.ptb0-lr30 .no-prod-text .font-18 {
  font-size: 18px;
}
.ptb0-lr30 .no-prod-text .custom-order-but {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid var(--theme);
  background-color: var(--theme);
  color: #fff !important;
  border-radius: 5px;
}
.ptb0-lr30 .no-prod-text .custom-order-but a {
  font-size: 16px;
  color: #fff;
}
.ptb0-lr30 .no-prod-text .custom-order-but:hover {
  background-color: #fff;
  border: 1px solid var(--theme);
}
.ptb0-lr30 .no-prod-text .custom-order-but:hover a {
  color: var(--theme);
}
@media screen and (max-width: 768px) {
  .ptb0-lr30 .no-prod-text {
    padding: 0px 12px;
  }
  .ptb0-lr30 .no-prod-text .font-20 {
    font-size: 16px;
  }
  .ptb0-lr30 .no-prod-text .font-18 {
    font-size: 15px;
  }
  .ptb0-lr30 .no-prod-text .custom-order-but {
    padding: 9px;
  }
  .ptb0-lr30 .no-prod-text .custom-order-but a {
    font-size: 14px;
  }
}


    `
  },
  cart: {
    html: `
        <div id="cart-fix" *ngIf="langJson">
        <div class="hidden-xs hidden-sm deskView">
        <div class="app-cart-text text-center cartAndClear">
        <div class="text-capitalize">{{terminology.CART}}</div>
        <div class="text-capitalize clearCart" (click)="clearCart()" *ngIf="cartData.length && langJson">{{langJson['Clear']}}</div>
        </div>
            <div class="app-cart-div" [ngClass]="{'pad-60': !cartData.length }">
                <div class="app-cart-item" *ngIf="cartData.length">
                    <div class="app-cart-list">
                        <div class="app-cart-item" *ngFor="let product of cartData;let i = index;">
                            <div>
                                <p class="app-item-head">{{product.name}}</p>
                                <p *ngIf="product.customizations && product.customizations.length" class="app-sub-item">
                                    <span *ngFor="let custom of product.customizations;let last = last">{{custom.name}}
                                      <span *ngIf="!last" style="padding:0;">, </span>
                                    </span>
                                </p>
                            </div>
                            <div class="app-item-info">
                                <div class="cart-p-detail-sec">
                                    <div class="p-action-btn">
                                        <div [ngStyle]="{'display': (product.type != 1) ? 'flex':'none'}">
                                            <div class="p-minus btn-cursor" (click)="checkforMinQty(product.id,i,product,1)">
                                                <svg width="10" height="7" viewBox="0 0 10 2">
                                                  <path fill="#858585" fill-rule="nonzero" d="M0 1.75h10V.25H0z" />
                                                </svg>
                                            </div>
                                            <div class="p-quantity">
                                                <input appNumberOnly maxlength="4"  aria-label="Product quantity" class="p-quantity inputBulkOrderClass" [(ngModel)]="product.quantity" (focus)="onFocusQty($event)" (blur)="checkforMinQty(product.id,i,product,0)">
                                            </div>
                                            <div class="p-plus btn-cursor" (click)="increaseQuantity(product.id,i)" [style.background-color]="appConfig.btn_color?appConfig.btn_color:'#1a9943'">
                                                <!--appColor bg='true'-->
                                                <svg width="9" height="9" viewBox="0 0 10 10">
                                                  <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div [ngStyle]="{'display': (product.type == 1) ? 'flex':'none'}">
                                            <div class="p-minus btn-cursor t-btn" (click)="checkforMinQty(product.id,i,product,1)">
                                                {{removeBtnTxt}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="app-item-totalprice" *ngIf="appConfig.show_product_price == 1 || product.showPrice > 0">
                                        <span>{{currency+''}} {{decimalConfigPipe(product.quantity * product.showPrice)}}</span>
                                    </div>
                                </div>

                            </div>
                            <p *ngIf="product.minimum_quantity>1" class="app-sub-item min-qty">
                                <ng-container>Minimum Quantity</ng-container> {{product.minimum_quantity}}
                            </p>

                            <hr [ngClass]="{'app-cart_item_seperation': i < cartData.length - 1 , 'app-subtotal_seperation': i == cartData.length - 1 }" />

                        </div>
                    </div>
                </div>
                <div *ngIf="!cartData.length" class="emptyCart">
                    <!-- <span><img class="img-cart" src="assets/img/group-food.svg"></span> -->
                    <span><img class="img-cart" src="assets/img/empty-cart.svg"></span>
                    <span class="text-cart">{{langJson['Your cart is empty']}}</span>
                    <span class="subtext-cart"><ng-container i18n>Add an item to begin</ng-container></span>
                </div>
            </div>
            <div class="app-subtotal">
                <div class="separtor" *ngIf="!cartData.length && (appConfig.show_product_price == 1 || totalCount > 0)">
                </div>
                <div class="app-item-subtotal" *ngIf="cartData.length">
                    <div class="total-txt" [ngStyle]="{ 'direction' : direction }">
                        <span class="head">
                <ng-container i18n>Subtotal</ng-container>
              </span>
                    </div>
                    <div class="total">
                        <span class="total">{{currency+''}} {{decimalConfigPipe(totalCount)}}</span>
                    </div>
                </div>

            </div>
            <button mat-button *ngIf="cartData.length && !notDeliverable" class="cart-btn btn btn-default btn-block ripple" appColor hoverbgSimple="true" (click)="goToCheckout()" [style.background-color]="appConfig.color">
          <span class="text-capitalize">{{terminology.CHECKOUT}}</span>
        </button>
        </div>
        <button class="visible-sm visible-xs bottom-bar" mat-button [style.background-color]="appConfig.color" *ngIf="cartData.length && !notDeliverable" (click)="goToCheckout()">
        <div class="col-xs-6  align-items-center checkout-bottom" style="justify-content: flex-start;">
          <div style="padding: 4px;">
            <!--<img src="assets/img/cart-heading.svg" />-->
            <span style="font-size: 24px;padding-right: 8px;">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </span>
            <span style="text-transform: uppercase;">{{cartData.length > 1 ? cartData.length +' '+ terminology.ITEMS  + ' ' + langJson['IN'] + ' ' + terminology.CART : cartData.length +' '+
            terminology.ITEM + ' ' + langJson['IN'] + ' ' + terminology.CART}}span>
          </div>
        </div>
        <div class="col-xs-6 align-items-center checkout-bottom text-capitalize" *ngIf="appConfig.show_product_price == 1 || totalCount > 0">
          <!--<span>{{terminology.CHECKOUT}}</span>-->
          <span class="total">{{currency+''}} {{decimalConfigPipe(totalCount)}}</span>
        </div>
      </button>
    </div>

    <app-modal-dynamic class="container" [modalType]="'modal-md'" [header]="langJson['Remove Item']" (onClose)="removeCartItemPopup = false" (esc)="removeCartItemPopup = false" *ngIf="removeCartItemPopup">
        <div body>
            <div class="row" style="padding: 15px">
                <div class="col-md-12" style="height: 90px;padding:15px">
                    <h4 class="dialog-msg">
                        <ng-container> {{messageRemoveItem}}</ng-container>
                    </h4>
                </div>
                <div class="col-md-12" style="padding:0px">
                    <div class="modal-footer dialog-action">
                        <button class="dialog-cancel btn btn-default" mat-button (click)="onRemoveSelected(selectedCartItemId,selectedCartItemIndex,selectedOperationMethod,0)" [ngStyle]="{ 'direction' : direction }">
                            <ng-container i18n>Retain</ng-container>
                        </button>
                        <button class="dialog-ok btn btn-default primary-theme-btn" mat-button (click)="onRemoveSelected(selectedCartItemId,selectedCartItemIndex,selectedOperationMethod,1)"
                            [ngStyle]="{ 'direction' : direction }" >
                            <ng-container i18n>Remove</ng-container>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </app-modal-dynamic>
    <app-modal-dynamic class="container" modalType="'modal-md'" (onClose)="showClearCartPopup = false" (esc)="showClearCartPopup = false" *ngIf="showClearCartPopup">
    <div body>
            <div class="row clearCartRow">
                    <div class="col-md-12 p-0">
                            <h4 class="dialog-msg clearCartMsg">
                                <ng-container i18n> Do you want to clear your {{terminology.CART}} ?</ng-container>
                            </h4>
                    </div>
                    <div class="col-md-12 btnsDiv">
                            <div class="modal-footer dialog-action">
                                    <button class="dialog-cancel btn btn-default yesNoBtn" (click)="clearCartData()">
                                            <ng-container i18n>Yes</ng-container>
                                    </button>
                                    <button class="dialog-ok btn btn-default primary-theme-btn yesNoBtn"
                        [ngStyle]="{ 'direction' : direction }" (click)="doNotClearCart()">
                        <ng-container i18n>No</ng-container>
                    </button>

                            </div>
                    </div>

            </div>

    </div>

</app-modal-dynamic>
    <app-customer-verification-popup-dynamic *ngIf="showCustomerVerificationPopUp" (popUpClose)="onPopUpClose()" ></app-customer-verification-popup-dynamic>
    `,
    css: `#cart-fix {
      font-family: "ProximaNova-Regular";
   }
    #cart-fix .deskView {
      margin-top: 20px;
   }
    #cart-fix .app-cart-div {
      background-color: #fff;
      border: solid 1px #ddd;
      padding: 15px 15px 0;
      border-bottom-color: transparent;
   }
    #cart-fix .app-item-head {
      width: 169px;
      font-size: 14px;
      word-break: break-word;
      margin-bottom: 0;
      font-family: ProximaNova-Regular;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.36;
      letter-spacing: 0.2px;
      text-align: left;
      color: #333;
   }
    #cart-fix .app-sub-item {
      font-size: 12px;
      letter-spacing: 0.2px;
      color: #858585;
      margin-bottom: 0;
   }
    #cart-fix .app-cart-item div.item-info {
      display: flex;
      padding-top: 20px;
      user-select: none;
   }
    #cart-fix .app-cart-item div.item-price {
      padding-top: 7px;
      flex: 1 1 0;
   }
    #cart-fix .app-cart-item div.item-totalprice {
      padding-top: 7px;
      text-align: right;
      user-select: none;
   }
    #cart-fix .app-cart-item span span {
      padding-right: 20px;
   }
    #cart-fix .app-cart_item_seperation {
      width: 100%;
      margin: 15px 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
   }
    #cart-fix .app-subtotal_seperation {
      width: 100%;
      border-top: 1px solid transparent;
      margin: 20px 0 0 0;
   }
    #cart-fix .app-subtotal .separtor {
      border-bottom: 1px solid #ddd;
      border-radius: 4px;
   }
    #cart-fix .app-item-subtotal {
      display: flex;
      border-radius: 0 0 4px 4px;
      background-color: #f5f5f5;
      padding: 14px 15px 11px;
      width: auto;
      border: 1px solid #ddd;
   }
    #cart-fix .app-item-subtotal div.total-txt {
      flex-basis: 75px;
   }
    #cart-fix .app-item-subtotal div.total-txt span.head {
      width: 53px;
      height: 21px;
      font-size: 14px;
      letter-spacing: 0.4px;
      text-align: left;
      color: #5c5c5c;
   }
    #cart-fix .app-item-subtotal div.total {
      text-align: right;
      flex: 1 1 0%;
   }
    #cart-fix .app-item-subtotal div.total span {
      height: 22px;
      font-size: 14px;
      font-weight: 600;
      text-align: right;
      color: #5c5c5c;
      user-select: none;
   }
    #cart-fix .app-cls-plusminus-cart {
      display: grid;
      grid-template-columns: 35px 45px 35px;
      padding-right: 20px;
   }
    #cart-fix .app-cls-plusminus-cart div.quantity {
      padding-top: 10px;
      text-align: center;
   }
    #cart-fix .app-cart-text {
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
      border: 1px solid #ddd;
      border-bottom: 1px solid transparent;
      padding: 10px 15px;
      background-color: white;
   }
    #cart-fix button.cart-btn {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      margin-top: 20px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      background:var(--theme);
      border:2px solid var(--theme);
      color: #fff;
   }
    #cart-fix button.cart-btn span {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-align: left;
   }
    #cart-fix button.cart-btn:hover {
      background:white !important;
      color:var(--theme);
   }
    #cart-fix .app-cart-list {
      max-height: 300px;
      overflow: auto;
      width: calc(100% + 35px);
      margin-left: -20px;
      padding: 0 20px;
      overflow-x: hidden;
      transform-style: all 0.3s;
   }
    #cart-fix .app-cart-list::-webkit-scrollbar {
      width: 3px;
   }
    #cart-fix div.cart-p-detail-sec {
      margin-top: 5px;
      display: flex;
   }
    #cart-fix div.cart-p-detail-sec div.app-item-totalprice {
      padding-top: 7px;
      text-align: right;
      user-select: none;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.2px;
      color: #5c5c5c;
   }
    #cart-fix div.p-action-btn {
      flex: 1 1 0%;
      display: flex;
      justify-content: flex-start;
   }
    #cart-fix div.p-action-btn div.p-minus {
      width: 23.4px;
      height: 23.4px;
      border-radius: 3.6px;
      background-color: #fff;
      border: solid 0.9px #ddd;
      text-align: center;
      line-height: 20px;
   }
    #cart-fix div.p-action-btn div.p-minus div {
      width: 9px;
      height: 1.8px;
      background-color: #858585;
   }
    #cart-fix div.p-action-btn div.p-plus {
      width: 23.4px;
      height: 23.4px;
      border-radius: 3.6px;
      justify-content: center;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 20px;
      user-select: none;
   }
    #cart-fix div.p-action-btn div.p-quantity {
      text-align: center;
      padding-top: 0px;
      width: 40px;
      font-family: ProximaNova-Regular;
      font-size: 12.6px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.2px;
      color: #333;
   }
    #cart-fix .emptyCart {
      height: 100px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: ProximaNova-Regular;
      color: #7e808c;
   }
    #cart-fix .emptyCart .img-cart {
      height: 70px;
   }
    #cart-fix .emptyCart .text-cart {
      padding-top: 20px;
   }
    #cart-fix .checkout.btn.btn-default {
      border: 0;
   }
    #cart-fix .checkout.btn.btn-default:active, #cart-fix .checkout.btn.btn-default:focus {
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      border: 0;
   }
    #cart-fix .bottom-bar {
      width: 100vw;
      padding: 4px;
      color: white;
      height: 50px;
      position: fixed;
      bottom: 0px;
   }
    #cart-fix .checkout-bottom {
      height: 100%;
      font-size: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
      align-content: center;
      justify-content: flex-end;
   }
    #cart-fix div.p-plus.t-btn, #cart-fix div.p-minus.t-btn {
      font-size: 14px !important;
      padding: 2px 10px;
      width: auto !important;
      height: auto !important;
   }
    #cart-fix .btn-cursor {
      cursor: pointer !important;
   }
   #cart-fix .clearBtn {
    width: 100%;
    height: 35px;
    border-radius: 6px !important;
    font-family: ProximaNova-Regular;
    font-size: 16px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
  }
  #cart-fix .clearBtn span {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-align: left;
  }
  #cart-fix .clearBtn:hover {
    transform: scale(1);
    color: #fff;
  }
#cart-fix .cartAndClear{
    display: flex;
    justify-content: space-between
}
#cart-fix .clearCart{
  color: var(--theme);
  cursor: pointer;
}
#cart-fix .clearCart:hover{
  color: #333333;
}
#cart-fix .clearCartRow{
  padding: 15px;
}
:host /deep/ .modal-content{
  width: 415px !important;
}
#cart-fix .btnsDiv{
  padding: 0px;
}
.clearCartMsg{
  padding: 12px !important;
}
:host /deep/ .modal{
  left: auto !important;
}

    @media only screen and (max-width: 1469px) and (min-width: 990px) {
      #cart-fix {
        min-width: 250px;
     }
   }
    .min-qty {
      margin-top: 10px !important;
      color: #afafaf !important;
   }
    .dialog-cancel {
      border: solid 1px #b2b2b2 !important;
   }
    .pad-60 {
      padding: 60px 0px !important;
   }
    `
  },
  category: {
    html: `<div class="menu-category-list">
    <div class="cat-menu row " id="cat-fix">
        <div class="deskViewMain">

          <div class="cls-menu-text hidden-xs hidden-sm" [ngStyle]="{ 'direction' : direction }" *ngIf="terminology">
            <span>{{terminology.MENU ? terminology.MENU : 'Menu'}}</span>
          </div>
          <div class="hidden-xs hidden-sm deskCateView">
            <div class="cls-cat-list" *ngFor="let category of categoryData; let ind = index">
              <a data-toggle="collapse" [href]="'#collapse'+ind" *ngIf="category.has_children">
                <div class="cls-hover-cat deskView"
                  [ngClass]="{'active':(selectedItem.parent_category_id==category.catalogue_id)? true:false}">
                  <span>{{category.name}}</span>
                  <div [id]="'collapse'+ind" class="panel-collapse collapse" style="margin-top:10px">
                    <div class="panel-body subcategory"
                      [ngStyle]="{'color':(selectedItem.catalogue_id==sub_cat.catalogue_id)? appConfig.color:''}"
                      *ngFor="let sub_cat of category.sub_categories" (click)="selectedCategory(sub_cat,category)">
                      <span>{{sub_cat.name}}</span>
                    </div>
                  </div>
                </div>
              </a>

              <ng-container *ngIf="!category.has_children">
                <div class="cls-hover-cat deskView" (click)="selectedCategory(category)"
                  [ngClass]="{'active':(selectedItem.catalogue_id==category.catalogue_id)? true:false}"
                  [ngStyle]="{'color':(selectedItem.catalogue_id==category.catalogue_id)? appConfig.color:''}">
                  <span>{{category.name}}</span>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
        <div class="mobileViewMain">

          <div class="visible-xs visible-sm" style="
          /*position: fixed;*/
          background: #F3F3F3;
          margin-top: 0px;
          z-index: 1;
          width: 100%;
          " *ngIf="!hideCategory">
            <div class="c-res-cat">
              <div class="cls-cat-list" *ngFor="let category of categoryData">
                <div class="cls-hover-cat"
                  [ngClass]="{'active':(selectedItem.catalogue_id==category.catalogue_id)? true:false}"
                  [ngStyle]="{'color':(selectedItem.catalogue_id==category.catalogue_id)? appConfig.color:''}"
                  (click)="selectedCategory(category)">
                  <span>{{category.name}}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
</div>

`,
    css: `
    .menu-category-list .cls-cntn-catalog {
      clear: both;
      margin-top: 150px;
      padding: 51px 90px 20px;
   }
    .menu-category-list .list-image {
      width: 90px;
      height: 90px;
   }
    .menu-category-list .text-left {
      text-align: left;
   }
    .menu-category-list .list-catalog {
      height: 131px;
      margin-bottom: 30px;
   }
    .menu-category-list .cls-list-view {
      float: left;
      width: 100%;
      position: relative;
      padding: 20px;
      margin: 5px 0;
      cursor: default;
      background-color: #fff;
      border: 1px solid #efefef;
   }
    .menu-category-list .cls-list-view:hover {
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.35s;
   }
    .menu-category-list .cls-arrow {
      text-align: right;
      font-size: 18px;
   }
    .menu-category-list .cls-cate-info {
      flex: 1 1 0;
      padding-left: 20px;
      text-align: left;
      padding-right: 20px;
      word-break: break-word;
      width: 100%;
   }
    .menu-category-list .cls-cntn-banner {
      clear: both;
      margin-top: 240px;
      padding: 36px 15px 20px;
   }
    @media screen and (max-width: 620px) {
      .menu-category-list .cls-cntn-banner {
        padding: 51px 0 20px;
     }
   }
    .menu-category-list .cls-pro-parent {
      max-width: 1230px;
      margin: 0 auto;
      text-align: center;
   }
    .menu-category-list .cls-pro-parent div.text-center {
      width: 604px;
      padding: 0 15px;
      display: inline-block;
   }
    @media screen and (max-width: 1229px) {
      .menu-category-list .cls-pro-parent div.text-center {
        display: block;
        margin: 0 auto;
     }
   }
    .menu-category-list .center-arrow {
      position: relative;
      right: 0;
      top: 35px;
   }
    .menu-category-list .catloop {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
   }
    .menu-category-list .cat-list-view {
      float: right;
      max-width: 589px;
   }
    .menu-category-list .cat-list-view-even {
      max-width: 589px;
   }
    .menu-category-list .sidebar {
      background-color: #fff;
      border: solid 1px #ddd;
      width: 60%;
   }
    .menu-category-list .sidebar_header {
      padding: 8px;
      font-family: ProximaNova-Regular;
      font-size: 18px;
      text-align: left;
      color: #333;
      border-bottom: 1px solid #ddd;
   }
    .menu-category-list .parent_cat a {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      margin-top: 8px;
      color: #333;
      border-left: 2px solid transparent;
   }
    .menu-category-list .parent_cat p {
      padding: 0 0 0 10px;
      margin-bottom: 5px;
   }
    .menu-category-list .parent_cat a:hover {
      font-weight: 600;
      border-left: 2px solid red;
   }
    .menu-category-list #sidebar {
      background-color: #fff;
      transition: all 0.3s;
      border: solid 1px #ddd;
   }
    .menu-category-list a[data-toggle="collapse"] {
      position: relative;
   }
    .menu-category-list a[aria-expanded="false"]::before, .menu-category-list a[aria-expanded="true"]::before {
      content: '\e259';
      display: block;
      position: absolute;
      right: 20px;
      font-family: 'Glyphicons Halflings';
      font-size: 0.6em;
   }
    .menu-category-list a[aria-expanded="true"]::before {
      content: '\e260';
   }
    .menu-category-list a, .menu-category-list a:hover, .menu-category-list a:focus {
      color: inherit;
      text-decoration: none;
      transition: all 0.3s;
   }
    .menu-category-list #sidebar .sidebar-header {
      padding: 20px;
   }
    .menu-category-list #sidebar ul.components {
      padding-bottom: 8px;
   }
    .menu-category-list #sidebar ul p {
      color: #fff;
      padding: 10px;
   }
    .menu-category-list .submenu {
      padding-left: 20px;
      list-style-type: none;
   }
    .menu-category-list .nav > li > a {
      padding: 0 15px;
      background-color: transparent !important;
   }
    .menu-category-list li.list-item.active > a, .menu-category-list li.list-item.active > a:hover, .menu-category-list li.list-item.active > a:focus {
      font-weight: 600;
      border-left: 2px solid red;
   }
    .menu-category-list .submenu a {
      border-left: 2px solid transparent !important;
   }
    .menu-category-list li.list-item.active.over-ride > a, .menu-category-list li.list-item.active.over-ride > a:hover, .menu-category-list li.list-item.active.over-ride > a:focus {
      border-left: 2px solid var(--theme) !important;
      color: red;
      font-weight: 400;
   }
    .menu-category-list .menu {
      list-style-type: none;
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      -webkit-flex-direction: row;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      padding-left: 0;
      -webkit-overflow-scrolling: touch;
   }
    .menu-category-list .mobile-nav {
      z-index: 1111;
   }
    .menu-category-list .item {
      width: 100px;
      border-bottom: 2px solid transparent;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
   }
    .menu-category-list .item .btn {
      width: 100%;
   }
    .menu-category-list .item.active {
      border-bottom: 2px solid red;
   }
    .menu-category-list .search-bar {
     /*position: fixed;
     */
      background: #f3f3f3;
      margin-top: -19px;
      z-index: 2;
      width: 100%;
      margin-bottom: 5px;
   }
    .menu-category-list .search-bar.prodSearch {
      margin-top: 0;
      margin-bottom: 20px;
   }
    .menu-category-list .search-bar .input-group input {
      font-family: ProximaNova-Regular;
      font-size: 16px;
      border-right: 0px;
      height: 40px;
   }
    .menu-category-list .search-bar .input-group .input-group-addon {
      background-color: #fff;
   }
    .menu-category-list .cat-menu {
      margin-top: 20px;
      background-color: #f3f3f3 !important;
   }
    .menu-category-list .cat-menu .searchView {
      height: 40px;
   }
    .menu-category-list .cat-menu div.cls-menu-text {
      font-size: 18px;
      border: 1px solid #ddd;
      background-color: #fff;
      padding: 10px 15px;
      font-family: ProximaNova-Regular;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
   }
    .menu-category-list .deskCateView {
      overflow: scroll;
      max-height: calc(100vh - 183px);
      border: 1px solid #ddd;
      border-top: none;
      background-color: #fff;
   }
    .menu-category-list .cls-cat-list {
      font-family: ProximaNova-Regular;
   }
    .menu-category-list .fa {
      display: inline-block;
      font: normal normal normal 14px/1 FontAwesome !important;
      font-size: inherit;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
   }
    @media only screen and (max-width: 990px) {
      .menu-category-list .cat-menu {
        margin-top: 0px;
     }
   }
    @media only screen and (max-width: 1469px) and (min-width: 990px) {
      .menu-category-list #cat-fix {
        min-width: 250px;
     }
   }
    .menu-category-list .subcategory {
      padding: 10px;
      border-radius: 5px;
      background: #efeeee;
      margin-top: 5px;
      box-shadow: 2px 2px 3px -2px grey;
   }
    .menu-category-list .deskViewMain {
      width: 250px;
   }
    `
  },
  productList: {
    html: `<div class="productLayoutOne" *ngIf="(layout_type == 1 || layout_type == 4) || (layout_type == 2 && !hasImages)">
  <div class="productLayoutOne_1">
          <p class="cls-p-cat-head hidden-xs hidden-sm" *ngIf="currentCategoryName && !searchProducts">{{currentCategoryName}}</p>
          <p class="cls-p-cat-head text-capitalize hidden-xs hidden-sm" *ngIf="(!currentCategoryName || searchProducts) && !noProduct">{{terminology.PRODUCTS}}</p>
          <div class="cls-p-cnt-div" style="position:relative" [style.display]="product.inventory_enabled && (product.available_quantity <= 0)? (cardInfo.show_outstocked_product?'flex':'none') : 'flex'"
            *ngFor="let product of productData;let i = index;">
            <div class="p-detail-veg-img" *ngIf="formSetting.enable_veg_non_veg_label == 1">
              <ng-container *ngIf="(product.is_veg == 1 || product.is_veg == 0); else elseTemplate">
                <img  [ngStyle]="{'cursor':product.multi_image_url?(product.multi_image_url.length > 0 ? 'pointer':'default'):'default'}"
                  [src]="product.is_veg == 1 ? 'assets/img/veg.jpg' : product.is_veg == 0 ? 'assets/img/non_veg.jpg':''"
                  alt="veg nonveg symbol">
              </ng-container>
              <ng-template #elseTemplate>
                <div style="width:15px"></div>
              </ng-template>
            </div>
            <div class="p-detail-main-img" *ngIf="product.layout_data && product.layout_data.images[0].size !== 4 && hasImages"><!-- (click)="showLightBox(product)"-->
              <img [ngStyle]="{'cursor':product.multi_image_url?(product.multi_image_url.length > 0 ? 'pointer':'default'):'default'}"
                [src]="product.thumb_url ? product.thumb_url : 'assets/img/image-placeholder.svg'"
                [alt]="product.name + ' image'">
            </div>
            <div class="p-detail-main-div">
              <div class="p-detail-sec">
                <div style="flex: 5 1 0%;word-break: break-all;" [tooltip]="(product.layout_data && product.layout_data.lines[0])?product.layout_data.lines[0].data:''">
                  <span>{{(product.layout_data && product.layout_data.lines[0]) ? product.layout_data.lines[0].data : ''}}</span>
                </div>
                <div *ngIf="isRestaurantActive && !(product.inventory_enabled && (product.available_quantity <= 0))" class="p-action-btn">
                <div *ngIf="product.maximum_quantity==1">
                <div [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden','height':(productBool[product.product_id]) ? 'auto' : '0px'}">
                  <button class="btn-sm addremovebtn" (click)="decreamentQuantity(product.product_id,i)">{{removeBtnTxt  || 'Remove'}}</button>
                </div>
                <div *ngIf="!productBool[product.product_id]">
                  <button class="btn-sm addremovebtn" (click)="checkBusinessTypeBeforeAdding(product,i)">{{addBtnTxt || 'Add'}}</button>
                </div>
              </div>
                  <div [ngStyle]="{'display':(product.layout_data && product.layout_data.buttons && product.layout_data.buttons[0].type != 1) ? 'flex':'none'}"  *ngIf="product.maximum_quantity!=1">
                    <div class="p-minus" (click)="decreamentQuantity(product.product_id,i)" [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden'}"
                    >
                      <svg width="10" height="7" viewBox="0 0 10 2">
                        <path fill="#858585" fill-rule="nonzero" d="M0 1.75h10V.25H0z" />
                      </svg>
                    </div>
                    <div [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden'}" class="p-quantity custom">
                      <span *ngIf="checkUniq(product)"></span>
                      <input appNumberOnly maxlength="4" [disabled]="!product?.isUniq" [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden'}" class="p-quantity inputBulkOrderClass"
                        [(ngModel)]="productQuantity[product.product_id]" aria-label="Product quantity" (blur)="onBlurInputFun(product,product.product_id,i,productQuantity[product.product_id])">
                    </div>
                    <div *ngIf="productBool[product.product_id] && !(product.customization ? product.customization.length != 0 : 0)"
                      class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                      (click)="increaseQuantity(product,product.product_id,i)">

                      <svg width="9" height="9" viewBox="0 0 10 10">
                        <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                      </svg>
                    </div>
                    <div *ngIf="productBool[product.product_id] && (product.customization ? product.customization.length != 0 : 0)"
                      class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                      (click)="checkBusinessTypeBeforeAdding(product,i)">

                      <svg width="9" height="9" viewBox="0 0 10 10">
                        <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                      </svg>
                    </div>
                    <div *ngIf="!productBool[product.product_id]" class="p-plus" (click)="checkBusinessTypeBeforeAdding(product,i)"
                      [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'">

                      <svg width="9" height="9" viewBox="0 0 10 10">
                        <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                      </svg>
                    </div>
                  </div>

                  <div [ngStyle]="{'display':(product.layout_data && product.layout_data.buttons && product.layout_data.buttons[0].type == 1) ? 'flex':'none'}" *ngIf="product.maximum_quantity!=1">
                    <div class="p-minus t-btn" style="height:28px !important;line-height: 23px;" (click)="decreamentQuantity(product.product_id,i)"
                      [ngStyle]="{'display':(productBool[product.product_id]) ? 'flex':'none'}">
                      {{removeBtnTxt}}
                    </div>
                    <div *ngIf="!productBool[product.product_id]" style="height:28px !important;" class="p-plus t-btn"
                      [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'" (click)="checkBusinessTypeBeforeAdding(product,i)">

                      {{addBtnTxt}}
                    </div>
                  </div>

                </div>
                <div *ngIf="product.inventory_enabled && (product.available_quantity <= 0)" [ngStyle]="{ 'direction' : direction }"
                  class="p-action-stock grid-stock">
                  <ng-container> {{terminology.OUT_OF_STOCK || 'Out of Stock'}} </ng-container>
                </div>
              </div>
              <div *ngIf="product.layout_data && product.layout_data.lines[1] && product.layout_data.lines[1].data" class="descriptionP" (click)="showLightBox(product)">
            <!--  <span class="pointer">{{product.layout_data.lines[1] ? product.layout_data.lines[1].data : ''}} </span>-->
              <span [innerHTML]="truncateString(product.layout_data.lines[1].data,260)"></span>
              </div>
              <div *ngIf="formSetting.show_service_time && product.service_time" class="descriptionP">
                <span class="pointer"> <ng-container i18n>Service Time</ng-container>: {{product.service_time_text}}</span>
              </div>
              <div *ngIf="formSetting.is_recurring_enabled && store.is_recurring_enabled  && product.is_recurring_enabled" class="descriptionP">
              <span class="subscription-avail">
                  <ng-container>{{terminology.SUBSCRIPTION_AVAILABLE || 'Subscription Available'}}</ng-container>
              </span>
              </div>
              <div class="price-box">
                <div class="mb-5 priceText discount-price" *ngIf="(formSetting.show_product_price == 1 || product.price > 0) && product.original_price">{{currency
                  + '' + decimalConfigPipe(product.original_price)}}</div>
                <div class="mb-5 priceText" *ngIf="product.layout_data && formSetting.show_product_price == 1 || product.price > 0">{{currency+'
                  '+product.layout_data.lines[2] ? product.layout_data.lines[2].data : ''}}</div>
              </div>
              <div *ngIf="product && product.discount" class="discount-percent">{{product.discount}}% <ng-container i18n>Discount</ng-container>
                <ng-container *ngIf="product.max_discount_amount">
                  <ng-container i18n>Upto</ng-container>
                  {{currency + product.max_discount_amount}}
                </ng-container>
              </div>
            </div>
          </div>
          <div *ngIf="paginating" class="pg-ldr-prt">
            <div class="pg-ldr-cld">
              <div class="pg-ldr-ctr">
                <div class="pg-loader" [ngStyle]="{'border-bottom-color': formSetting.color,'border-left-color': formSetting.color}"></div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="noProduct && productData && productData.length == 0 && !viewLoad" style="display:table;text-align:center;width:100%;margin: 13% 0px;"
          class="ptb0-lr30" [ngClass]="{'npf': !layoutBool || !loopData, 'npf_with_menu': layoutBool && loopData}">
          <div class="text-capitalize noProductLoad" *ngIf="!formSetting.is_custom_order_active">{{langJson['No Product Available.']}}</div>
          <div class="no-prod-text" *ngIf="formSetting.is_custom_order_active">
          <span class="font-18" i18n>Couldn’t find what you were looking for?</span>
        <span class="font-20"><ng-container i18n>Don’t worry we have got your back. Place a </ng-container><b>{{' '+terminology.CUSTOM_ORDER+' '}}</b><ng-container i18n> as per your requirement.</ng-container></span>
        <span class="custom-order-but" (click)="redirectToCustomOrder()" ><a class="tk-link"><ng-container i18n>Place </ng-container> {{' '+terminology.CUSTOM_ORDER}}</a></span>
        </div>
        </div>

      </div>
      <div class="home-fluid-thumbnail-grid-narrow productLayoutTwo" *ngIf="layout_type == 2 && hasImages">
        <div class="home-fluid-thumbnail-grid productLayoutTwo_2">
          <p class="cls-p-cat-head_2 hidden-xs hidden-sm" *ngIf="currentCategoryName && !searchProducts">{{currentCategoryName}}</p>
          <p class="cls-p-cat-head_2 text-capitalize hidden-xs hidden-sm" *ngIf="(!currentCategoryName || searchProducts) && !noProduct">{{terminology.PRODUCT}}</p>
          <div class="row-eq-height">
          <div class="home-fluid-thumbnail-grid-item row-col-eq" [style.display]="product.inventory_enabled && (product.available_quantity <= 0)? (cardInfo.show_outstocked_product?'block':'none') : 'block'"
            *ngFor="let product of productData;let i = index;">
            <div class="home_shadow">

              <a class=" fluid-thumbnail-grid-image-item-link">
                <div class="fluid-thumbnail-grid-image-image-container" style="border-radius: 5px;">


                  <img [ngStyle]="{'cursor':product.multi_image_url?(product.multi_image_url.length > 0 ? 'pointer':'default'):'default'}"
                    class="fluid-thumbnail-grid-image-image" [src]="product.thumb_list ?product.thumb_list['400x400'] : product.image_url ? product.image_url : 'assets/img/image-placeholder.svg'"
                    [alt]="product.name + ' image'">
                  <div [ngStyle]="{'cursor':product.multi_image_url?(product.multi_image_url.length > 0 ? 'pointer':'default'):'default'}"
                    class="fluid-thumbnail-grid-image-overlay"></div>
                  <div class="quickLook displayQuickLook" *ngIf="(product.multi_image_url && product.multi_image_url.length > 0)">
                    <app-quick-look-dynamic (showMultiImages)="showMultiImagesEvent($event.detail)" [productData]="product"></app-quick-look-dynamic>
                  </div>
                </div>
              </a>
              <div class="home-fluid-thumbnail-grid-author">
                <div class="p-detail-sec">
                  <div [tooltip]="product.layout_data.lines[0]?product.layout_data.lines[0].data:''" class="productWithPrice">
                      <span class="p-detail-veg-img" *ngIf="formSetting.enable_veg_non_veg_label == 1 && (product.is_veg == 1 || product.is_veg == 0)">

                        <img [ngStyle]="{'cursor':product.multi_image_url?(product.multi_image_url.length > 0 ? 'pointer':'default'):'default'}"
                            [src]="product.is_veg == 1 ? 'assets/img/veg.jpg' : product.is_veg == 0 ? 'assets/img/non_veg.jpg':''"
                            alt="veg nonveg symbol">
                        </span>
                    <span style="word-wrap: break-word;width: 100%;word-break: break-all;">{{product.layout_data.lines[0] ? product.layout_data.lines[0].data : ''}}</span>
                  </div>
                </div>
                <div class="mb-5 p-detail-sec pad-t-0" style="font-weight: bold">
                  <div>
                    <div class="discount-price" *ngIf="(formSetting.show_product_price == 1 || product.price > 0) && product.original_price">
                      {{currency + '' + decimalConfigPipe(product.original_price) }}
                    </div>
                    <div class="product-cl-data" *ngIf="formSetting.show_product_price == 1 || product.price > 0">
                      {{currency+''+product.layout_data.lines[2] ? product.layout_data.lines[2].data : ''}}
                    </div>
                  </div>
                  <div *ngIf="isRestaurantActive && !(product.inventory_enabled && (product.available_quantity <= 0))" class="p-action-btn">
                  <div *ngIf="product.maximum_quantity==1">
                  <div  [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden','height':(productBool[product.product_id]) ? 'auto' : '0px'}">
                    <button class="btn-sm addremovebtn" (click)="decreamentQuantity(product.product_id,i)">{{removeBtnTxt || 'Remove'}}</button>
                  </div>
                  <div *ngIf="!productBool[product.product_id]">
                    <button class="btn-sm addremovebtn" (click)="checkBusinessTypeBeforeAdding(product,i)">{{addBtnTxt || 'Add'}}</button>
                  </div>
                </div>
                    <div [ngStyle]="{'display':(product.layout_data && product.layout_data.buttons && product.layout_data.buttons[0].type != 1) ? 'flex':'none'}" *ngIf="product.maximum_quantity!=1">
                      <div class="p-minus" (click)="decreamentQuantity(product.product_id,i)" [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden'}">
                        <svg width="10" height="7" viewBox="0 0 10 2">
                          <path fill="#858585" fill-rule="nonzero" d="M0 1.75h10V.25H0z" />
                        </svg>
                      </div>
                      <div [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden'}" class="p-quantity">
                          <input appNumberOnly maxlength="4" [ngStyle]="{'visibility':(productBool[product.product_id]) ? 'visible':'hidden'}" class="p-quantity inputBulkOrderClass" [(ngModel)]="productQuantity[product.product_id]"
                          (blur)="onBlurInputFun(product,product.product_id,i,productQuantity[product.product_id])" aria-label="Product quantity">
                      </div>
                      <div *ngIf="productBool[product.product_id] && !(product.customization?product.customization.length:0)"
                        class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                        (click)="increaseQuantity(product,product.product_id,i)">

                        <svg width="9" height="9" viewBox="0 0 10 10">
                          <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                        </svg>
                      </div>
                      <div *ngIf="productBool[product.product_id] && product.customization?product.customization.length:0"
                        class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                        (click)="checkBusinessTypeBeforeAdding(product,i)">

                        <svg width="9" height="9" viewBox="0 0 10 10">
                          <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                        </svg>
                      </div>
                      <div *ngIf="!productBool[product.product_id]" class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                       (click)="checkBusinessTypeBeforeAdding(product,i)">

                        <svg width="9" height="9" viewBox="0 0 10 10">
                          <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                        </svg>
                      </div>
                    </div>

                    <div [ngStyle]="{'display':(product.layout_data && product.layout_data.buttons && product.layout_data.buttons[0].type == 1) ? 'flex':'none'}">
                      <div class="p-minus t-btn" style="height:28px !important;line-height: 23px;" (click)="decreamentQuantity(product.product_id,i)"
                        [ngStyle]="{'display':(productBool[product.product_id]) ? 'flex':'none'}">
                        {{removeBtnTxt}}
                      </div>
                      <div *ngIf="!productBool[product.product_id]" style="height:28px !important;" class="p-plus t-btn"
                        [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'" (click)="checkBusinessTypeBeforeAdding(product,i)">

                        {{addBtnTxt}}
                      </div>
                    </div>
                  </div>
                  <div *ngIf="product.inventory_enabled && (product.available_quantity <= 0)" class="p-action-stock"
                    [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>{{terminology.OUT_OF_STOCK || 'Out of Stock'}}</ng-container>
                  </div>
                </div>
                <div *ngIf="product && product.discount" class="discount-percent">{{product.discount}}% <ng-container i18n>Discount</ng-container>
                  <ng-container *ngIf="product.max_discount_amount">
                    <ng-container i18n>Upto</ng-container>
                    {{currency + product.max_discount_amount}}
                  </ng-container>
                </div>
                <div *ngIf="formSetting.show_service_time && product.service_time" class="decriptionB">
                    <span class=""> <ng-container i18n>Service Time</ng-container>:  {{product.service_time_text}}</span>
                </div>
                <div *ngIf="formSetting.is_recurring_enabled && store.is_recurring_enabled  && product.is_recurring_enabled" class="decriptionB">
                <span class="subscription-avail">
                  <ng-container>{{terminology.SUBSCRIPTION_AVAILABLE || 'Subscription Available'}}</ng-container>
                </span>
              </div>
                <div *ngIf="product.layout_data && product.layout_data.lines[1]" (click)="showLightBox(product)">
                  <!--<span matTooltip="Tooltip!">{{product.layout_data.lines[1] ? product.layout_data.lines[1].data : ''}}</span>-->
                  <span class="decriptionB pointer">
                  <!-- {{product.layout_data.lines[1].data + '.'}} -->
                  <span [innerHTML]="truncateString(product.layout_data.lines[1].data,60)"></span>
                    <span *ngIf="product.layout_data.lines[1].data && product.layout_data.lines[1].data.length > 60"
                          [tooltip]="product.layout_data.lines[1] ? product.layout_data.lines[1].data : ''" class="readMore">Read More</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div *ngIf="paginating" class="pg-ldr-prt">
          <div class="pg-ldr-cld">
            <div class="pg-ldr-ctr">
              <div class="pg-loader" [ngStyle]="{'border-bottom-color': formSetting.color,'border-left-color': formSetting.color}"></div>
            </div>
          </div>
        </div>
        <div *ngIf="noProduct && productData && productData.length == 0  && !viewLoad" style="display:table;text-align:center;width:100%;margin: 13% 0px;"
          class="ptb0-lr30" [ngClass]="{'npf': !layoutBool || !loopData, 'npf_with_menu': layoutBool && loopData}">
          <div class="text-capitalize noProductLoad" *ngIf="!formSetting.is_custom_order_active">{{langJson['No Product Available.']}}</div>
          <div class="no-prod-text" *ngIf="formSetting.is_custom_order_active">
          <span class="font-18" i18n>Couldn’t find what you were looking for?</span>
        <span class="font-20"><ng-container i18n>Don’t worry we have got your back. Place a </ng-container><b>{{' '+terminology.CUSTOM_ORDER+' '}}</b><ng-container i18n> as per your requirement.</ng-container></span>
        <span class="custom-order-but" (click)="redirectToCustomOrder()" ><a class="tk-link"><ng-container i18n>Place </ng-container> {{' '+terminology.CUSTOM_ORDER}}</a></span>
        </div>

        </div>
      </div>
      <div class="modal fade" id="myModal" role="dialog" *ngIf="currentProduct">
        <div class="modalFlex">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title header-modal text-capitalize">{{currentProduct?.name}}</h4>
                <div class="cls-cust-head">
                  <div class="cls-cust-n pl-25">
                    <!-- <p>{{currentProduct?.name}}</p> -->
                    <p *ngIf="formSetting.show_product_price == 1 || currentProduct.price > 0">{{currency+'
                      '+currentProduct.layout_data.lines[2] ? currentProduct.layout_data.lines[2].data : ''}}</p>
                  </div>
                  <div class="p-action-btn">
                    <div [ngStyle]="{'display':(currentProduct.type != 1) ? 'flex':'none'}">
                      <div class="p-minus btn-cursor" (click)="decreaseCustomizeProduct()">
                        <svg width="10" height="7" viewBox="0 0 10 2">
                          <path fill="#858585" fill-rule="nonzero" d="M0 1.75h10V.25H0z" />
                        </svg>
                      </div>

                      <div [ngStyle]="{'visibility':(currentProduct.product_id) ? 'visible':'hidden'}" class="p-quantity cust">
                          <input appNumberOnly maxlength="4" [ngStyle]="{'visibility':(currentProduct.product_id) ? 'visible':'hidden'}" class="p-quantity inputBulkOrderClass" aria-label="Product quantity"  [(ngModel)]="currentProduct.quantity">
                      </div>
                      <div class="p-plus btn-cursor" (click)="increaseCustomizeProduct()" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'">

                        <svg width="9" height="9" viewBox="0 0 10 10">
                          <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                        </svg>
                      </div>
                    </div>
                    <div [ngStyle]="{'display':(currentProduct.type == 1) ? 'flex':'none'}">
                      <div class="p-minus btn-cursor t-btn t-btn-26 " (click)="decreaseCustomizeProduct()">
                        {{removeBtnTxt}}
                      </div>
                    </div>
                  </div>
                </div>
                <div *ngIf="currentProduct.minimum_quantity>1 && (currentProduct.minimum_quantity > currentProduct.quantity)"
                  class="cls-cust-head min_sel_error pull-right">
                  <ng-container>Minimum Quantity</ng-container> {{currentProduct.minimum_quantity}}
                </div>
              </div>
              <div class="modal-body">
                <div class="cls-cust-body">
                  <div class="cls-cust-main-div" style="word-break: break-all;" *ngIf="currentProduct.long_description">
                    <div [innerHtml]="currentProduct.long_description" class="long_description cls-pcust-head"> </div>
                  </div>
                  <div class="cls-cust-main-div" *ngFor="let custom of currentProduct.customization;let custIndex = index;">
                    <p class="cls-pcust-head">{{truncateString(custom.name,100)}}
                      <span style="font-size:10px;text-transform: none" *ngIf="!custom.is_check_box">(Select any 1)</span>
                      <span style="font-size:10px;text-transform: none" *ngIf="custom.is_check_box">{{(custom.minimum_selection
                        >1) && custom.minimum_selection_required ? ' (Select any
                        '+custom.minimum_selection+')':'(Optional)'}}</span>

                    </p>

                    <div class="cls-cust-option" *ngFor="let option of custom.customize_options;let optionIndex = index;">
                      <div class="cls-cust-check" (click)="changeExtrasStatus(currentProduct.product_id,custom,custIndex,optionIndex,customizedObj[currentProduct.product_id].customization[custIndex].customize_options[optionIndex].is_default)">
                        <svg width="10" height="12" viewBox="0 0 10 7" *ngIf="customizedObj[currentProduct.product_id].customization[custIndex].customize_options[optionIndex].is_default">
                          <path [attr.fill]="appConfig.color" fill-rule="nonzero" d="M3.598 6.906a.808.808 0 0 1-.561-.223L.232 3.991a.74.74 0 0 1 0-1.076.817.817 0 0 1 1.122 0l2.244 2.153L8.646.223a.817.817 0 0 1 1.122 0 .74.74 0 0 1 0 1.077l-5.61 5.383a.808.808 0 0 1-.56.223z" />
                        </svg>
                      </div>
                      <div style="flex: 1 1 0%; margin-right: 10px;cursor:pointer" (click)="changeExtrasStatus(currentProduct.product_id,custom,custIndex,optionIndex,customizedObj[currentProduct.product_id].customization[custIndex].customize_options[optionIndex].is_default)">
                        <span>{{option.name}}</span>
                      </div>
                      <div class="txt-right" *ngIf="option.price > 0">
                        <span>{{currency+' '+ (decimalConfigPipe(option.price))}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="cls-cust-main-div" *ngIf="sessionService.get('config').side_order && sessionService.get('config').onboarding_business_type === 804">
                    <p class="cls-pcust-head side-heading" *ngIf="sideOrderProducts && sideOrderProducts.length>0" i18n>Side {{terminology.ORDERS}}</p>

                    <div class="side-products" *ngFor="let product of sideOrderProducts;let i = index;">
                        <div [ngClass]="{'side-order-parent-div' : i!=0}" *ngIf="i==0 || (product.parent_category_id!=sideOrderProducts[i-1].parent_category_id)"><p class="side-order-parent">{{product.parent_category_name}}</p></div>
                      <div class="side-product-name">
                        <div>{{product.name}}</div>
                        <div class="p-action-btn">

                          <div style="display: flex;">
                            <div class="p-minus" (click)="decreamentSideOrderQuantity(product.product_id,i)" [ngStyle]="{'visibility':(sideOrderProductBool[product.product_id]) ? 'visible':'hidden'}"
                            >
                              <svg width="10" height="7" viewBox="0 0 10 2">
                                <path fill="#858585" fill-rule="nonzero" d="M0 1.75h10V.25H0z" />
                              </svg>
                            </div>
                            <div [ngStyle]="{'visibility':(sideOrderProductBool[product.product_id]) ? 'visible':'hidden'}"
                              class="p-quantity custom">
                              <span *ngIf="checkUniq(product)"></span>
                              <input appNumberOnly maxlength="4" [disabled]="!product?.isUniq" [ngStyle]="{'visibility':(sideOrderProductBool[product.product_id]) ? 'visible':'hidden'}"
                                class="p-quantity inputBulkOrderClass" [value]="sideOrderProductData[product.product_id] ? sideOrderProductData[product.product_id].quantity : 0"
                                (blur)="onBlurSideOrderInputFun(product,product.product_id,i,$event.target.value)">
                            </div>
                            <div *ngIf="sideOrderProductBool[product.product_id]" class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                             (click)="increaseSideOrderQuantity(product,product.product_id,i)">

                              <svg width="9" height="9" viewBox="0 0 10 10">
                                <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                              </svg>
                            </div>
                            <div *ngIf="!sideOrderProductBool[product.product_id]" class="p-plus" [style.background-color]="formSetting.btn_color?formSetting.btn_color:'#1a9943'"
                             (click)="addSideOrder(product,i)">

                              <svg width="9" height="9" viewBox="0 0 10 10">
                                <path fill="#FFF" fill-rule="nonzero" d="M5.765 10V5.765H10v-1.53H5.765V0h-1.53v4.235H0v1.53H4.235V10z" />
                              </svg>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div class="side-product-detail">
                        <span class="desc" [ngClass]="{'side-order-desc' : product.description}">{{product.description ? '(' : ''}} {{product.description}} {{product.description ?
                          ')' : ''}}</span>
                        <span class="amount"> {{currency + '' + (decimalConfigPipe(product.price))}}</span>
                      </div>
                      <div class="min-check w-100 min_error">
                        <div *ngIf="sideOrderProductData[product.product_id] && sideOrderProductData[product.product_id].minimum_quantity>1 && (sideOrderProductData[product.product_id].minimum_quantity > sideOrderProductData[product.product_id].quantity)"
                          class="w-100 text-right">
                          <ng-container>Minimum Quantity</ng-container> {{product.minimum_quantity}}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button mat-button class="dialog-cancel btn appBtn" (click)="resetDialog()" i18n>Cancel</button>

                  <button mat-button class="dialog-ok btn appBtn" (click)="addCustomization(0)" *ngIf="addBtnTxt"
                   [disabled]="currentProduct.quantity <= 0">{{addBtnTxt}}
                    <ng-container i18n>for</ng-container> {{currency+'
                    '+(decimalConfigPipe((currentProduct.totalPrice*currentProduct.quantity) + sideOrderTotalAmount))}}</button>

                  <button mat-button class="dialog-ok btn appBtn primary-theme-btn" (click)="addCustomization(0)" *ngIf="!addBtnTxt"
                    [disabled]="currentProduct.quantity <= 0">
                    <ng-container i18n>Add for</ng-container> {{currency+' '+
                    (decimalConfigPipe((currentProduct.totalPrice*currentProduct.quantity) + sideOrderTotalAmount))}}
                  </button>

                  <div class="text-center min_sel_error">
                    <span>{{minSelectAddonError}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-modal-dynamic [modalType]="'modal-md'" *ngIf="openMultiImage" (esc)="hideMultiImageDialog()" (onClose)="hideMultiImageDialog()">
        <div body style="padding: 15px 30px">
          <div class="row">
            <div class="col-12 cancel-popup">
              <!--<label class="heading-popup" i18n>Images</label>-->
              <!--<div><i class="fa fa-close icons" (click)="hideMultiImageDialog()"></i></div>-->
              <div><img src="assets/images/cancel.svg" style="height: 15px;cursor:pointer;" (click)="hideMultiImageDialog()" /></div>
            </div>
            <div class="col-12 carousel slide" id="lightbox">
              <ol class="carousel-indicators" *ngIf="caraouselImages.length > 1">
                <li *ngFor="let image of caraouselImages;let i = index;" data-target="#lightbox" [attr.data-slide-to]="i" [ngClass]="{'active' : i==0}"></li>
              </ol>
              <div class="carousel-inner">
                <div *ngFor="let image of caraouselImages;let i = index;" style="height:366px;" class="item" [ngClass]="{'active' : i==0}">
                  <img style="height: 100%; width: 100%; object-fit: contain; margin: 0 auto;" [src]="image"
                       [alt]="'caraousel slide ' + i">
                </div>
              </div>
              <!-- /.carousel-inner -->
              <a *ngIf="caraouselImages.length > 1" class="left carousel-control" href="#lightbox" role="button" data-slide="prev">
                <span style="font-family:'Glyphicons Halflings'!important;" class="glyphicon glyphicon-chevron-left"></span>
              </a>
              <a *ngIf="caraouselImages.length > 1" class="right carousel-control" href="#lightbox" role="button" data-slide="next">
                <span style="font-family:'Glyphicons Halflings'!important;" class="glyphicon glyphicon-chevron-right"></span>
              </a>
            </div>
            <div class="col-12">
              <div class="cls-cust-main-div" style="word-break: break-all;" *ngIf="productLongDescription">
                <h4 class="text-center" i18n>Description</h4>
                <div [innerHtml]="productLongDescription" class="long_description cls-pcust-head" style="max-height: 200px;overflow-y: auto">
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-modal-dynamic>

      <div class="modal fade and carousel slide" id="timeSelection">
        <div class="modal-dialog">
          <div class="modal-content">
            <app-product-timing-dynamic [product]="productSelectedToAdd" [productIndex]="indexGot" (sendDataForProduct)="getSelectedTiming($event.detail)"></app-product-timing-dynamic>
          </div>
        </div>
      </div>
      {{currentProductForTemplate | json}}
      <app-product-template (closePopup1)="closePopup()" [productData]="currentProductForTemplate" *ngIf="showProductTemplate && currentProductForTemplate"></app-product-template>
      `,
    css: `
    .addremovebtn
   {
     font-size: 16px;
     font-family:$proxima-reg;
     font-weight: 200;
      background-color: $color-theme;
      color:#ffffff;
     }
    .no-prod-text {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .no-prod-text .font-20 {
      font-size: 20px;
      padding: 17px;
    }
    .no-prod-text .font-18 {
      font-size: 18px;
    }
    .no-prod-text .custom-order-but {
      margin-top: 15px;
      padding: 10px;
      border: 1px solid var(--theme);
      background-color: var(--theme);
      color: #fff !important;
      border-radius: 5px;
    }
    .no-prod-text .custom-order-but a {
      font-size: 16px;
      color: #fff;
    }
    .no-prod-text .custom-order-but:hover {
      background-color: #fff;
      border: 1px solid var(--theme);
    }
    .no-prod-text .custom-order-but:hover a {
      color: var(--theme);
    }
    @media screen and (max-width: 768px) {
      .no-prod-text {
        padding: 0px 12px;
      }
      .no-prod-text .font-20 {
        font-size: 16px;
      }
      .no-prod-text .font-18 {
        font-size: 15px;
      }
      .no-prod-text .custom-order-but {
        padding: 9px;
      }
      .no-prod-text .custom-order-but a {
        font-size: 14px;
      }
    }

    #lightbox {
      justify-content: center;
      align-items: center;
    }
    .outOfStock {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1;
      font-size: larger;
      color: white;
      font-weight: 900;
    }
    .catloop {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .cls-p-cat-head {
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
      text-align: left;
      padding: 10px;
      border: 1px solid #ddd;
      margin-bottom: 0px;
    }
    .cls-p-cat-head_2 {
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
      text-align: left;
      padding: 0px 0px 10px 0px;
      margin-bottom: 5px;
    }
    .cls-p-cat-head_2.laundry {
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
      text-align: left;
      margin-bottom: 20px;
      padding: 0px;
    }
    .cls-p-cnt-div {
      display: flex;
      flex-direction: row;
      padding: 10px;
      border: 1px solid #ddd;
      border-top-width: 0px;
    }
    .p-sub-cat-head {
      background-color: #f5f5f5;
      padding: 6px 10px 5px;
    }
    .p-sub-cat-head span {
      opacity: 0.5;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.36;
      letter-spacing: 0.2px;
      text-align: left;
      color: #333;
    }
    .p-detail-main-img {
      padding: 10px 8px 10px 0px;
    }
    .p-detail-main-img img {
      height: 73px;
      width: 73px;
      object-fit: cover;
    }
    .p-detail-veg-img {
      padding: 15px 8px 10px 0px;
    }
    .p-detail-veg-img img {
      height: 15px;
      width: 15px;
    }
    .p-detail-main-div {
      padding: 10px 0;
      user-select: none;
      width: 100%;
    }
    .p-detail-sec {
      display: flex;
      margin-bottom: 5px;
      padding-top: 5px;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
      align-items: center;
    }
    .discount-percent {
      font-size: 12px;
      font-weight: 900;
    }
    .price-box {
      display: flex;
      align-items: center;
    }
    .decriptionB {
      height: auto;
      display: block;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      line-height: 20px;
      -webkit-box-orient: vertical;
      font-family: ProximaNova-Regular;
      color: #333;
    }
    .p-action-btn {
      flex: 1 1 0;
      display: flex;
      justify-content: flex-end;
      zoom: 0.88;
    }
    .p-action-btn div.p-minus {
      margin-right: 2px;
      width: 23.4px;
      height: 23.4px;
      border-radius: 3.6px;
      background-color: #fff;
      border: solid 0.9px #ddd;
      text-align: center;
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
      line-height: 21px;
    }
    .p-action-btn div.p-minus div {
      width: 9px;
      height: 1.8px;
      background-color: #858585;
    }
    .p-action-btn div.p-plus {
      margin-left: 8px;
      width: 23.4px;
      height: 23.4px;
      border-radius: 3.6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 20px;
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
    }
    .p-action-btn div.p-quantity {
      text-align: center;
      padding-top: 0px;
      width: 30px;
      font-family: ProximaNova-Regular;
      font-weight: normal !important;
    }
    .p-action-btn div.p-quantity.cust {
      width: 32px;
    }
    .p-action-btn div.p-quantity.cust > .inputBulkOrderClass {
      width: 38px;
    }
    .p-action-btn div.p-quantity.custom > .inputBulkOrderClass:disabled {
      border: 0px;
    }
    .grid-stock.p-action-stock {
      color: red;
      display: block !important;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
    }
    .p-action-stock {
      -webkit-box-flex: 1;
      -ms-flex: 1 1 0px;
      flex: 4 1 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      justify-content: flex-end;
      color: red;
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
    }
    .priceText {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #333;
    }
    .descriptionP {
      font-family: ProximaNova-Regular;
      font-size: 12px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.2px;
      text-align: left;
      color: #858585;
      margin-bottom: 10px;
    }
    .descriptionB {
      height: auto;
      display: block;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      line-height: 20px;
      -webkit-line-clamp: 0;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: ProximaNova-Regular;
      color: #858585;
    }
    .noProductLoad {
      display: table-cell;
      font-family: ProximaNova-Regular;
      vertical-align: middle;
      text-align: center;
      margin: auto;
      align-self: center;
      font-size: 20px;
      font-weight: 800;
    }
    .mb-5 {
      margin-bottom: 5px;
    }
    .discount-price {
      margin-right: 8px;
      color: red;
      text-decoration: line-through;
      text-decoration-color: red;
    }
    /*** dialog css***/
    .txt-right {
      text-align: right;
    }
    div.cust-action {
      padding: 20px 25px 0;
      display: flex;
      justify-content: flex-end;
    }
    div.cust-action div {
      font-size: 14px;
      background-color: transparent;
      color: #fff;
      border: 1px solid;
      padding: 7px 20px;
    }
    .dialog-cancel {
      border: solid 1px #b2b2b2 !important;
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      color: #b2b2b2;
      margin-right: 20px;
    }
    .dialog-cancel:hover {
      background-color: #fff;
    }
    .dialog-cancel div:hover {
      transform: scale(1);
    }
    .cls-cust-check {
      border: 1px solid #ddd;
      padding-left: 3px;
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
    }
    .cls-pcust-head {
      opacity: 0.6;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #333;
      text-transform: capitalize;
    }
    .cls-cust-body {
      border-bottom: 1px solid #ddd;
      max-height: 300px;
      overflow-y: auto;
    }
    .cls-cust-main-div {
      margin: 17px 25px 0 33px;
      border-bottom: 1px solid #ddd;
    }
    .cls-cust-main-div:last-child {
      border-bottom: none;
    }
    .cls-cust-back {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 1;
    }
    .cls-cust-cntn {
      position: absolute;
      width: auto;
      top: 100px;
      left: 50%;
      transform: translate(-50%);
      border-radius: 5.3px;
      background-color: #fff;
      box-shadow: 0 5px 32px 0 rgba(0, 0, 0, 0.15);
      border: solid 1.1px #edeeef;
      padding: 20px 10px;
      margin-bottom: 20px;
    }
    .cls-cust-head {
      display: flex;
      padding-top: 5px;
    }
    .cls-cust-head-txt {
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      color: #333;
      padding-left: 25px;
    }
    .cls-cust-n {
      flex: 3 1 0%;
      margin-right: 20px;
    }
    .cls-cust-n > p:first-child {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      line-height: 1.36;
      letter-spacing: 0.2px;
      color: #333;
      margin: 0;
    }
    .cls-cust-n > p:last-child {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      letter-spacing: 0.2px;
      color: #858585;
      margin: 0;
    }
    .productWithoutPrice {
      width: 60%;
      flex: 2 1 0%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .productWithPrice {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pl-25 {
      padding-left: 15px;
    }
    .cls-cust-option {
      display: flex;
      margin-bottom: 15px;
      font-family: ProximaNova-Regular;
      font-size: 14px;
    }
    .header-modal {
      padding-left: 15px;
      font-weight: bold;
    }
    .modal-content {
      padding: 10px;
    }
    .modal-body {
      padding: 0;
    }
    .home_shadow {
      border: 1px solid #ddd;
      border-radius: 5px;
      position: relative;
      height: 100%;
      background: white;
    }
    @media only screen and (max-width: 600px) {
    }
    @media only screen and (max-width: 1400px) and (min-width: 1230px) {
      .home-fluid-thumbnail-grid-author {
        height: 135px !important;
      }
    }
    @media only screen and (max-width: 1229px) and (min-width: 1200px) {
      .home-fluid-thumbnail-grid-author {
        height: 155px !important;
      }
    }
    .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid {
      overflow: hidden;
      *zoom: 1;
      margin-right: -0.75em;
    }
    @media (min-width: 48em) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid {
        margin-right: -1.5em;
      }
    }
    .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
      float: left;
      padding-right: 0.75em;
      margin-bottom: 0.75em;
    }
    @media (max-width: 318px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 320px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 480px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 600px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 768px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 33.33%;
      }
    }
    @media (min-width: 860px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 960px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 1200px) and (max-width: 1399px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 1400px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        width: 33.33%;
      }
    }
    @media (min-width: 768px) {
      .home-fluid-thumbnail-grid-narrow .home-fluid-thumbnail-grid-item {
        padding-right: 1.5em;
        margin-bottom: 1.5em;
        padding-left: 2px;
      }
    }
    .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid {
      overflow: hidden;
      *zoom: 1;
      margin-right: -0.75em;
    }
    @media (min-width: 48em) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid {
        margin-right: -1.5em;
      }
    }
    .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
      float: left;
      padding-right: 0.75em;
      margin-bottom: 0.75em;
    }
    @media (max-width: 318px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 320px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 480px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 600px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 768px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 33.33%;
      }
    }
    @media (min-width: 860px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 960px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 50%;
      }
    }
    @media (min-width: 1200px) and (max-width: 1399px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 33.33%;
      }
    }
    @media (min-width: 1400px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        width: 33.33%;
      }
    }
    @media (min-width: 768px) {
      .home-fluid-thumbnail-grid-wide .home-fluid-thumbnail-grid-item {
        padding-right: 1.5em;
        margin-bottom: 1.5em;
        padding-left: 2px;
      }
    }
    .pad-t-0 {
      padding-top: 0;
    }
    .home-fluid-thumbnail-grid-author {
      -moz-border-radius-bottomleft: 5px;
      -webkit-border-bottom-left-radius: 5px;
      border-bottom-left-radius: 5px;
      -moz-border-radius-bottomright: 5px;
      -webkit-border-bottom-right-radius: 5px;
      border-bottom-right-radius: 5px;
      background-color: white;
      position: relative;
      padding: 10px;
      padding-top: 5px;
      overflow: inherit;
    }
    .home-fluid-thumbnail-grid-author.laundry {
      -moz-border-radius-bottomleft: 5px;
      -webkit-border-bottom-left-radius: 5px;
      border-bottom-left-radius: 5px;
      -moz-border-radius-bottomright: 5px;
      -webkit-border-bottom-right-radius: 5px;
      border-bottom-right-radius: 5px;
      background-color: white;
      height: 160px;
      position: relative;
      padding: 10px;
      padding-top: 5px;
      overflow: inherit;
      cursor: pointer;
    }
    .home-fluid-thumbnail-grid-author-avatar {
      padding: 6px;
    }
    .home-fluid-thumbnail-grid-author-avatar-image {
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      border-radius: 5px;
      height: 36px;
    }
    .home-fluid-thumbnail-grid-author-name {
      font-size: 0.8125em;
      line-height: 1.38462em;
      position: absolute;
      top: 6px;
      left: 51px;
      right: 6px;
      bottom: 6px;
      line-height: 36px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .home-fluid-thumbnail-grid-details {
      position: absolute;
      top: 6px;
      left: 51px;
      right: 6px;
      bottom: 6px;
    }
    .home-fluid-thumbnail-grid-details-author-name {
      display: inline-block;
      float: left;
      width: 50%;
      height: 100%;
      font-size: 0.8125em;
      line-height: 1.38462em;
      line-height: 36px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .home-fluid-thumbnail-grid-details-distance {
      float: left;
      width: 50%;
      height: 100%;
      text-align: right;
      color: #3c3c3c;
      font-weight: 600;
      font-size: 0.8125em;
      line-height: 1.38462em;
      line-height: 36px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .home-toolbar {
      *zoom: 1;
      margin-bottom: 0.75em;
      border-bottom: 1px solid #c3c3c3;
    }
    .home-toolbar:after {
      content: "";
      display: table;
      clear: both;
    }
    @media (min-width: 48em) {
      .home-toolbar {
        margin-bottom: 1.5em;
      }
    }
    .home-grid {
      position: relative;
    }
    .fluid-thumbnail-grid-image-image-container {
      position: relative;
      color: white;
      width: 100%;
      padding-bottom: 70%;
    }
    .fluid-thumbnail-grid-image-image-container:hover .displayQuickLook {
      display: block;
    }
    .fluid-thumbnail-grid-image-image-container:hover {
      color: #e8e8e8;
    }
    .cancel-popup {
      flex-wrap: nowrap;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
    .quickLook {
      position: absolute;
      bottom: 20px;
      text-align: center;
      width: 100%;
    }
    .displayQuickLook {
      display: none;
    }
    .fluid-thumbnail-grid-image-title {
      position: absolute;
      bottom: 0;
      padding: 0.75em;
      line-height: 1.2em;
    }
    .fluid-thumbnail-grid-image-overlay {
      -moz-border-radius-topleft: 5px;
      -webkit-border-top-left-radius: 5px;
      border-top-left-radius: 5px;
      -moz-border-radius-topright: 5px;
      -webkit-border-top-right-radius: 5px;
      border-top-right-radius: 5px;
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC42Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4g");
      background-size: 100%;
      background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, transparent), color-stop(100%, rgba(0, 0, 0, 0.6)));
      background-image: -moz-linear-gradient(transparent, transparent);
      background-image: -webkit-linear-gradient(transparent, transparent);
      background-image: linear-gradient(transparent, transparent);
      filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#00000000', endColorstr='#99000000');
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .fluid-thumbnail-grid-image-image {
      -moz-border-radius-topleft: 5px;
      -webkit-border-top-left-radius: 5px;
      border-top-left-radius: 5px;
      -moz-border-radius-topright: 5px;
      -webkit-border-top-right-radius: 5px;
      border-top-right-radius: 5px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .fluid-thumbnail-grid-image-price-container {
      color: #3c3c3c;
      font-weight: 600;
      min-width: 3.125em;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.3em 0.75em;
      background-color: white;
      background-color: rgba(255, 255, 255, 0.95);
      -moz-border-radius-bottomleft: 0.375em;
      -webkit-border-bottom-left-radius: 0.375em;
      border-bottom-left-radius: 0.375em;
      font-size: 12px;
      max-width: 75%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .fluid-thumbnail-grid-image-price {
      font-size: 18px;
    }
    .fluid-thumbnail-grid-image-type {
      font-size: 16px;
    }
    .pg-ldr-prt {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 100000;
      text-align: center;
    }
    .pg-ldr-cld {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pg-ldr-ctr {
      background-color: #f5f5f5;
      margin: 0 auto;
      border-radius: 10px;
    }
    .pg-ldr-ctr {
      /* width: 80px; */
      /* height: 80px; */
      padding: 8px;
    }
    .pg-loader {
      width: 35px;
      height: 35px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, 0.03);
      border-right: 5px solid rgba(0, 0, 0, 0.03);
      border-bottom: 5px solid transparent;
      border-left: 5px solid transparent;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
    }
    .pg-loader, .pg-loader:after {
      border-radius: 50%;
    }
    @-webkit-keyframes pg-loader {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }
    .pg-loader {
      -webkit-animation: gl-loader 0.5s linear infinite;
    }
    .pg-loader {
      display: block !important;
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      width: 35px;
      height: 35px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, .03);
      border-right: 5px solid rgba(0, 0, 0, .03);
      border-bottom: 5px solid #c4253a;
      border-left: 5px solid #c4253a;
      transform: translateZ(0);
    }
    /* Safari */
    @-webkit-keyframes spin {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .modal.and.carousel {
      position: fixed;
    }
    div.p-plus.t-btn, div.p-minus.t-btn {
      font-size: 14px !important;
      padding: 2px 10px;
      width: auto !important;
      height: auto !important;
    }
    div.p-minus.t-btn.t-btn-26 {
      height: 28px !important;
      line-height: 23px;
      white-space: nowrap;
    }
    .productLayoutOne {
      margin-top: 20px;
      margin-bottom: 0px;
    }
    .productLayoutOne .productLayoutOne_1 {
      background-color: #fff;
      margin: 0 30px;
    }
    .productLayoutTwo {
      margin-top: 20px;
      margin-bottom: 0px;
      margin-left: 15px;
    }
    .productLayoutTwo .productLayoutTwo_2 {
      background-color: transparent;
      margin: 0 30px;
    }
    @media only screen and (max-width: 990px) {
      .productLayoutOne {
        margin-top: 10px;
        margin-bottom: 60px;
      }
      .productLayoutOne .productLayoutOne_1 {
        background-color: #fff;
        margin: 0 15px !important;
      }
      .productLayoutTwo {
        margin-top: 10px;
        margin-bottom: 50px;
      }
      .productLayoutTwo .productLayoutTwo_2 {
        background-color: transparent;
        margin: 0 !important;
      }
    }
    /deep/ .tooltip {
      word-break: break-all !important;
    }
    .product-cl-data {
      flex: 2 1 0%;
      width: 60%;
    }
    .min_sel_error {
      color: red;
      margin-top: 10px;
      height: 7px;
    }
    .long_description {
      margin-top: 12px;
      width: 100%;
      margin-bottom: 12px;
      cursor: default;
    }
    .long_description::-webkit-scrollbar {
      width: 0 !important;
    }
    .long_description::-webkit-scrollbar-thumb {
      width: 0 !important;
    }
    .pointer {
      cursor: pointer;
    }
    .side-products {
      width: 100%;
      margin-bottom: 15px;
    }
    .side-product-name {
      display: flex;
      justify-content: space-between;
    }
    .side-product-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 3px;
      color: black;
    }
    .side-product-detail .desc {
      opacity: 0.6;
      color: #333;
    }
    .side-product-detail .amount {
      opacity: 1;
    }
    .w-100 {
      width: 100%;
    }
    .min_error {
      color: red;
      margin-top: 3px;
      margin-bottom: 10px;
    }
    .side-heading {
      font-size: 16px;
    }
    .row-eq-height {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .row-eq-height .row-col-eq {
      margin-bottom: 20px;
    }
    .readMore {
      color: var(--theme);
      font-size: 14px;
      font-family: 'ProximaNova-Regular';
      cursor: default;
    }
    @media (max-width: 320px) {
      .p-detail-sec {
        flex-wrap: wrap;
      }
    }
    @media only screen and (max-width: 376px) {
      .modal-footer {
        display: flex;
      }
    }
    .side-order-parent {
      opacity: 0.6;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #333;
      text-transform: capitalize;
    }
    .side-order-parent-div {
      border-top: 1px solid #ddd;
      padding-top: 17px;
    }
    .side-order-desc {
      font-size: 12px;
      margin: 0;
      padding-bottom: 5px;
    }
    .modal {
      overflow-y: auto;
    }


    `
  },
  nlevelCategoryList: {
    html: `
    <div class="n-level-catategory-list">
    <div class="row-eq-height">
        <div class="row-col-eq" *ngFor="let category of categoryData">
            <div class="grid-item" (click)="selectCategory(category)">
                <div class="image_div">
                    <img [src]="category.image_url || 'assets/img/image-placeholder.svg'" class="image-cat"
                        [alt]="category.name">
                </div>
                <div class="name_div">
                    <span>{{category.name}}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
  `,
    css: `
    .n-level-catategory-list .row-eq-height {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      padding: 0 2rem 0 0;
      margin-top: 1rem;
   }
    .n-level-catategory-list .row-eq-height .row-col-eq {
      min-width: 25%;
      max-width: 25%;
      margin-bottom: 15px;
   }
    .n-level-catategory-list .grid-item {
      margin: 1rem;
   }
    .n-level-catategory-list .image-cat {
      width: 100%;
      height: 9vw;
      min-height: 9vw;
      min-width: 100%;
      background-color: #eaeaea;
      object-fit: cover;
      cursor: pointer;
      transition: transform 800ms ease-out;
   }
    .n-level-catategory-list .image-cat:hover {
      transform: scale(1.12);
   }
    .n-level-catategory-list .image_div {
      margin: 0.5rem;
      overflow: hidden;
      margin-bottom: 0px;
      border: 0px solid #eaeaeb;
   }
    .n-level-catategory-list .name_div {
      margin: 0.5rem;
      margin-top: 0px;
      text-align: center;
      font-size: 14px;
      text-overflow: ellipsis;
      padding: 1rem 0;
      border: 2px solid #eaeaeb;
      color: #474747;
      white-space: nowrap;
      overflow: hidden;
   }
    @media only screen and (max-width: 425px) {
      .n-level-catategory-list .row-col-eq {
        min-width: 50% !important;
        max-width: 50% !important;
     }
      .n-level-catategory-list .image-cat {
        height: 22vw !important;
     }
      .n-level-catategory-list .row-eq-height {
        padding: 1rem !important;
     }
      .n-level-catategory-list .grid-item {
        margin: 0.5rem !important;
     }
   }
    @media only screen and (min-width: 425px) and (max-width: 767px) {
      .n-level-catategory-list .row-col-eq {
        min-width: 50% !important;
        max-width: 50% !important;
     }
      .n-level-catategory-list .image-cat {
        height: 25vw !important;
     }
   }
    @media only screen and (min-width: 768px) and (max-width: 1024px) {
      .n-level-catategory-list .row-col-eq {
        min-width: 33% !important;
        max-width: 33% !important;
     }
      .n-level-catategory-list .image-cat {
        height: 15vw !important;
     }
   }
    .n-level-catategory-list .n-level-category-shimmer-container .row-eq-height {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      padding: 0 2rem 0 0;
      margin-top: 1rem;
   }
    .n-level-catategory-list .n-level-category-shimmer-container .row-eq-height .row-col-eq {
      min-width: 25%;
      max-width: 25%;
      margin-bottom: 15px;
   }
    .n-level-catategory-list .n-level-category-shimmer-container .grid-item {
      margin: 1rem;
   }
    .n-level-catategory-list .n-level-category-shimmer-container .image-cat {
      width: 100%;
      height: 9vw;
      min-height: 9vw;
      min-width: 100%;
      background-color: #eaeaea;
      object-fit: cover;
      cursor: pointer;
      transition: transform 800ms ease-out;
   }
    .n-level-catategory-list .n-level-category-shimmer-container .image-cat:hover {
      transform: scale(1.12);
   }
    .n-level-catategory-list .n-level-category-shimmer-container .image_div {
      margin: 0.5rem;
      overflow: hidden;
      margin-bottom: 0px;
      border: 0px solid #eaeaeb;
   }
    .n-level-catategory-list .n-level-category-shimmer-container .name_div {
      margin: 0.5rem;
      margin-top: 0px;
      text-align: center;
      font-size: 14px;
      text-overflow: ellipsis;
      padding: 1rem 0;
      border: 2px solid #eaeaeb;
      color: #474747;
      white-space: nowrap;
      overflow: hidden;
   }
    @media only screen and (max-width: 425px) {
      .n-level-catategory-list .n-level-category-shimmer-container .row-col-eq {
        min-width: 50% !important;
        max-width: 50% !important;
     }
      .n-level-catategory-list .n-level-category-shimmer-container .image-cat {
        height: 22vw !important;
     }
      .n-level-catategory-list .n-level-category-shimmer-container .row-eq-height {
        padding: 1rem !important;
     }
      .n-level-catategory-list .n-level-category-shimmer-container .grid-item {
        margin: 0.5rem !important;
     }
   }
    @media only screen and (min-width: 425px) and (max-width: 767px) {
      .n-level-catategory-list .n-level-category-shimmer-container .row-col-eq {
        min-width: 50% !important;
        max-width: 50% !important;
     }
      .n-level-catategory-list .n-level-category-shimmer-container .image-cat {
        height: 25vw !important;
     }
   }
    @media only screen and (min-width: 768px) and (max-width: 1024px) {
      .n-level-catategory-list .n-level-category-shimmer-container .row-col-eq {
        min-width: 33% !important;
        max-width: 33% !important;
     }
      .n-level-catategory-list .n-level-category-shimmer-container .image-cat {
        height: 15vw !important;
     }
   }

    `
  },
  orders: {
    html: `
    <app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="headerData"></app-header-dynamic>

<div id="order-listing">
  <div class="main-c row">
    <div class="col-xs-12">
      <div class="heading">
        <p class="title text-capitalize">{{terminology.ORDERS}}</p>
        <hr class="line" [style.border-top-color]="appConfig.color" />
      </div>
    </div>
    <div class="containerOrder center-c d">
      <div class="row-eq-height">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 row-col-eq" *ngFor="let order of ordersData">
          <div class="cards"
            [ngClass]="{'servicesHeight': order.business_type == 2, 'productHeight':order.business_type == 1}">

            <div class="orderIDDiv">
              <div class="orderIdOnly">
                <span class="idText text-capitalize">{{langJson['Order Id']}}</span>
                <span class="idNumber">{{order.job_id}}</span>
              </div>
              <div class="orderStatusOnly">
                <span class="statusText text-capitalize" [hidden]="!order.show_status"
                  *ngIf="order.pd_or_appointment != taskTypeEnum.APPOINTMENT && order.job_status != -1">
                  <span
                    [style.color]="tookanStatusColor[order.job_status] ? tookanStatusColor[order.job_status] : '#000000'">{{showTookanStatus(order.job_status)}}</span>
                </span>
                <span class="statusText text-capitalize" [hidden]="!order.show_status"
                  *ngIf="order.business_type == 1 && order.pd_or_appointment != 1 && order.job_status != -1">
                  <span
                    [style.color]="tookanStatusColor[order.job_status] ? tookanStatusColor[order.job_status] : '#000000'">{{showTookanStatus(order.job_status)}}</span>
                </span>
              </div>
              <div class="clearfix"></div>
            </div>

            <div class="otherDetailsDiv" (click)="openNav(order)" style="min-height:140px;">
              <div class="orderAmount">
                <div class="row">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="orderAmountText text-capitalize"
                      *ngIf="appConfig.show_product_price == 1 || order.total_amount > 0">
                      {{langJson['Order Amount']}}</span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span class="orderAmountNumber" *ngIf="appConfig.show_product_price == 1 || order.total_amount > 0">{{currency
                      +''}}
                      {{decimalConfigPipe(order.total_amount)}}</span>
                  </div>
                  <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12"
                    *ngIf="appConfig.show_product_price == 1 || order.total_amount > 0">
                    <hr style="border-color: #dddddd;margin-top: 5px;" />
                  </div>
                </div>
              </div>

              <div class="orderDateTime orderAmount">
                <div class="row"
                  *ngIf="!order.enable_start_time_end_time && order.business_type == 1 && order.task_type === 0">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">{{langJson['Order Time']}}</span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span
                      class="orderAmountNumber">{{order.creation_datetime}}</span>
                  </div>
                </div>
                <div class="row"
                  *ngIf="!order.enable_start_time_end_time && order.business_type == 1 && order.task_type === 0 && !order.is_custom_order else adjustScheduledTime;">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">{{langJson['Scheduled Time']}}</span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span
                      class="orderAmountNumber">{{order.job_delivery_datetime}}</span>
                  </div>
                </div>


                <ng-template #adjustScheduledTime>
                  <div style="height: 20px;"></div>
                </ng-template>
                <div class="row" *ngIf="order.task_type === 1">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">
                      <ng-container i18n>{{terminology.PICKUP}} Time</ng-container>
                    </span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span
                      class="orderAmountNumber">{{order.job_pickup_datetime}}</span>
                  </div>
                </div>
                <div class="row" *ngIf="order.task_type === 2">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">
                      <ng-container i18n>{{terminology.DELIVERY}} Time</ng-container>
                    </span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span
                      class="orderAmountNumber">{{order.job_delivery_datetime}}</span>
                  </div>
                </div>

                <div class="row" *ngIf="!order.enable_start_time_end_time && order.business_type == 2">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">
                      <ng-container i18n>Created At</ng-container>
                    </span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span class="orderAmountNumber">{{order.created_at}}</span>

                  </div>
                </div>
                <div class="row" *ngIf="order.enable_start_time_end_time">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">{{terminology.START_TIME}}</span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span
                      class="orderAmountNumber">{{order.job_pickup_datetime}}</span>
                  </div>
                </div>
                <div class="row" *ngIf="order.enable_start_time_end_time">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <span class="text-capitalize orderAmountText">{{terminology.END_TIME}}</span>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <span
                      class="orderAmountNumber">{{order.job_delivery_datetime}}</span>
                  </div>
                </div>
              </div>
              <div class="cancelPolicy"
                *ngIf="appConfig.is_cancellation_policy_enabled && (order.cancel_allowed || order.cancelAllowed)"
                (click)="viewPolicyDetails(order.job_id,$event); $event.stopPropagation();">
                <a onlyColor="true" class="tk-link">*<ng-container i18n>Cancellation Policy</ng-container></a>
              </div>
            </div>

            <div class="ratingReviewAndTrack">
              <div class="ratingDiv">
                <div class="row">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p style="cursor: text;"
                      *ngIf="order.job_status == 13 && order.customer_rating && appConfig.is_review_rating_enabled">
                      <ng-container i18n>Rating</ng-container>
                      :
                      <span class="ratingDivOrder" aria-hidden="false"
                        [ngClass]="{'green-bold': getColourGreen(order.customer_rating), 'red-bold': getColourRed(order.customer_rating), 'yellow-bold': getColourYellow(order.customer_rating)}">
                        <i class="fa fa-star" aria-hidden="true"></i>
                        <span class="ratingCountOrder ng-binding"
                          style="padding:0 2px">{{order.customer_rating?order.customer_rating.toFixed(1):0}}</span>
                      </span>
                    </p>
                    <p (click)="showRatingDialog(order)" style="cursor:pointer" *ngIf="order.job_status == 13 && !order.customer_rating && appConfig.is_review_rating_enabled &&
                    (appConfig.onboarding_business_type !== 805 || order.task_type !== 1)">
                    <ng-container i18n>Rating</ng-container>
                    :
                      <span class="ng-binding" style="padding:0 2px">
                        <a>
                          <ng-container i18n>Click to review!</ng-container>
                        </a>
                      </span>
                    </p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right">
                    <a [href]="order.tracking_link" [style.color]="profile_color"
                      *ngIf="order.tracking_link && order.job_status != 15" target="_blank">
                      <ng-container i18n>Track</ng-container>
                    </a>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-left"
                    *ngIf="(order.delivery_method==deliveryMethod.SELF_PICKUP && (order.job_status==10||order.job_status==12))">
                    <span><i class="glyphicon glyphicon-map-marker locateStyle" (click)="openMap(order)"></i></span>
                    <a (click)="openMap(order)" class="click-style">{{langJson['Locate'] ?
                    langJson['Locate'] :
                    'Locate'}}&nbsp;{{terminology.STORE}}</a>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div *ngIf="showPaginating" class="pg-ldr-prt">
        <div class="pg-ldr-cld">
          <div class="pg-ldr-ctr">
            <div class="pg-loader"
              [ngStyle]="{'border-bottom-color': appConfig.color,'border-left-color': appConfig.color}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-orders" *ngIf="hitC && !ordersData.length">
      <h3 class="">
        {{langJson['No orders to display.']}}
      </h3>
    </div>
  </div>
  <div id="main"></div>

  <div class="parent-dialog" *ngIf="cancelDialog?.show">
    <div class="content-dialog">
      <div class="dialog-title" [ngClass]="{'min-height':refundDetails && !refundDetails.refundLoyaltyPoint,
      'max-height': refundDetails && refundDetails.refundLoyaltyPoint,
      'def-height':!appConfig.is_cancellation_policy_enabled}">
        <div class="refund-detail" *ngIf="appConfig.is_cancellation_policy_enabled">
          <label class="label-heading">
            <ng-container i18n>Cancellation Charges</ng-container> :
            <span class="label-value">{{currency}}{{decimalConfigPipe(refundDetails.cancellationCharge)}}</span>
          </label>
          <label [ngClass]="{'padding-bottom':!refundDetails.refundLoyaltyPoint}" class="label-heading">
            <ng-container i18n>Amount to be refunded</ng-container> :
            <span class="label-value">{{currency}}{{decimalConfigPipe(refundDetails.refundAmount)}}</span>
          </label>
          <label [ngClass]="{'padding-bottom':refundDetails.refundLoyaltyPoint}"
            *ngIf="refundDetails.refundLoyaltyPoint" class="label-heading">Loyalty
            points to be refunded :
            <span class="label-value">{{refundDetails.refundLoyaltyPoint}}</span>
          </label>
        </div>
        <span style="line-height:1px">{{cancelDialog?.title}}</span>
      </div>
      <div class="dialog-msg">
        <div *ngIf="cancelType==1" class="cancel-dropdown">
          <select class="add-category-input" [(ngModel)]="selectedReason" aria-label="Select cancellation reason">
            <option [ngValue]="undefined" disabled selected>
              <ng-container i18n>Select Option</ng-container>
            </option>
            <option [ngValue]="reason.reason" *ngFor="let reason of reasonData;">{{reason.reason}}</option>
          </select>
          <div class="error-msg" style="font-size: 14px;color: red;letter-spacing: 0.5px;line-height: 24px;"
            *ngIf="reasonNotSelected">
            <ng-container i18n>This field is required</ng-container>
          </div>
        </div>
        <textarea [(ngModel)]="cancelDialog.value" maxlength="247"
          style="width: 100% !important;height: 150px !important;" class="form-control"
          [class.has-error]="cancelDialog.error && !cancelDialog.value" [ngClass]="{'cls-upcase':cancelDialog.value}"
          i18n-placeholder placeholder="Enter a reason (maximum characters can be 250)" rows="5" id="comment"
          aria-label="Enter a reason (maximum characters can be 250)"></textarea>
        <div class="error-msg" style="font-size: 14px;color: red;letter-spacing: 0.5px;line-height: 24px;"
          *ngIf="cancelDialog.error && !cancelDialog.value">
          <ng-container i18n>This field is required</ng-container>
        </div>
      </div>
      <hr class="p-hr">
      <div class="dialog-action">
        <div class="dialog-cancel btn btn-default" (click)="hideCancelDialog()" appBs>
          <ng-container i18n>Skip</ng-container>
        </div>
        <div class="dialog-ok btn btn-default primary-theme-btn" (click)="cancelOrder()" appColor bg="'true'" appBs>
          <ng-container i18n>Submit</ng-container>
        </div>
      </div>
    </div>
    <div class="back-dialog"></div>
  </div>

  <div class="modal fade" id="orderDetails" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content topMargin" *ngIf="details">
        <div class="modal-header headerBgColor">
          <button type="button" class="close" data-dismiss="modal">
            <img src="assets/img/close.svg" alt="close" />
          </button>
          <h4 class="modal-title titleColor text-capitalize">{{terminology.ORDER}} / #{{details.job_id}} </h4>
        </div>
        <div class="modal-body orderScroll" id="orderScroll">
          <div class="row">
            <div class="col-lg-6 col-sm-6 col-md-6 col-xs-12">
              <p class="text-capitalize textStyle"
                *ngIf="(!details.is_custom_order || details.delivery_method === 2) && details.task_type === 0">
                {{terminology.DELIVERY_FROM || 'Delivery From'}} : {{details.merchant_name}}
              </p>
              <p class="text-capitalize textStyle" *ngIf="details.task_type === 2">
                {{terminology.DELIVERY_FROM || 'Delivery From'}} : {{details.merchant_name}}
              </p>
              <p class="textStyle" *ngIf="details.task_type === 1">
                {{terminology.PICKUP_FROM || 'Pickup From'}} : {{details.job_pickup_address || '-'}}
              </p>
            </div>
            <div class="col-lg-6 col-sm-6 col-md-6 col-xs-12">
              <p *ngIf="!details.enable_start_time_end_time && details.business_type != 2 && details.task_type === 0"
                class="text-capitalize textStyle showTextTime">
                {{langJson['Order Time']}} : {{details.creation_datetime}}
              </p>
              <p *ngIf="!details.enable_start_time_end_time && details.business_type != 2 && details.task_type === 0 && !details.is_custom_order"
                class="text-capitalize textStyle showTextTime">
                {{langJson['Scheduled Time']}} : {{details.job_delivery_datetime}}
              </p>
              <p *ngIf="details.task_type === 1" class="text-capitalize textStyle showTextTime">
                <span>
                  <ng-container i18n>{{terminology.PICKUP || 'Pickup'}} Time</ng-container>:
                  {{details.job_pickup_datetime}} <b>-</b>
                </span><br />
                <span class="pr-2">{{details.job_delivery_datetime}}</span>
              </p>
              <p *ngIf="details.task_type === 2" class="text-capitalize textStyle showTextTime">
                <span>
                  <ng-container i18n>{{terminology.DELIVERY || 'Delivery'}} Time</ng-container>:
                  {{details.job_pickup_datetime}} <b>-</b>
                </span><br />
                <span class="pr-2">{{details.job_delivery_datetime}}</span>
              </p>
              <p *ngIf="!details.enable_start_time_end_time && details.business_type == 2"
                class="textStyle showTextTime">
                <ng-container i18n>Created At</ng-container>
                : {{details.created_at}}
              </p>
              <p *ngIf="details.enable_start_time_end_time" class="text-capitalize textStyle showTextTime">
                {{terminology.START_TIME}} : {{details.job_pickup_datetime }}</p>
              <p *ngIf="details.enable_start_time_end_time" class="text-capitalize textStyle showTextTime">
                {{terminology.END_TIME}} : {{details.job_delivery_datetime }}</p>
            </div>
            <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
              <p class="textStyle"
                *ngIf="(!details.is_custom_order && details.delivery_method === 2) && details.task_type === 0">
                {{terminology.DELIVER_TO || 'Deliver To'}} : {{details.job_pickup_address}}
              </p>
              <p class="textStyle" *ngIf="details.task_type === 2">
                {{terminology.DELIVER_TO || 'Deliver To'}} : {{details.job_address}}
              </p>
              <p class="textStyle" *ngIf="details.is_custom_order && details.task_type === 0">
                {{terminology.PICKUP_FROM || 'Pickup From'}} : {{details.job_pickup_address || '-'}}
              </p>
              <p class="textStyle" *ngIf="!details.is_custom_order && details.delivery_method === 4">
                {{terminology.PICKUP_FROM || 'Pickup From'}} : {{details.job_pickup_address || '-'}}
              </p>
            </div>
            <div *ngIf="details.is_custom_order && details.task_type === 0"
              class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
              <p class="textStyle">{{terminology.DELIVER_TO || 'Deliver To'}} : {{details.job_address}}</p>
            </div>
            <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12" *ngIf="details.job_description">
              <p class="textStyle" *ngIf="!details.is_custom_order">
                <ng-container i18n>Notes</ng-container> : {{details.job_description}}
              </p>
              <p class="textStyle" *ngIf="details.is_custom_order">
                <ng-container i18n>Description</ng-container> : {{details.job_description}}
              </p>

            </div>
            <div *ngIf="details.return_enabled" class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
              <p class="textStyle" style="color:rgb(22, 107, 211)"> Return Enabled</p>
            </div>
          </div>
          <div class="row"
            *ngIf="details.payment_method && (!(details.payment_method === paymentMode.CASH || details.payment_method === paymentMode.PAY_LATER || details.payment_method === 2  || details.payment_method === 64) || (isLaundryFlow && details.payment_method !== paymentMode.CASH && details.payment_method !== paymentMode.PAY_LATER)) && details.task_type !== 1">
            <div class="col-md-12">
              <span class="textStyle" i18n>Payment Status</span> :
              <span class="textStyle"
                *ngIf="details.overall_transaction_status && details.overall_transaction_status != 0;else unpaid_status"
                [ngClass]="transactionStatus[details.overall_transaction_status].color_class || 'Unpaid'">{{langJson[(transactionStatus[details.overall_transaction_status].label
                  || 'Unpaid' )]}}</span>
              <ng-template #unpaid_status>
                <span class="textStyle" class="Unpaid">{{langJson['Unpaid']}}</span>
              </ng-template>
            </div>
          </div>

          <div class="row"
            *ngIf="(![13,14,15].includes(details.job_status)) && details.payment_method && details.is_custom_order !== 2 && details.task_type !== 1">
            <div class="col-md-12 payment-status">
              <span class="textStyle" i18n>Payment Mode</span> :
              <span class="textStyle">{{details.payment_type}}
                <button
                  *ngIf="(!details.overall_transaction_status && details.payment_method !== paymentMode.CASH && details.payment_method !== paymentMode.PAY_LATER) || ([3,4,5,7].includes(details.overall_transaction_status) && details.payment_method !== paymentMode.CASH && details.payment_method !== paymentMode.PAY_LATER) && details.is_custom_order !== 2 && details.payment_method !== paymentMode.CASH"
                  class="btn text-capitalize pay-btn pull-right" (click)="payUnpaidOrder(details)" i18n>Pay</button>
              </span>
            </div>
          </div>

          <div class="row"
            *ngIf="details.loyalty_points && details.loyalty_points.loyalty_points_earned && headerData.is_loyalty_point_enabled">
            <div class="col-md-12">
              <span class="textStyle">{{terminology.LOYALTY_POINTS}} <ng-container i18n>Earned</ng-container></span> :
              <span class="textStyle">{{details.loyalty_points.loyalty_points_earned}}</span>
            </div>
            <div class="col-md-12">
              <span class="textStyle">
                <ng-container i18n>These</ng-container> {{terminology.LOYALTY_POINTS}} <ng-container i18n>will expire on
                </ng-container>
                {{details.loyalty_points.expiry_date }}
              </span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12">
              <h4 class="summary">
                <ul class="nav nav-tabs">
                  <li [ngClass]="{'active' : !showAdditonalInfo}" (click)="showAdditonalInfo = false;"><a
                      i18n>Summary</a>
                  </li>
                  <li [ngClass]="{'active' : showAdditonalInfo}" (click)="showAdditonalInfo = true;"
                    *ngIf="this.details.checkout_template && this.details.checkout_template.length>0">
                    <a>{{terminology.CHECKOUT_TEMPLATE}}</a></li>
                </ul>

                <span *ngIf="showChatIcon"
                  (click)="startChat(details.grouping_tags,details.hippo_transaction_id,details.user_id,details.job_id,details.merchant_name)"
                  style="font-size: 18px;padding-right: 8px;color:#1f8ceb;margin-top: -63px;">
                  <i class="fa  fa-commenting-o" aria-hidden="true"></i>
                </span>
              </h4>
            </div>

            <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12" *ngIf="!showAdditonalInfo">
              <div *ngFor="let item of details.orderDetails" class="repeatProduct">
                <div class="row">
                  <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6" *ngIf="item.product.services">
                    <p>
                      <span
                        [style.color]="tookanStatusColor[item.product.services.job_status] ? tookanStatusColor[item.product.services.job_status] : '#000000'">
                        {{showTookanStatus(item.product.services.job_status)}}
                      </span>
                    </p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 text-right" *ngIf="item.product.services">
                    <p>
                      <span *ngIf="item.product.services.tracking_link && item.product.services.job_status != 15">
                        <a [href]="item.product.services.tracking_link" [style.color]="profile_color" target="_blank">
                          <ng-container i18n>Track</ng-container>
                        </a>
                      </span>
                    </p>
                  </div>

                </div>
                <div class="row">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6" style="word-break: break-all;">
                    <p class="text-capitalize">
                      <span>{{item.product.product_name}}</span>
                    </p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6" *ngIf="item.product.quantity > 1">
                    <p class="showText">
                      <span class="quantityDiv">{{item.product.quantity}}</span>
                    </p>
                  </div>
                  <div class="col-xs-12 col-lg-12 col-sm-12 col-md-12"
                    *ngIf="item.product.unit_type == 1 && (!item.product.multiPrice || appConfig.business_model_type !== 'RENTAL')">
                    <p class="textStyle"
                      *ngIf="appConfig.show_product_price == 1 || item.product.unit_price > 0 || isLaundryFlow">
                      <span>
                        <b>{{currency +''}} {{decimalConfigPipe(item.product.unit_price)}} </b>
                      </span>
                    </p>
                  </div>
                  <div class="col-xs-12 col-lg-12 col-sm-12 col-md-12"
                    *ngIf="item.product.unit_type != 1  && (!item.product.multiPrice || appConfig.business_model_type !== 'RENTAL')">
                    <p class="textStyle" *ngIf="appConfig.show_product_price == 1 || item.product.unit_price > 0">
                      <span>
                        <b>{{currency +''}} {{decimalConfigPipe(item.product.unit_price * item.product.unit_count)}}
                          {{isLaundryFlow ? ('/ '+priceTypeConst[item.product.unit_type].name || ''):''}}</b>
                      </span>
                    </p>
                  </div>
                  <div class="col-xs-12 col-lg-12 col-sm-12 col-md-12"
                    *ngIf="item.product.multiPrice && appConfig.business_model_type === 'RENTAL'">
                    <p class="textStyle" *ngIf="appConfig.show_product_price == 1 || item.product.unit_price > 0">
                      <span>
                        <b>{{currency +''}} {{decimalConfigPipe(item.product.total_price)}}</b>
                      </span>
                      <span style="position: relative;" #container (mouseenter)="op.show($event)"
                        (mouseleave)="op.hide($event)"
                        *ngIf="item.product.multiPrice && item.product.multiPrice.length">
                        <i class="fa fa-info-circle" style="cursor:pointer;" aria-hidden="true"></i>
                        <p-overlayPanel [appendTo]="container" [dismissable]="'true'" #op>
                          <div class="price-list">
                            <div *ngFor="let billData of item.product.multiPrice">
                              <div *ngIf="billData.unit > 0">{{currency + decimalConfigPipe(((billData.price * billData.unit)
                                ) || '0') + ' @ ' + decimalConfigPipe((billData.price
                                ) || '0') + ' / ' + priceTypeConst[billData.price_type].name + ' x ' +
                                billData.unit}}</div>
                            </div>
                          </div>
                        </p-overlayPanel>
                      </span>

                    </p>
                  </div>




                </div>
                <div class="row" *ngIf="item.product.sku && ecomView">
                  <div class="col-lg-12 col-xs-12 col-sm-12 col-md-12" style="word-break: break-all;">
                    <p class="text-capitalize">
                      <span>{{langJson['Barcode']}}: &nbsp;&nbsp;{{item.product.sku}}</span>
                    </p>
                  </div>
                </div>

                <div class="row" *ngIf="item.product.task_start_time">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle">{{terminology.START_TIME}}</p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle text-right">{{item.product.task_start_time}}</p>
                  </div>
                </div>
                <div class="row"
                  *ngIf="(item.product.task_end_time && details.pd_or_appointment == 1 && item.product.unit_type != 1)">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle">{{terminology.END_TIME}}</p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle text-right">{{item.product.task_end_time}}</p>
                  </div>
                </div>

                <div class="row"
                  *ngIf="(item.product.task_end_time && details.pd_or_appointment == 1 && item.product.unit_type == 1 && item.product.enable_tookan_agent)">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle">{{terminology.END_TIME}}</p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle text-right">{{item.product.task_end_time}}</p>
                  </div>
                </div>
                <div class="row" *ngIf="(item.product.task_end_time && details.pd_or_appointment != 1)">
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle">{{terminology.END_TIME}}</p>
                  </div>
                  <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6">
                    <p class="text-capitalize textStyle text-right">{{item.product.task_end_time}}</p>
                  </div>
                </div>

                <div class="row" *ngIf="item.customizations" class="mainCus">
                  <div class="makeCustom">
                    <div *ngFor="let c of item.customizations" class="makeCustomWidth">
                      <div class="side-card">

                        <div class="col-xs-12 textStyle" style="word-break: break-all;">
                          <p>
                            <ng-container i18n>Customization</ng-container>
                            :
                            <span>{{c.cust_name}}</span>
                          </p>
                        </div>
                        <div class="col-xs-12 textStyle" *ngIf="c.quantity > 1">
                          <p>
                            <ng-container i18n>Quantity</ng-container>
                            :
                            <span>{{c.quantity}}</span>
                          </p>
                        </div>
                        <div class="col-xs-12 textStyle" *ngIf="item.product.unit_type == 1 && c.unit_price > 0">
                          <p>
                            <ng-container i18n>Price</ng-container>
                            :
                            <span>{{currency +''}} {{decimalConfigPipe(c.unit_price)}}</span>
                          </p>
                        </div>
                        <div class="col-xs-12 textStyle" *ngIf="item.product.unit_type != 1 && c.unit_price > 0">
                          <p>
                            <ng-container i18n>Price</ng-container>
                            :
                            <span>{{currency +''}} {{decimalConfigPipe(c.unit_price * item.product.unit_count)}}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row" style="padding-top: 8px;"
                  *ngIf="(appConfig.show_product_price == 1 || item.product.productWiseTotal > 0 ) && !(isLaundryFlow && details.task_type === 1)">
                  <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">
                    <p class="textStyle">
                      <b>
                        <ng-container i18n>Total Price</ng-container>
                      </b>
                    </p>
                  </div>
                  <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6 text-right">
                    <p class="textStyle text-right">{{currency +''}} {{decimalConfigPipe(item.product.productWiseTotal)}}</p>
                  </div>

                  <div *ngIf="item.product.taxes && item.product.taxes.length">

                    <div *ngFor="let tax of item.product.taxes">
                      <p class="col-lg-6 col-md-6 col-sm-6 col-xs-6" [ngStyle]="{ 'direction' : direction }">
                        {{tax.tax_name}}
                        <span class="tax-percantage" *ngIf="!tax.tax_type">@ {{tax.tax_percentage}}%</span>
                      </p>
                      <p class="text-right col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        {{currency +''}} {{decimalConfigPipe(tax.tax_amount)}}
                      </p>
                    </div>

                    <div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" [ngStyle]="{ 'direction' : direction }">
                        <p class="textStyle">
                          <b>
                            <ng-container i18n>Total Price (with tax)</ng-container>
                          </b>
                        </p>
                      </div>
                      <div class="text-right col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <p class="textStyle text-right">{{currency +''}}
                          {{decimalConfigPipe(item.product.productWiseTotalWithTax)}}</p>
                      </div>
                    </div>

                  </div>




                  <div class="col-xs-12 col-lg-12 col-sm-12 col-md-12 pad-12" *ngIf="ecomView">
                    <div class="col-xs-6 col-lg-6 col-sm-6 col-md-6 pad-0" *ngIf="item.product.unit_type == 1">
                      <p class="textStyle" *ngIf="appConfig.show_product_price == 1 || item.product.unit_price > 0">
                        <span>
                          <b>
                            <ng-container i18n>Sold by</ng-container>
                          </b> {{item.product.seller_name}}</span>
                      </p>
                    </div>
                  </div>

                </div>
                <div class="row">
                  <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <div *ngIf="item.product.unit_type && item.product.unit_type > 1 && item.product.unit_type < 8">

                      <p class="pull-left" style="padding-top: 0px;"
                        *ngIf="(appConfig.show_product_price == 1 || item.product.productWiseTotal > 0) && appConfig.business_model_type != 'RENTAL'">
                        <span style="font-size: 13px;float:none;">
                          <span style="float:none;">
                            <ng-container i18n>Charge</ng-container> @ {{details.orderDetails[0].product.unit}}
                          </span>
                          <span style="float:none;" *ngIf="item.product.unit_type == 2">
                            <ng-container i18n>minute(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                          <span style="float:none;" *ngIf="item.product.unit_type == 3">
                            <ng-container i18n>hour(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                          <span style="float:none;"
                            *ngIf="item.product.unit_type == 4 && appConfig.business_model_type != 'RENTAL'">
                            <ng-container i18n>day(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                          <span style="float:none;"
                            *ngIf="item.product.unit_type == 4 && appConfig.business_model_type == 'RENTAL'">
                            <ng-container i18n>night(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                          <span style="float:none;" *ngIf="item.product.unit_type == 5">
                            <ng-container i18n>weeks(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                          <span style="float:none;" *ngIf="item.product.unit_type == 6">
                            <ng-container i18n>month(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                          <span style="float:none;" *ngIf="item.product.unit_type == 7">
                            <ng-container i18n>year(s)</ng-container> x {{item.product.unit_count}}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <div *ngIf="item.product.services">
                      <p class="button-carrier" *ngIf="item.product.services.cancel_allowed">
                        <button class="btn text-capitalize cancelButton" style="color: white;"
                          (click)="showCancelDialog(item)" [style.background-color]="profile_color">
                          {{terminology.CANCEL_ORDER}}
                        </button>
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
          <app-show-order-additonal-info-dynamic [additionalInformation]="details.checkout_template" *ngIf="showAdditonalInfo">
          </app-show-order-additonal-info-dynamic>
          <div class="row total-card m0" *ngIf="!showAdditonalInfo">
            <div class="col-xs-12" *ngIf="subtotal">
              <p class="textStyle">
                <ng-container i18n>Subtotal</ng-container>
                :
                <span>{{currency +''}} {{decimalConfigPipe(subtotal)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="details.coupon_discount">
              <p class="textStyle" [ngClass]="{'mb-0': details.promoOnSubtotal}">
                <ng-container i18n>Discount</ng-container>
                :
                <span>-{{currency +''}} {{decimalConfigPipe(details.coupon_discount)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="details.promoOnSubtotal">
              <div class="promo-applied">
                (
                <ng-container i18n>Promo Applied</ng-container>
                :
                <span>{{details.promoOnSubtotal.promo_code}}</span>
                )
              </div>
            </div>

            <div class="col-xs-12" *ngIf="(details.delivery_charge || details.promoOnDelivery) && terminology">
              <p class="text-capitalize textStyle" [ngClass]="{'mb-0': details.promoOnSubtotal}">
                {{terminology.DELIVERY_CHARGE}} :
                <span>{{currency +''}} {{decimalConfigPipe(details.delivery_charge || 0)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="details.promoOnDelivery">
              <div class="promo-applied">
                (
                <ng-container i18n>Promo Applied</ng-container>
                :
                <span>{{details.promoOnDelivery.promo_code}}</span>
                )
              </div>
            </div>


            <div class="col-xs-12" *ngFor="let tax of details.user_taxes">
              <p class="textStyle" *ngIf="tax.tax_type">
                {{tax.tax_name}} :
                <span *ngIf="tax.tax_amount">{{currency+''}} {{decimalConfigPipe(tax.tax_amount)}}</span>
              </p>
              <p class="textStyle" *ngIf="!tax.tax_type">
                {{tax.tax_name+' @ '+tax.tax_percentage+'%'}} :
                <span *ngIf="tax.tax_amount">{{currency+''}} {{decimalConfigPipe(tax.tax_amount)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="details.tip > 0">
              <p class="textStyle">
                <ng-container>{{terminology.TIP}}</ng-container>
                :
                <span>{{currency +''}} {{decimalConfigPipe(details.tip)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="this.details.checkout_template && this.details.checkout_template.length>0">
              <div class="textStyle" (click)="showAdditonalInfo = true" style="cursor:pointer">
                <span i18n>Additional Amount</span>
                (<a i18n class="view_additional">View details</a>)
                :
                <span style="float:right">{{currency +''}} {{decimalConfigPipe(additionalPrice)}}</span>
              </div>
            </div>
            <div class="col-xs-12" *ngIf="details.loyalty_points && details.loyalty_points.loyalty_points_redeem">
              <p class="textStyle">
                {{terminology.LOYALTY_POINTS}} <ng-container i18n>Used</ng-container>
                ({{details.loyalty_points.loyalty_points_redeem}})
                :
                <span>- {{currency +''}} {{decimalConfigPipe(details.loyalty_points.discount_amount)}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="details.refunded_amount > 0">
              <p class="textStyle">
                <ng-container i18n>Refund Amount</ng-container>
                :
                <span>- {{currency +''}} {{decimalConfigPipe(details.refunded_amount)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="appConfig.show_product_price == 1 || details.total_amount > 0">
              <hr />
            </div>
            <div class="col-xs-12" *ngIf="appConfig.show_product_price == 1 || details.total_amount > 0">
              <p>
                <b>
                  <ng-container i18n>Total Amount</ng-container> :
                </b>
                <span>{{currency +''}} {{decimalConfigPipe(details.total_amount)}}</span>
              </p>
            </div>
            <div class="col-xs-12" *ngIf="appConfig.show_product_price == 1 || details.total_amount > 0">
              <hr />
            </div>
            <div class="col-xs-12"
              *ngIf="isLaundryFlow && details.task_type === 2 && details.remaining_balance && !details.is_custom_order">
              <p>
                <b>
                  <ng-container i18n>Remaining Balance</ng-container> :
                </b>
                <span>{{currency +''}} {{decimalConfigPipe(details.remaining_balance)}}</span>
              </p>
            </div>
          </div>

          <div class="row total-card m0"
            *ngIf="details.job_status == 13 && appConfig.is_review_rating_enabled && !showAdditonalInfo && (appConfig.onboarding_business_type !== 805 || details.task_type !== 1)">

            <div class="col-xs-12">
              <p class="textStyle" *ngIf="!details.customer_rating && !details.customer_comment"
                [ngStyle]="{ 'direction' : direction }">
                <ng-container i18n>Rating & Review</ng-container>
                :
                <span>
                  <a (click)="showRatingDialog(details)" style="cursor:pointer">
                    <ng-container i18n>None yet! Click to add</ng-container>
                  </a>
                </span>
              </p>
            </div>

          </div>
          <div class="row total-card m0"
            *ngIf="details.job_status == 13 && appConfig.is_review_rating_enabled && !showAdditonalInfo">

            <div class="col-xs-12">
              <p *ngIf="details.customer_rating" class="textStyle">
                <ng-container i18n>Rating</ng-container> :
                <span>
                  <star-rating-comp [readOnly]="true" [rating]="details.customer_rating?details.customer_rating:0"
                    [starType]="'svg'"></star-rating-comp>
                </span>
              </p>
            </div>

            <div class="col-xs-12">
              <p class="textStyle" *ngIf="details.customer_comment">
                <ng-container i18n>Review</ng-container> :
                <span style="font-weight: 200">{{details.customer_comment}}</span>
              </p>
            </div>

          </div>
          <div class="row total-card m0" style="border: none;" *ngIf="details.cancel_allowed && !showAdditonalInfo">

            <div class="col-xs-12">
              <p class="button-carrier textStyle">
                <button class="btn text-capitalize cancelButton" mat-button style="color: white;"
                  (click)="showCancelDialog(details,cancel_allowed)"
                  [style.background-color]="profile_color">{{terminology.CANCEL_ORDER}}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <app-modal-dynamic [modalType]="modalType" *ngIf="openCancellationPopUp" (onClose)="hidePopup()" (esc)="hidePopup()">
    <div body style="padding: 25px 50px">
      <div class="col-12 p-0 cancel-popup">
        <label class="heading-popup" i18n>Cancellation Policy</label>
        <div><i class="fa fa-close icons" (click)="hidePopup()"></i></div>
      </div>
      <ol style="padding-top: 20px;">
        <li *ngFor="let rule of cancelRules">{{rule}}</li>
      </ol>
    </div>
  </app-modal-dynamic>

  <app-modal-dynamic [modalType]="modalType" *ngIf="openRatingReview" (onClose)="hideDialog()" (esc)="hideDialog()">
    <div body style="padding: 25px 30px">
      <div class="row">
        <div class="col-12 cancel-popup">
          <label class="heading-popup" i18n>Review & Rate</label>
          <div><i class="fa fa-close icons" (click)="hideDialog()"></i></div>
        </div>
        <div class="col-12" *ngIf="appConfig.is_tookan_active && orderForRating.tookan_job_hash">
          <h4 class="summary p-0">
            <ul class="nav nav-tabs">
              <li [ngClass]="{'active' : !showAgentRatingTab}" (click)="showAgentRatingTab = false;"><a i18n>Order
                  Rating</a>
              </li>
              <li [ngClass]="{'active' : showAgentRatingTab}" (click)="showAgentRatingTab = true;">
                <a i18n>Agent Rating</a></li>
            </ul>
          </h4>
        </div>
        <div class="col-12 m-t-10">
          <app-order-rating-dynamic [orderForRating]="orderForRating" (hideDialog)="hideDialog($event.detail)"
            (shiftAgentRating)="shiftAgentRating($event.detail)" *ngIf="!showAgentRatingTab"></app-order-rating-dynamic>
          <app-agent-rating-dynamic [orderForRating]="orderForRating" (hideDialog)="hideDialog($event.detail)"
            *ngIf="showAgentRatingTab"></app-agent-rating-dynamic>
        </div>
      </div>
    </div>
  </app-modal-dynamic>

  <app-dynamic-footer></app-dynamic-footer>

  <app-modal-dynamic *ngIf="mapTemplatePopup" [modalType]="modalType.LARGE" (esc)="hideTempltePopup()"
    (onClose)="hideTempltePopup()">
    <div body>
      <div class="popup-div">
        <agm-map [latitude]="lat" [longitude]="lng" [zoom]="15" [styles]="mapStyle" [minZoom]="8" [scrollwheel]="false">
          <agm-marker [latitude]="lat" [longitude]="lng">
            <agm-info-window>{{this.storeAddress}}</agm-info-window>
          </agm-marker>
        </agm-map>
      </div>
      <div class="locateDiv">
        <button type="button" class="btn accept button-style" appColor bg="true" [ngStyle]="{ 'direction' : direction }"
          (click)="hideTempltePopup()">
          <ng-container i18n>Close</ng-container>
        </button>
      </div>
    </div>

  </app-modal-dynamic>
</div>`,
    css: `
    #order-listing .heading {
      text-align: center;
      padding: 20px 0;
  }

  #order-listing .title {
      text-align: center;
      color: #858585;
      display: inline-block;
      font-family: ProximaNova;
      font-size: 25px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
  }

  #order-listing .containerOrder {
      max-width: 1400px;
      margin: auto;
  }

  #order-listing .line {
      margin: 0 auto;
      width: 50px;
  }

  #order-listing .order-ecom img {
      height: 64px;
      float: right;
  }

  #order-listing .pad-0 {
      padding: 0;
  }

  #order-listing .cards {
      margin: 10px;
      height: 100%;
      background-color: #fff;
      cursor: pointer;
      box-shadow: 0 2px 35px 0 rgba(0, 0, 0, 0.05);
      border: 1px solid #979797;
  }

  #order-listing .cards:hover {
      box-shadow: 0 7px 5px 0 rgba(0, 0, 0, 0.1);
      transition: 0.5s;
  }

  #order-listing .cancel-dropdown {
      font-size: 12px;
  }

  #order-listing .add-category-input {
      resize: none;
      width: 100%;
      height: 40px;
      margin-bottom: 10px;
      opacity: 1;
      font-size: 14px;
      color: #333;
      background-color: #fff;
  }

  #order-listing .orderIDDiv {
      font-family: 'ProximaNova-Regular';
      padding: 17px 20px 9px 20px;
  }

  #order-listing .orderIDDiv div.orderIdOnly {
      float: left;
      padding: 5px 0px;
  }

  #order-listing .orderIDDiv div.orderIdOnly .idText {
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1;
      letter-spacing: normal;
      color: #333;
      padding-top: 5px;
  }

  #order-listing .orderIDDiv div.orderIdOnly .idNumber {
      font-family: 'ProximaNova-Regular';
      font-size: 20px;
      font-weight: 600;
      font-style: normal;
      padding-left: 12px;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: -0.3px;
      color: #333;
  }

  #order-listing .orderIDDiv .orderStatusOnly {
      float: right;
      padding: 5px 0px;
  }

  #order-listing .orderIDDiv .orderStatusOnly .statusText {
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1;
      letter-spacing: normal;
      padding-top: 5px;
  }

  #order-listing textarea {
      resize: vertical;
  }

  #order-listing .otherDetailsDiv {
      position: relative;
      background-color: #e5e5e5;
      padding: 25px 20px;
  }

  #order-listing .otherDetailsDiv .orderAmount .orderAmountText {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: -0.1px;
      text-align: left;
      color: #333;
  }

  #order-listing .otherDetailsDiv .orderAmount .orderAmountNumber {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: -0.1px;
      text-align: right;
      color: #333;
  }

  #order-listing .ratingReviewAndTrack {
      padding: 10px 20px;
      height: 50px;
  }

  #order-listing .button-carrier {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-bottom: 0 !important;
  }

  #order-listing .ratingDivOrder {
      top: 21px;
      right: 20px;
      color: #fff;
      padding: 2px 7px;
      font-size: 12px;
      width: 67px;
      height: 22px;
      border-radius: 17px;
      background-color: #ffab30;
  }

  #order-listing .ratingCountOrder {
      opacity: 0.9;
      background-color: white;
      font-family: ProximaNova-Regular;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: -0.4px;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      display: inline-block;
      margin-left: 3px;
  }

  #order-listing .green-bold {
      background-color: #94c965;
  }

  #order-listing .yellow-bold {
      background-color: #ffc058 !important;
  }

  #order-listing .red-bold {
      background-color: #f03c56 !important;
  }

  #order-listing .sidenav {
      height: 100%;
      width: 0;
      position: fixed;
      z-index: 1000000;
      top: 0;
      right: 0;
      background-color: #fff;
      overflow-x: hidden;
      margin-top: 70px;
  }

  #order-listing .sidenav p, #order-listing h4 {
      padding: 8px 8px 8px 32px;
      margin-bottom: 0px !important;
      text-decoration: none;
      font-size: 15px;
      color: #313131;
      font-family: ProximaNova-Regular;
      display: block;
  }

  #order-listing .sidenav p span, #order-listing h4 span {
      float: right;
  }

  #order-listing .sidenav .closebtn {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
  }

  @media screen and (max-height: 450px) {
      #order-listing .sidenav {
          padding-top: 15px;
      }
      #order-listing .sidenav a {
          font-size: 18px;
      }
  }

  #order-listing .side-card {
      border: solid 1px #e4e4ed;
      display: flex;
      margin: 0px;
      height: 75px;
      flex-direction: column;
  }

  #order-listing .cust-card {
      border: solid 1px #e4e4ed;
      margin: 24px;
  }

  #order-listing #main {
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      display: none;
      background-color: black;
      opacity: 0.7;
      width: 100vw;
  }

  #order-listing .order-id {
      color: #fff;
      font-size: 18px;
      padding: 8px 8px 8px 32px;
      font-family: ProximaNova-Regular;
  }

  #order-listing .order-id span {
      float: right;
  }

  #order-listing .side-card p {
      padding: 8px 0px 2px 0px;
      margin-bottom: 0px !important;
  }

  #order-listing .total-card p {
      font-family: ProximaNova-Regular;
      padding: 8px 0px 4px 0px;
      font-weight: bolder;
  }

  #order-listing .total-card p span {
      float: right;
  }

  #order-listing .main-c {
      height: auto;
      min-height: calc(100vh - 180px);
      padding-bottom: 20px;
  }

  #order-listing .no-orders {
      height: 80vh;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      align-items: center;
  }

  #order-listing .pg-ldr-prt {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 100000;
      text-align: center;
  }

  #order-listing .pg-ldr-cld {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  #order-listing .pg-ldr-ctr {
      background-color: #f5f5f5;
      margin: 0 auto;
      border-radius: 10px;
  }

  #order-listing .pg-ldr-ctr {
      padding: 8px;
  }

  #order-listing .pg-loader {
      width: 35px;
      height: 35px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, 0.03);
      border-right: 5px solid rgba(0, 0, 0, 0.03);
      border-bottom: 5px solid transparent;
      border-left: 5px solid transparent;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
  }

  #order-listing .pg-loader, #order-listing .pg-loader:after {
      border-radius: 50%;
  }

  @-webkit-keyframes pg-loader {
      from {
          -webkit-transform: rotate(0deg);
      }
      to {
          -webkit-transform: rotate(360deg);
      }
  }

  #order-listing .pg-loader {
      -webkit-animation: gl-loader 0.5s linear infinite;
  }

  #order-listing .pg-loader {
      display: block !important;
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      width: 35px;
      height: 35px;
      position: relative;
      border-top: 5px solid rgba(0, 0, 0, .03);
      border-right: 5px solid rgba(0, 0, 0, .03);
      border-bottom: 5px solid #c4253a;
      border-left: 5px solid #c4253a;
      transform: translateZ(0);
  }

  @-webkit-keyframes spin {
      0% {
          -webkit-transform: rotate(0deg);
      }
      100% {
          -webkit-transform: rotate(360deg);
      }
  }

  @keyframes spin {
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
  }

  #order-listing .order_loader {
      display: none;
  }

  #order-listing .starContainer {
      height: 40px;
  }

  #order-listing .starContainer div {
      outline: none !important;
  }

  #order-listing .paZero {
      padding-bottom: 0px;
      margin-bottom: 0px;
  }

  #order-listing star-rating-comp>div {
      outline: none !important;
  }

  #order-listing .parent-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .7);
      z-index: 904;
      margin: 5px;
  }

  #order-listing .parent-dialog div.content-dialog {
      width: 500px;
      position: absolute;
      top: 40%;
      left: 50%;
      background-color: #fff;
      border-radius: 5.3px;
      padding: 20px 30px;
      transform: translate(-50%, -50%);
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-title {
      padding-bottom: 10px;
      height: 40px;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-title span {
      font-size: 18px;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-msg {
      font-size: 20px;
      color: #333;
      letter-spacing: 0.5px;
      line-height: 24px;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-msg input {
      outline: none;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-msg input:focus {
      outline: none;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-action {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
      line-height: 1px;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-action div {
      font-size: 14px;
      background-color: transparent;
      color: #fff;
      border: 1px solid;
      border-radius: 2px;
      padding: 7px 20px;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-action div.dialog-cancel {
      border-radius: 2px;
      border: solid 1px #b2b2b2;
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      color: #b2b2b2;
      margin-right: 20px;
  }

  #order-listing .parent-dialog div.content-dialog div.dialog-action div:hover {
      transform: scale(1);
  }

  #order-listing .parent-dialog div.content-dialog hr.p-hr {
      margin: 30px 0 0 0px;
      background-color: #c1c1c1;
  }

  @media only screen and (max-width: 650px) {
      #order-listing .parent-dialog div.content-dialog {
          width: 350px;
      }
  }

  #order-listing .promo-pay-div {
      max-height: 245px;
      overflow: auto;
      padding-right: 25px;
  }

  #order-listing .card-dialog {
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .7);
      z-index: 904;
      width: 100%;
      height: 100%;
  }

  #order-listing .servicesHeight {
      min-height: 240px;
  }

  #order-listing .productHeight {
      min-height: 240px;
  }

  #order-listing #orderDetails .headerBgColor, #order-listing #orderDetailsFreelancer .headerBgColor {
      background-color: #4c4b4b;
  }

  #order-listing #orderDetails .headerBgColor .titleColor, #order-listing #orderDetailsFreelancer .headerBgColor .titleColor {
      font-family: ProximaNova-Regular;
      font-size: 18px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #fff;
      padding: 0px !important;
  }

  #order-listing #orderDetails .textStyle, #order-listing #orderDetailsFreelancer .textStyle {
      font-family: ProximaNova-Regular;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
  }

  #order-listing #orderDetails .showText, #order-listing #orderDetailsFreelancer .showText {
      text-align: right;
  }

  #order-listing #orderDetails .showTextTime, #order-listing #orderDetailsFreelancer .showTextTime {
      text-align: right;
  }

  #order-listing #orderDetails .summary, #order-listing #orderDetailsFreelancer .summary {
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #e13d36;
      margin: 15px 0px !important;
      padding: 0px !important;
  }

  #order-listing #orderDetails .repeatProduct, #order-listing #orderDetailsFreelancer .repeatProduct {
      border: 1px solid #e4e4ed;
      padding: 10px;
      margin-bottom: 8px;
  }

  #order-listing #orderDetails .quantityDiv, #order-listing #orderDetailsFreelancer .quantityDiv {
      width: 23.4px;
      height: 23.4px;
      object-fit: contain;
      border-radius: 3.6px;
      background-color: #fff;
      padding: 5px 10px;
      border: solid 0.9px #ddd;
      font-size: 12.6px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.2px;
      text-align: left;
      color: #333;
  }

  #order-listing #orderDetails .cancelButton, #order-listing #orderDetailsFreelancer .cancelButton {
      font-family: ProximaNova-Regular;
      font-size: 16px;
  }

  #order-listing #orderDetails .mainCus, #order-listing #orderDetailsFreelancer .mainCus {
      margin: 0px;
      display: inline-block;
      white-space: nowrap;
      overflow-y: hidden;
      overflow-x: auto;
      width: 100%;
  }

  #order-listing #orderDetails .makeCustom, #order-listing #orderDetailsFreelancer .makeCustom {
      display: inline-flex;
      width: 100%;
  }

  #order-listing #orderDetails .makeCustom .makeCustomWidth, #order-listing #orderDetailsFreelancer .makeCustom .makeCustomWidth {
      width: 50%;
  }

  #order-listing #orderDetails .makeCustom .makeCustomWidth p, #order-listing #orderDetailsFreelancer .makeCustom .makeCustomWidth p {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
  }

  @media only screen and (max-width: 650px) {
      #order-listing #orderDetails .makeCustom .makeCustomWidth, #order-listing #orderDetailsFreelancer .makeCustom .makeCustomWidth {
          width: 450px;
      }
  }

  #order-listing #orderDetails .orderScroll, #order-listing #orderDetailsFreelancer .orderScroll {
      max-height: 550px;
      overflow-y: auto;
      overflow-x: hidden;
  }

  #order-listing #orderDetails .topMargin, #order-listing #orderDetailsFreelancer .topMargin {
      margin-top: 80px;
  }

  @media only screen and (max-width: 650px) {
      #order-listing #orderDetails .showTextTime, #order-listing #orderDetailsFreelancer .showTextTime {
          text-align: left;
      }
      #order-listing #orderDetails .topMargin, #order-listing #orderDetailsFreelancer .topMargin {
          margin-top: 30px;
      }
  }

  #order-listing .nav-tabs a {
      cursor: pointer;
  }

  #order-listing .Paid {
      color: green !important;
  }

  #order-listing .Unpaid {
      color: #e13d36 !important;
  }

  #order-listing .Hold {
      color: #e13d36 !important;
  }

  #order-listing .Partial {
      color: #bd6616 !important;
  }

  #order-listing :host /deep/ .ui-overlaypanel {
      z-index: 1;
      padding: 0px;
      padding-left: 10px;
      min-width: 220px;
      right: 0px;
  }

  #order-listing .price-list {
      padding: 0;
      list-style-type: none;
      justify-content: flex-start !important;
  }

  #order-listing :host /deep/ .btn-cursor {
      cursor: pointer;
  }

  #order-listing :host /deep/ .ui-overlaypanel {
      left: -80px !important;
      top: auto !important;
      margin-bottom: 30px;
  }

  #order-listing ol {
      padding-left: 0 !important;
  }

  #order-listing .cancelPolicy {
      position: absolute;
      bottom: 0;
  }

  #order-listing .tk-link {
      color: --var(blue) !important;
  }

  #order-listing .fa-close {
      font-size: 14px;
      color: --var(gray) !important;
      cursor: pointer;
  }

  #order-listing .heading-popup {
      font-size: 18px;
  }

  #order-listing .cancel-popup {
      flex-wrap: nowrap;
      display: flex;
      justify-content: space-between;
  }

  #order-listing .refund-detail {
      display: flex;
      flex-direction: column;
  }

  #order-listing .label-heading {
      font-size: 16px;
      line-height: 20px;
      font-weight: inherit !important;
  }

  #order-listing .label-value {
      font-size: 16px !important;
      font-weight: 500;
  }

  #order-listing .padding-bottom {
      padding-bottom: 10px;
  }

  #order-listing .min-height {
      height: 85px !important;
  }

  #order-listing .max-height {
      height: 125px !important;
  }

  #order-listing .def-height {
      height: 40px !important;
  }

  #order-listing .m0 {
      margin: 0px !important;
  }

  #order-listing :host /deep/ .ui-breadcrumb ul li .ui-menuitem-link {
      cursor: default;
  }

  #order-listing :host /deep/ .ui-menuitem-text {
      font-family: 'ProximaNova-Regular';
      font-size: 15px;
      color: #585858;
  }

  #order-listing :host /deep/ .ui-breadcrumb {
      background: #fff;
      border: 0;
      padding: 0;
      margin: 0 0 10px -0.25em;
      font-family: 'ProximaNova-Regular';
      font-size: 15px;
      color: #585858;
  }

  #order-listing .row-eq-height {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
  }

  #order-listing .row-eq-height .row-col-eq {
      margin-bottom: 20px;
  }

  #order-listing .mb-0 {
      margin-bottom: 0;
  }

  #order-listing .promo-applied {
      margin-bottom: 10px;
      color: #82c548;
      font-size: 12px;
      position: relative;
      top: -3px;
      max-width: 80%;
  }

  #order-listing .p-0 {
      padding: 0px !important;
  }

  #order-listing .m-t-10 {
      margin-top: 10px;
  }

  #order-listing .pr-2 {
      padding-right: 10px;
  }

  #order-listing .payment-status {
      margin-bottom: 10px !important;
  }

  #order-listing .pay-btn {
      background: var(--theme) !important;
      border: 1px solid var(--theme) !important;
      color: white;
      border-radius: 5px !important;
      padding: 0 10px;
  }

  #order-listing .pay-btn:hover {
      background: white !important;
      color: var(--theme);
  }

  #order-listing .autoCompleteGoogle /deep/ .autoComplete {
      padding: 0;
      margin: auto;
      display: inline-flex;
      width: 100%;
      justify-content: center;
      align-items: center;
  }

  #order-listing .locateStyle {
      color: var(--theme);
  }

  #order-listing agm-map {
      height: 400px;
  }

  #order-listing .locateDiv {
      text-align: center !important;
  }

  #order-listing .click-style {
      color: #474747;
      text-decoration: none;
  }

  #order-listing .button-style {
      width: 100% !important;
      font-size: 16px;
  }

  #order-listing .popup-div {
      margin-top: 20px;
      margin-right: 20px;
      margin-left: 20px;
  }`
  },
  orderAdditionalInfo: {
    html: `<div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 additional-info-order" style="padding:0px">
    <div class="repeatProduct">
        <div class="row">
            <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 field_column" style="word-break: break-all;" *ngFor="let field of otherArray">
                <div class="col-md-12" *ngIf="(field.data_type === templateDataType.TEXT || field.data_type === templateDataType.EMAIL || field.data_type === templateDataType.TELEPHONE || field.data_type === templateDataType.NUMBER || field.data_type === templateDataType.SINGLE_SELECT || field.data_type === templateDataType.MULTI_SELECT ||field.data_type === templateDataType.CHECKBOX ||field.data_type === templateDataType.TEXTAREA)">
                    <div class="col-md-12">
                        <span class="field_title">{{field.display_name}}</span>
                    </div>
                    <div class="col-md-12 field_boldy">
                        <span>{{field.value||'-'}}</span>
                    </div>
                </div>

                <div class="col-md-12" *ngIf="(field.data_type === templateDataType.DATE_TIME || field.data_type === templateDataType.DATE_TIME_FUTURE || field.data_type === templateDataType.DATE_TIME_PAST)">
                    <div class="col-md-12">
                        <span class="field_title">{{field.display_name}}</span>
                    </div>
                    <div class="col-md-12 field_boldy">
                        <span class="textStyle" *ngIf="field.value !=''">{{dateTimeFormatData(field.value,'MMM d, y, h:mm a') || '-'}}</span>
                        <span class="textStyle" *ngIf="field.value ==''">-</span>
                    </div>
                </div>
                <div class="col-md-12" *ngIf="(field.data_type === templateDataType.DATE || field.data_type === templateDataType.DATE_FUTURE || field.data_type === templateDataType.DATE_PAST)">
                    <div class="col-md-12">
                        <span class="field_title">{{field.display_name}}</span>
                    </div>
                    <div class="col-md-12 field_boldy">
                        <span class="textStyle" *ngIf="field.value !=''">{{dateTimeFormatData(field.value,'MMM d, y')}}</span>
                        <span class="textStyle" *ngIf="field.value ==''">-</span>
                    </div>
                </div>
            </div>


            <div class="col-lg-6 col-xs-6 col-sm-6 col-md-6 field_column" style="word-break: break-all;" *ngFor="let opts of optionsArray">
                <div class="col-md-12">
                    <div class="col-md-12">
                        <span class="field_title">{{opts.display_name}}</span>
                    </div>

                    <div class="col-md-12 field_boldy">
                        <div *ngFor="let val of opts.selected_values">
                            {{val.text}}
                            <span class="pull-right">
                                <span>{{currency}}</span>
                                <span>{{decimalConfigPipe(val.cost)}}</span>
                            </span>
                        </div>
                        <div *ngIf="opts.selected_values.length === 0">-</div>
                    </div>
                </div>

            </div>


            <div class="col-md-12 col-xs-12 col-sm-12 field_column" *ngFor="let img of imageArray">
                <div class="col-md-12">
                    <div class="col-md-12">
                        <span class="field_title">{{img.display_name}}</span>
                    </div>
                    <div class="col-md-12">
                        <div class="row" *ngIf="img.data_type === templateDataType.IMAGE">
                            <div class="col-md-3 col-sm-4 col-xs-4" style="margin-top:10px" *ngFor="let img of img.value">
                                <img [src]="img" height=75px width="75px" [alt]="img.display_name +' value '+ img">
                            </div>
                        </div>
                        <div class="row" *ngIf="img.data_type === templateDataType.DOCUMENT">
                            <div class="col-md-3 col-sm-4 col-xs-4" style="margin-top:10px" *ngFor="let doc of img.value">
                                <a [href]="doc" download target="_blank">
                                    <img src="assets/img/doc-icon.svg" height=50px width="50px" [alt]="img.display_name +' value '+ doc">
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12" *ngIf="img.value.length === 0">
                        -
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`,
    css: `
    .additional-info-order .field_column {
      padding-top: 20px;
    }
    .additional-info-order .field_title {
      color: black;
    }
    .additional-info-order .field_boldy {
      margin-top: 5px;
      color: #8a7f7f;
    }
    .additional-info-order .repeatProduct {
      border: 1px solid #e4e4ed;
      padding: 10px;
      margin-bottom: 8px;
    }
    .additional-info-order .quantityDiv {
      width: 23.4px;
      height: 23.4px;
      object-fit: contain;
      border-radius: 3.6px;
      background-color: #fff;
      padding: 5px 10px;
      border: solid 0.9px #ddd;
      font-size: 12.6px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.2px;
      text-align: left;
      color: #333;
    }
    .additional-info-order .backBtn {
      cursor: pointer;
      color: #e13d36;
      font-size: 16px;
      margin: 15px 0px !important;
    }
    `
  },
  orderRating: {
    html: `
    <div class="dialog-msg">
      <div class="starContainer">
        <star-rating-comp [size]="'large'" [rating]="ratingGiven" (onRatingChange)="onRatingChange($event)"
          [starType]="'svg'">
        </star-rating-comp>
      </div>
      <textarea [(ngModel)]="review" maxlength="247" style="width: 100% !important;height: 100px !important;"
        class="form-control" [ngClass]="{'cls-upcase': review}" i18n-placeholder
        placeholder="Enter a review (maximum characters can be 250)"
        aria-label="Enter a review (maximum characters can be 250)" rows="5" id="comment"></textarea>
    </div>
    <hr class="p-hr">
    <div class="dialog-action">
      <div class="dialog-cancel btn btn-default"
        (click)="orderForRating.is_job_rated == 0 ? skipReview() : hideRatingDialog()" appBs>
        <ng-container i18n>Cancel</ng-container>
      </div>
      <div class="dialog-ok btn btn-default primary-theme-btn" (click)="saveDialogData()" appColor bg="'true'" appBs>
        <ng-container i18n>Save</ng-container>
      </div>
    </div>`,
    css: `.`
  },
  agentRating: {
    html: `<div class="dialog-msg">
    <div class="starContainer">
      <star-rating-comp [size]="'large'" (onRatingChange)="onRatingChange($event)" [starType]="'svg'">
      </star-rating-comp>
    </div>
        <textarea [(ngModel)]="review" maxlength="247" style="width: 100% !important;height: 100px !important;"
                  class="form-control" [ngClass]="{'cls-upcase': review}"
                  i18n-placeholder placeholder="Enter a review (maximum characters can be 250)"
                  aria-label="Enter a review (maximum characters can be 250)" rows="5" id="comment"></textarea>
  </div>
  <hr class="p-hr">
  <div class="dialog-action">
    <div class="dialog-cancel btn btn-default"
         (click)="orderForRating.is_job_rated == 0 ? skipReview() : hideRatingDialog()" appBs>
      <ng-container i18n>Cancel</ng-container>
    </div>
    <div class="dialog-ok btn btn-default primary-theme-btn" (click)="saveDialogData()" appColor bg="'true'" appBs>
      <ng-container i18n>Save</ng-container>
    </div>
  </div>
  `,
    css: `.`
  },
  settings: {
    html: `
    <app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="headerData" *ngIf="!ecomView"></app-header-dynamic>
<div class="userRights row">
  <div class="col-xs-12">
    <div class="heading col-lg-12 col-sm-12 col-md-12 col-xs-12">
      <p class="title text-capitalize">{{langJson['GDPR Customer Rights']}}</p>
      <hr class="line" style="border-top-color: rgb(34, 150, 255);">
    </div>
  </div>
  <div class="row container">
    <div class="col-lg-6 col-sm-6 col-md-6 col-xs-12 col-lg-offset-3 col-sm-offset-3 col-md-offset-3 col-xs-offset-0">
      <form role="form" [formGroup]="userRightsForm"
            autocomplete="off" style="padding-top:30px">
        <div class="form-group">
          <select class="form-control" autocomplete="off" [ngStyle]="{ 'direction' : direction }"
                  aria-label="Pick an option"
                  required="required" formControlName="userRightOption" (change)="getChangedRight()">
            <option value="0" selected disabled ><ng-container i18n>Pick an option</ng-container></option>
            <option *ngFor="let right of userRights" [value]="right.id">{{right.name}}</option>
          </select>
          <app-control-messages-dynamic [control]="userRightsForm.controls.userRightOption"></app-control-messages-dynamic>
          <div *ngIf="errorMessage !== null" style="color: red" class="errorR">{{errorMessage}}</div>
        </div>
        <div class="form-group">
          <textarea class="form-control" autocomplete="off" rows="10" maxlength="500" aria-label="Enter Reason"
                    formControlName="description" i18n-placeholder placeholder="Enter Reason" [ngStyle]="{ 'direction' : direction }"></textarea>
          <app-control-messages-dynamic [control]="userRightsForm.controls.description"></app-control-messages-dynamic>
        </div>
        <div class="text-left">
          <button type="submit" class="btn btn-red primary-theme-btn" name="Submit" [ngStyle]="{ 'direction' : direction }" appBs appColor bg='true' (click)="registerUserRights()" [disabled]="!userRightsForm.valid || userRightsForm.value.userRightOption == 0" ><ng-container i18n>Submit</ng-container></button>
        </div>
      </form>
    </div>
  </div>
</div>

<app-dynamic-footer></app-dynamic-footer>

    `,
    css: `
    .userRights {
      font-family: ProximaNova-Regular;
      padding-bottom: 20px;
      height: auto;
      min-height: calc(100vh - 180px);
    }
    .userRights .heading {
      text-align: center;
      padding: 20px 0;
    }
    .userRights .title {
      font-size: 30px;
      line-height: 30px;
      font-weight: 300;
      letter-spacing: 0.5px;
      text-align: center;
      color: #858585;
      margin-bottom: 20px;
      display: inline-block;
    }
    .userRights .line {
      margin: 0 auto;
      width: 50px;
    }
    .userRights .container {
      margin: auto;
    }
    .userRights textarea {
      resize: vertical;
    }

    `
  },
  loyalty: {
    html: `
    <app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="appConfig"></app-header-dynamic>
    <div class="loyaltyInfo row">
    <div class="col-xs-12">
        <div class="heading">
            <p class="title" [ngStyle]="{ 'direction' : direction }">
                <ng-container>{{terminology.LOYALTY_POINTS}}</ng-container>
            </p>
            <hr class="line" [style.border-top-color]="appConfig.color" />
        </div>
    </div>


    <div class="container center-p-p" *ngIf="loyaltyCriteria">
        <div class="col-xs-12 col-sm-8 col-md-8 card-p">
            <div class="col-xs-12 col-sm-12 col-md-12 current_balance">
                <span class="points">{{loyaltyCriteria.points}} {{terminology.LOYALTY_POINTS}}</span>
                <hr class="line" [style.border-top-color]="appConfig.color" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                <div class="col-md-push-2 col-md-8 col-xs-12 gift_box">
                    <div class="col-md-12">
                        <img src="assets/img/gift-box.svg" alt="gift box" />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 get_point_box">
                        <ng-container i18n>Get</ng-container> 10
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 terminology_box">
                        <div>
                            {{terminology.LOYALTY_POINTS}}
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 min_order_box">
                        <div>
                           <ng-container i18n>on purchase of</ng-container> {{currency}} {{decimalConfigPipe(minimum_criteria)}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12 coversion_box">
                <div class="col-md-push-2 col-md-8 col-xs-12">
                    <div class="col-md-5 col-xs-5 coin_box">
                        <div class="col-md-12">
                            {{loyaltyCriteria.value_point}}
                        </div>
                        <div class="col-md-12" style="padding:0px">
                            <img src="assets/img/coins.svg"  alt="coins"  height="40px"/>
                        </div>
                    </div>
                    <div class="col-md-2 col-xs-2 equal_box" >
                        <div>=</div>
                    </div>
                    <div class="col-md-5 col-xs-5 cart_box">
                        <div class="col-md-12">
                            {{currency}} {{decimalConfigPipe(loyaltyCriteria.value_criteria)}}

                        </div>
                        <div class="col-md-12">
                            <img src="assets/img/cart-loyaty.svg" alt="loyality points" />
                        </div>

                    </div>
                    <div class="col-md-12 col-xs-12 min_order_box" style="font-size: 15px;">
                       <ng-container i18n>Use these</ng-container> {{terminology.LOYALTY_POINTS}} <ng-container i18n>on your next</ng-container> {{terminology.ORDER}}
                    </div>

                    <div class="col-xs-12" class="col-md-12 col-xs-12 min_order_box" style="font-size: 14px;" *ngIf="loyaltyCriteria && loyaltyCriteria.points && loyaltyPointsHistory && loyaltyPointsHistory.available_points">
                       {{loyaltyPointsHistory.available_points}} {{terminology.LOYALTY_POINTS}} <ng-container i18n>expiring on</ng-container> {{dateTimePipe(loyaltyPointsHistory.expiry_date)}}

                    </div>
                </div>
            </div>

            <div class="col-md-12 reward_conditions">
                <div class="col-md-12 text-center" style="padding: 25px;">
                <ng-container i18n>{{terminology.REWARD_CONDITION}}</ng-container>
                </div>
                <div class="col-md-push-3 col-md-7 col-xs-12">
                    <div class="contents">
                        1. <ng-container i18n>Minimum</ng-container> {{terminology.ORDER}} <ng-container i18n>amount required for using</ng-container> {{terminology.LOYALTY_POINTS}} <ng-container i18n>is</ng-container> {{currency}} {{decimalConfigPipe(loyaltyCriteria.min_amount)}}.
                     </div>
                     <div class="contents">
                        2. <ng-container i18n>Minimum</ng-container> {{terminology.ORDER}} <ng-container i18n>amount for Earning</ng-container> {{terminology.LOYALTY_POINTS}} <ng-container i18n>is</ng-container> {{currency}} {{decimalConfigPipe(loyaltyCriteria.min_earning_criteria)}} .
                     </div>
                     <div class="contents">
                        3. {{terminology.LOYALTY_POINTS}} <ng-container i18n>will expire after</ng-container> {{loyaltyCriteria.expiry_limit}} <ng-container i18n>days.</ng-container>
                     </div>
                     <div class="contents">
                        4. <ng-container i18n>Maximum</ng-container> {{loyaltyCriteria.max_earning}} {{terminology.LOYALTY_POINTS}} <ng-container i18n>can be earned per</ng-container> {{terminology.ORDER}}.
                     </div>
                     <div class="contents">
                        5. <ng-container i18n>Maximum</ng-container> {{loyaltyCriteria.max_usable}}% <ng-container i18n>of cart value can be paid with</ng-container> {{terminology.LOYALTY_POINTS}}.
                     </div>
                     <div class="contents">
                        6. {{terminology.LOYALTY_POINTS}} <ng-container i18n>usage will be applicable with other offers.</ng-container>
                     </div>
                     <div class="contents">
                        7. <ng-container i18n>All terms & conditions are subject to change without prior information.</ng-container>
                     </div>
                </div>
            </div>
        </div>
    </div>

  </div>

  <app-dynamic-footer></app-dynamic-footer>

    `,
    css: `
    .loyaltyInfo {
      padding-bottom: 20px;
      height: auto;
      min-height: calc(100vh - 180px);
    }

    .loyaltyInfo .heading {
      text-align: center;
      padding: 20px 0;
    }

    .loyaltyInfo .title {
      font-size: 30px;
      line-height: 30px;
      font-weight: 300;
      letter-spacing: 0.5px;
      text-align: center;
      color: #333;
      margin-bottom: 20px;
      display: inline-block;
    }

    .loyaltyInfo .line {
      margin: 0 auto;
      width: 50px;
    }

    .loyaltyInfo .center-p-p {
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      justify-content: center;
      margin: 17px auto;
      padding: 0px 15px;
    }

    .loyaltyInfo .card-p {
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 13px 25px 0 rgba(0, 0, 0, 0.1);
    }

    .loyaltyInfo .center-p {
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      justify-content: center;
      margin: 17px;
      padding: 0px 15px;
    }

    .loyaltyInfo .fg {
      font-size: 16px;
      padding: 15px;
    }

    .loyaltyInfo .linkShare {
      height: 50px;
      width: 50px;
      border-radius: 2px;
      box-shadow: 0 6px 18px 0 rgba(59, 89, 152, 0.4);
      margin: 17px;
    }

    @media only screen and (max-width: 650px) {
      .loyaltyInfo .card-p {
        padding: 0px;
        padding-bottom: 15px !important;
      }
      .loyaltyInfo .center-p-p {
        margin: 0px 10px;
      }
      .loyaltyInfo .center-p {
        margin: 0px;
        padding: 0px;
      }
      .loyaltyInfo .center-p img {
        width: 100%;
        object-fit: contain;
      }
    }

    .loyaltyInfo .cart_box {
      font-size: 20px;
    }

    .loyaltyInfo .cart_box img {
      margin-top: 10px;
    }

    .loyaltyInfo .coin_box {
      text-align: right;
      font-size: 20px;
    }

    .loyaltyInfo .coin_box img {
      margin-top: 15px;
    }

    .loyaltyInfo .equal_box {
      text-align: center;
      margin-top: 21px;
      font-size: 50px;
    }

    .loyaltyInfo .coversion_box {
      margin-top: 40px;
    }

    .loyaltyInfo .get_point_box {
      font-size: 20px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 2.6px;
      text-align: center;
      color: #3c3c3c;
      margin-top: 30px;
    }

    .loyaltyInfo .terminology_box {
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 3.2px;
      text-align: center;
      color: #3c3c3c;
      margin-top: 10px;
    }

    .loyaltyInfo .min_order_box {
      font-size: 16px;
      font-weight: 300;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #3c3c3c;
      margin-top: 10px;
    }

    .loyaltyInfo .gift_box {
      padding: 10px;
      margin-top: 70px;
      background: #f7f7f7 !important;
      padding-bottom: 50px;
    }

    .loyaltyInfo .gift_box img {
      margin-top: -50px;
      background: white;
    }

    .loyaltyInfo .current_balance {
      font-size: 20px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 2.6px;
      text-align: center;
      color: #3c3c3c;
      margin-top: 30px;
    }

    .loyaltyInfo .current_balance .points {
      padding-bottom: 5px;
    }

    .loyaltyInfo .reward_conditions {
      font-size: 20px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.7px;
      color: #3c3c3c;
      margin-top: 20px;
      padding: 10px;
    }

    .loyaltyInfo .reward_conditions .contents {
      font-size: 12px;
      font-weight: 300;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #3c3c3c;
      margin-top: 10px;
    }
    `
  },
  subscriptionInfo: {
    html: `
    <div class="subscription" *ngIf="appConfig.is_subscription_enabled && profileData.vendor_details.paid">
    <div class="row">
    <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 additionalInformation">
      <div class="additionalText text-center" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Subscription Plan</ng-container>
      </div>
    </div>

    <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
      <div class="description">
        <h3>You have paid below amount for registration.</h3>
      </div>
      <div class="col-lg-12 payStyle">
        <div>
          <span>{{curreny}}{{subscription.plan_amount}}</span>
        </div>
      </div>
    </div>
  </div>
  </div>

    `,
    css: `
    .subscription .additionalInformation {
      background: #f3f3f3;
    }

    .subscription .additionalInformation .additionalText {
      padding: 13px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
    }

    .subscription .description {
      font-family: Proximanova-Regular;
      font-size: 22px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.7px;
      text-align: center;
      color: var(--theme);
    }

    .subscription .payStyle {
      display: flex;
      justify-content: center;
      margin: 10px 0px;
    }

    .subscription .payStyle div {
      min-height: 120px;
      min-width: 120px;
      border: 2px solid var(--theme);
      background-color: #fff;
      border-radius: 50%;
      text-align: center;
      display: flex;
      font-size: 24px;
      align-items: center;
      height: auto;
      justify-content: center;
      width: auto;
    }
    `
  },
  changePassword: {
    html: `
    <form [formGroup]="changePasswordForm" class="change-password">
  <div class="nameEdit">
    <label for="oldPassword" [ngStyle]="{ 'direction' : direction }"><ng-container i18n>Current Password</ng-container></label>
    <input id="oldPassword" type="password" class="form-control" formControlName="oldPassword" placeholder="Current Password" i18n-placeholder />
    <app-control-messages-dynamic [control]="changePasswordForm.controls.oldPassword"></app-control-messages-dynamic>
  </div>
  <div class="nameEdit">
    <label for="newPassword" [ngStyle]="{ 'direction' : direction }"><ng-container i18n>New Password</ng-container></label>
    <input id="newPassword"type="{{newPasswordType}}" class="form-control" formControlName="newPassword" placeholder="New Password" (change)="changeNewPassword()" i18n-placeholder/>
    <span class="showPassword" (click)="changeInputType('1')">
      <i class="fa fa-eye" aria-hidden="true"></i>
    </span>
    <app-control-messages-dynamic [control]="changePasswordForm.controls.newPassword"></app-control-messages-dynamic>
  </div>
  <div class="nameEdit">
    <label  for="confirmPassword" [ngStyle]="{ 'direction' : direction }"><ng-container i18n>Confirm Password</ng-container></label>
    <input type="{{confirmPasswordType}}" class="form-control" id="confirmPassword" formControlName="confirmPassword" placeholder="Confirm Password" (change)="changeNewPassword()" i18n-placeholder/>
    <span class="showPassword" (click)="changeInputType('2')">
      <i class="fa fa-eye" aria-hidden="true"></i>
    </span>
    <app-control-messages-dynamic [control]="changePasswordForm.controls.confirmPassword"></app-control-messages-dynamic>
    <div *ngIf="matchPassword" style="color: red" class="errorR" i18n>Password does not match.</div>
  </div>
  <div class="saveButton text-center">
    <button class="btn backButton text-capitalize" (click)="goBack()" [ngStyle]="{ 'direction' : direction }"><ng-container i18n>Back</ng-container></button>
    <button class="btn okButton text-capitalize primary-theme-btn"   (click)="saveChangePassword()" [disabled]="!changePasswordForm.valid" [ngStyle]="{ 'direction' : direction }" ><ng-container i18n>Save</ng-container></button>
  </div>
  </form>
    `,

    css: `
    .change-password label {
      font-family: "ProximaNova-Regular";
      font-size: 12px;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #9c9c9c;
    }

    .change-password input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }

    .change-password input::-webkit-input-placeholder, .change-password input::-moz-placeholder, .change-password input:-ms-input-placeholder, .change-password input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }

    .change-password input:focus {
      outline: none;
    }

    .change-password select {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }

    .change-password select::-webkit-input-placeholder, .change-password select::-moz-placeholder, .change-password select:-ms-input-placeholder, .change-password select:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }

    .change-password select:focus {
      outline: none;
    }

    .change-password .saveButton {
      padding: 15px 0px;
    }

    .change-password .saveButton .backButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      color: #333 !important;
      background-color: #fff !important;
      border: 1px solid #ccc !important;
      border-radius: 4.8px !important;
    }

    .change-password .saveButton .okButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      border-radius: 4.8px;
      margin-left: 10px;
    }

    .change-password .nameEdit {
      position: relative;
    }

    .change-password .showPassword {
      position: absolute;
      right: 10px;
      top: 38px;
      cursor: pointer;
    }

    .change-password .showPassword:hover {
      color: var(--theme);
    }
    `
  },
  profile: {
    html: `
    <app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="headerData" *ngIf="!ecomView"></app-header-dynamic>
    <div class="profilePage row">
      <div class="col-xs-12">
        <div class="heading">
          <p class="title" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Profile</ng-container>
          </p>
          <hr class="line" [style.border-top-color]="appConfig.color" />
        </div>
      </div>

      <div class="container profileStyle">
        <div class="row" *ngIf="data">
          <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 profileP">
            <div class="row">
              <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 profileViewOnly" *ngIf="!edit && !changePasswordFlag">
                  <div class="profileNameHeading" style="margin-bottom: 20px">
                      <img [src]="data.vendor_image||'assets/img/name-icon.svg'" alt="customer image" height="130px" width="130px" class="img-circle">
                  </div>
                <div class="profileNameHeading">
                  <p>{{data.first_name}}</p>
                </div>
                <div *ngIf="appConfig.merchant_customer_rating && data && data.average_rating">
                  <star-rating-comp [readOnly]="true" [rating]="data.average_rating" [showHalfStars]="false"
                                    [starType]="'svg'"></star-rating-comp>
                </div>
                <div class="profileNumberDiv" *ngIf="data.email">
                  <p>
                    <img src="assets/img/mail.svg" aria-hidden="true" alt="mail icon" />
                    <span>{{data.email}}</span>
                  </p>
                </div>
                <div class="profileEmailDiv" *ngIf="data.phone_no">
                  <p>
                    <img src="assets/img/phone-call.svg" aria-hidden="true" alt="telephone icon" />
                    <span>{{data.phone_no}}</span>
                  </p>
                </div>
                <div class="editButton">
                  <button class="btn text-capitalize primary-theme-btn" [ngStyle]="{ 'direction' : direction }"
                          (click)="edit = true;emailCopy = data.email" ><ng-container i18n>Edit</ng-container></button>
                  <button class="btn changePassword primary-theme-btn" [ngStyle]="{ 'direction' : direction }" mat-button (click)="changePassword()" i18n>Change Password</button>
                </div>
              </div>

              <div class="col-lg-10 col-lg-offset-1 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-xs-12 profileEditView" *ngIf="changePasswordFlag">
                <app-change-password-dynamic (back)="goBackChange($event.detail)" (save)="saveChangePassword($event.detail)"></app-change-password-dynamic>
              </div>

              <div class="col-lg-10 col-lg-offset-1 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-xs-12 profileEditView" *ngIf="edit">
                  <div class="profileNameHeading text-center">
                      <img [src]="imageData || data.vendor_image||'assets/img/name-icon.svg'" alt="customer profile pic" height="130px" width="130px" class="img-circle">
                      <div class="profileNameHeading text-center" style="margin-top:-20px;">
                              <label for="upload" class="uploadIcon" aria-label="change profile image">
                                 <i class="fa fa-pencil">
                                   <span class="sr-only">Upload profile image</span>
                                 </i>
                              </label>
                              <input type="file" id="upload" accept="image/jpeg, image/png" style="visibility:hidden" (change)="onImageSelect($event)" #profileImage *ngIf="edit" aria-label="uploda profile image">
                          </div>
                  </div>
                <div class="nameEdit">
                  <label for="profile-name" [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Name</ng-container>
                  </label>
                  <input id="profile-name" class="form-control" i18n-placeholder placeholder="Enter name" [ngStyle]="{ 'direction' : direction }" [(ngModel)]="dataCopy.first_name">
                </div>
                <form [formGroup]="phoneForm" *ngIf="data">

                  <div class="nameEdit" style="margin-top:10px;">
                    <label for="profile-email"  [ngStyle]="{ 'direction' : direction }">
                      <ng-container i18n>Email</ng-container>
                    </label>
                    <input id="profile-email" class="form-control" formControlName="email" placeholder="example@gmail.com" [(ngModel)]="emailCopy" />
                  </div>


                  <div class="nameEdit" style="margin-top:10px;">
                    <label for="profile-phone"  [ngStyle]="{ 'direction' : direction }">
                      <ng-container i18n>Phone Number</ng-container>
                    </label>
                    <app-fugu-tel-input-dynamic  id="profile-phone"  class="phone_style" [ngModelOptions]="{standalone: true}" [textValue]="phoneCopy"  [country_code]="country_code"    (phoneValueChange)="phoneChange($event,phoneForm.controls.phone)"></app-fugu-tel-input-dynamic>
                    <app-control-messages-dynamic [control]="phoneForm.controls.phone"></app-control-messages-dynamic>
                  </div>
                </form>
                <div class="nameEdit" style="margin-top:10px;" *ngIf="languageArray && languageArray.length > 1">
                  <label for="profile-language"  [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Language</ng-container>
                  </label>
                  <select id="profile-language" class="form-control" [(ngModel)]="languageSelected"
                  [ngStyle]="{ 'direction' : direction }" (change)="languageChanged(languageSelected)" aria-level="select language">
                    <option *ngFor="let lang of languageArray" [value]="lang.language_code">{{lang.language_name}}</option>
                  </select>
                </div>
                <div class="saveButton text-center">
                  <button class="btn backButton text-capitalize" mat-button (click)="edit = false;image='';imageData ='';" [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Back</ng-container>
                  </button>
                  <button class="btn okButton text-capitalize primary-theme-btn"  (click)="saveEdits()" [disabled]="!phoneForm.valid"
                    [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Save</ng-container>
                  </button>
                </div>
              </div>

              <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 additionalInformation" *ngIf="templateFields && templateFields.length > 0">
                <div class="additionalText text-center" [ngStyle]="{ 'direction' : direction }">
                  <ng-container i18n>Additional Information</ng-container>
                </div>
              </div>

              <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 additionalData profileViewOnly" *ngIf="templateFields && templateFields.length > 0 && !editTemplate">
                <div class="childAdditional row">
                  <div *ngFor="let field of templateFields" class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <div *ngIf="field.data_type == 'Date' || field.data_type == 'Date-Past' || field.data_type == 'Date-Future'">
                      <div class="col-xs-12 minheightft">
                        {{field.display_name}} :
                        <span *ngIf="field.data">{{dateTimePipe(field.data,'mediumDate')}}</span>
                        <span *ngIf="!field.data">--</span>
                      </div>
                    </div>
                    <div *ngIf="field.data_type == 'Date-Time' || field.data_type == 'Datetime-Past' || field.data_type == 'Datetime-Future'">
                      <div class="col-xs-12 minheightft">
                        {{field.display_name}} :
                        <span *ngIf="field.data">{{dateTimePipe(field.data,'MMM d, y, h:mm a')}}</span>
                        <span *ngIf="!field.data">--</span>
                      </div>
                    </div>
                    <div *ngIf="field.data_type == 'Multi-Select'">
                    <div class="col-xs-12 minheightft">
                      {{field.display_name}} :
                      <span *ngIf="field.data">
                          <span *ngFor="let i of field.data"> {{i.name + ' ' }} </span>
                      </span>
                      <span *ngIf="!field.data">--</span>
                    </div>
                  </div>
                  <div *ngIf="field.data_type == 'Single-Select'">
                      <div class="col-xs-12 minheightft">
                        {{field.display_name}} :
                        <span *ngIf="field.data">
                         {{field.data.name}}
                        </span>
                        <span *ngIf="!field.data">--</span>
                      </div>
                    </div>
                    <div *ngIf="field.data_type == 'Text' || field.data_type == 'Email' || field.data_type == 'Number' || field.data_type == 'Telephone' || field.data_type == 'Checkbox' || field.data_type == 'Dropdown'">
                      <div class="col-xs-12 minheightft">
                        {{field.display_name}} :
                        <span *ngIf="field.data">{{field.data}}</span>
                        <span *ngIf="!field.data">--</span>
                      </div>
                    </div>
                  </div>
                  <div *ngFor="let fieldIm of templateFields" class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <div *ngIf="fieldIm.data_type == 'Image'">
                      <div class="col-xs-12 minheightft">
                        {{fieldIm.display_name}}
                      </div>
                      <div class="col-xs-12">
                        <span *ngIf="fieldIm.data.length" style="max-height: 100px;overflow: scroll;">
                          <img *ngFor="let img of fieldIm.data" style="height: 100px;width: 100px;margin: 5px;margin-left: 0;" [src]="img"
                          [alt]="fieldIm.display_name +' value'">
                        </span>
                        <span *ngIf="!fieldIm.data.length">
                          --
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="editButton">
                  <button class="btn text-capitalize primary-theme-btn" [ngStyle]="{ 'direction' : direction }"  (click)="editTemplateData()">
                    <ng-container i18n>Edit</ng-container>
                  </button>
                </div>
              </div>

              <div class="col-lg-10 col-lg-offset-1 col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-xs-12 profileEditView" *ngIf="editTemplate">

                <form role="form" [formGroup]="templateForm" autocomplete="off">
                  <div *ngFor="let field of templateFields">

                    <div class="nameEdit" *ngIf="field.data_type == 'Text'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <input [id]="field.display_name" type="text" autocomplete="off" [formControlName]="field.label" class="form-control" [placeholder]="field.display_name"/>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Number'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <input [id]="field.display_name" type="number" autocomplete="off" [formControlName]="field.label" class="form-control" [placeholder]="field.display_name"/>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Image'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <div>
                        <input type="file" [id]="field.label"  (change)="onFileChange($event)" #fileInput style="display:none;">
                        <button class="btn uploadFileButton primary-theme-btn" appColor hoverbgSimple="true" mat-button (click)="fileInput.click()">
                          <ng-container i18n>Upload File</ng-container>
                        </button>
                        <div style="width:100%;max-height: 100px;overflow: scroll;">
                          <div style="width:80px;height:80px;margin: 5px;margin-left: 0;float:left" *ngFor="let img of imageList[field.label];let i = index">
                            <img style="height: 100%;width: 100%;" [src]="img" [alt]="field.display_name +' value ' + i">
                            <span style="position: relative;left: 65px;bottom: 80px;background: #ddd;padding: 1px 2px;" (click)="clearFile(field.label,i)">
                              <i class="fa fa-times" style="color:red" aria-hidden="true"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Date'">
                      <label class="fontSze" [for]="field.display_name">{{field.display_name}}</label>

                      <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                  [inputId]="field.display_name" [id]="field.display_name"
                                   [readonlyInput]="true" [formControlName]="field.label"
                                   placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Date-Past'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>

                      <p-calendar  [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                   [inputId]="field.display_name" [id]="field.display_name"
                                   [maxDate]="maxDate"
                                   [readonlyInput]="true" [formControlName]="field.label"
                                   placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Date-Future'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>

                      <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                   [inputId]="field.display_name" [id]="field.display_name"
                                   [minDate]="minDate"
                                   [readonlyInput]="true" [formControlName]="field.label"
                                   placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Date-Time'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>

                      <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                   [inputId]="field.display_name" [showTime]="true" [id]="field.display_name"
                                   [hourFormat]="appConfig.time_format === timeFormat.TWELVE_HOURS ? 12 : 24"
                                   [readonlyInput]="true" [formControlName]="field.label"
                                   placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Datetime-Past'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <p-calendar [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                   [inputId]="field.display_name" [showTime]="true" [id]="field.display_name"
                                   [hourFormat]="appConfig.time_format === timeFormat.TWELVE_HOURS ? 12 : 24"
                                   [maxDate]="maxDate" [readonlyInput]="true" [formControlName]="field.label"
                                   placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Datetime-Future'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <p-calendar  [monthNavigator]="true" [yearNavigator]="true" yearRange="1900:2100"
                                   [inputId]="field.display_name" [showTime]="true" [id]="field.display_name"
                                   [hourFormat]="appConfig.time_format === timeFormat.TWELVE_HOURS ? 12 : 24"
                                   [minDate]="minDate" [readonlyInput]="true" [formControlName]="field.label"
                                   placeholder="{{field.display_name}}" [showIcon]="false"></p-calendar>
                      <div>
                      </div>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Email'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <input [id]="field.display_name" type="email" [formControlName]="field.label" class="form-control" [placeholder]="field.display_name"/>
                    </div>

                    <div id="formTelephone" class="nameEdit" *ngIf="field.data_type == 'Telephone'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <app-fugu-tel-input-dynamic  [id]="field.display_name"  class="phone_style" [textValue]="templateForm.controls[field.label].value"  [country_code]="country_code" (phoneValueChange)="phoneChange($event,templateForm.controls[field.label])"></app-fugu-tel-input-dynamic>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Checkbox'">
                      <div class="checkbox">
                        <mat-checkbox [formControlName]="field.label" [id]="field.display_name">{{field.display_name}}</mat-checkbox>
                      </div>
                    </div>

                    <div class="nameEdit" *ngIf="field.data_type == 'Dropdown'">
                      <label [ngStyle]="{ 'direction' : direction }" [for]="field.display_name">{{field.display_name}}</label>
                      <div class="dropdown">
                        <button [id]="field.display_name" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{{field.display_name}}
                          <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu">
                          <li [id]="option.id" *ngFor="let option of field.dropdown">
                            <a href="#">{{option.value}}</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <app-control-messages-dynamic *ngIf="field.data_type !== 'Image'" [control]="templateForm.controls[field.label]"></app-control-messages-dynamic>
                  </div>
                </form>

                <div class="saveButton text-center">
                  <button class="btn backButton text-capitalize" mat-button (click)="editTemplate = false;" [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Back</ng-container>
                  </button>
                  <button class="btn okButton text-capitalize primary-theme-btn" (click)="editSignupTemplate()" [disabled]="!phoneForm.valid"
                    [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Save</ng-container>
                  </button>
                </div>
              </div>


              <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12" *ngIf="profileData">
                <app-subscription-dynamic [profileData]="profileData"></app-subscription-dynamic>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <app-dynamic-footer></app-dynamic-footer>

    `,
    css: `
    .profilePage {
      padding-bottom: 20px;
      height: auto;
      min-height: calc(100vh - 180px);
    }

    .profilePage /deep/ .ui-calendar {
      font-family: 'ProximaNova-Regular';
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      /* padding: 10px; */
      font-size: 18px;
    }

    .profilePage /deep/ .ui-calendar .ui-inputtext {
      width: 100%;
      height: 100%;
    }

    .profilePage .heading {
      text-align: center;
      padding: 20px 0;
    }

    .profilePage .title {
      text-align: center;
      margin-bottom: 20px;
      display: inline-block;
      font-family: ProximaNova-Regular;
      font-size: 25px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
    }

    .profilePage .line {
      margin: 0 auto;
      width: 50px;
    }

    .profilePage .card-p {
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 13px 25px 0 rgba(0, 0, 0, 0.1);
      overflow-y: scroll;
    }

    .profilePage .center-p {
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      justify-content: center;
    }

    .profilePage .fg {
      font-size: 16px;
      padding: 15px;
    }

    .profilePage /deep/ .signup-input {
      height: auto !important;
      font-size: 14px !important;
    }

    .profilePage /deep/ .flagInput {
      background-color: white !important;
      width: 18px !important;
      text-align: center !important;
    }

    .profilePage /deep/ .flagInput button {
      outline: none;
    }

    .profilePage .minheightft {
      min-height: 40px;
      line-height: 40px;
      font-family: "ProximaNova-Regular";
      font-size: 14px;
      font-weight: 600;
    }

    .profilePage .minheightft span {
      font-weight: normal;
    }

    .profilePage .profileStyle {
      width: 600px;
      height: auto;
    }

    .profilePage .profileStyle .profileP {
      background-color: #fff;
      box-shadow: 0 2px 35px 0 rgba(0, 0, 0, 0.05);
      padding-bottom: 10px;
    }

    .profilePage .profileStyle .profileEditView {
      padding: 55px 60px;
    }

    .profilePage .profileStyle .profileEditView label {
      font-family: "ProximaNova-Regular";
      font-size: 12px;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #9c9c9c;
    }

    .profilePage .profileStyle .profileEditView input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }

    .profilePage .profileStyle .profileEditView input::-webkit-input-placeholder, .profilePage .profileStyle .profileEditView input::-moz-placeholder, .profilePage .profileStyle .profileEditView input:-ms-input-placeholder, .profilePage .profileStyle .profileEditView input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }

    .profilePage .profileStyle .profileEditView input:focus {
      outline: none;
    }

    .profilePage .profileStyle .profileEditView select {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }

    .profilePage .profileStyle .profileEditView select::-webkit-input-placeholder, .profilePage .profileStyle .profileEditView select::-moz-placeholder, .profilePage .profileStyle .profileEditView select:-ms-input-placeholder, .profilePage .profileStyle .profileEditView select:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }

    .profilePage .profileStyle .profileEditView select:focus {
      outline: none;
    }

    .profilePage .profileStyle .profileEditView .saveButton {
      padding: 15px 0px;
    }

    .profilePage .profileStyle .profileEditView .saveButton .backButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      color: #333 !important;
      background-color: #fff !important;
      border: 1px solid #ccc !important;
      border-radius: 4.8px !important;
    }

    .profilePage .profileStyle .profileEditView .saveButton .okButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      border-radius: 4.8px;
      margin-left: 10px;
    }

    .profilePage .profileStyle .profileViewOnly {
      padding: 55px 60px;
    }

    .profilePage .profileStyle .profileViewOnly .profileNameHeading {
      font-family: ProximaNova-Regular;
      font-size: 22px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      text-align: center;
    }

    .profilePage .profileStyle .profileViewOnly .profileNumberDiv {
      font-family: ProximaNova-Regular;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      padding-top: 46px;
      text-align: center;
    }

    .profilePage .profileStyle .profileViewOnly .profileNumberDiv span {
      padding-left: 22px;
    }

    .profilePage .profileStyle .profileViewOnly .profileEmailDiv {
      font-family: ProximaNova-Regular;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      padding-top: 36px;
      text-align: center;
    }

    .profilePage .profileStyle .profileViewOnly .profileEmailDiv span {
      padding-left: 22px;
    }

    .profilePage .profileStyle .profileViewOnly .editButton {
      text-align: center;
      padding-top: 46px;
    }

    .profilePage .profileStyle .profileViewOnly .editButton button {
      min-width: 143.8px;
      height: 40px;
      padding: 8px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      border-radius: 4.8px;
    }

    .profilePage .profileStyle .additionalInformation {
      background: #f3f3f3;
    }

    .profilePage .profileStyle .additionalInformation .additionalText {
      padding: 13px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
    }

    .profilePage .profileStyle .additionalData {
      padding-top: 10px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
    }

    .profilePage .input-group .fugu-tel-input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px !important;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }

    .profilePage .input-group .fugu-tel-input::-webkit-input-placeholder, .profilePage .input-group .fugu-tel-input::-moz-placeholder, .profilePage .input-group .fugu-tel-input:-ms-input-placeholder, .profilePage .input-group .fugu-tel-input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }

    .profilePage .input-group .fugu-tel-input:focus {
      outline: none;
    }

    .profilePage .input-group .flagInput {
      height: 50px !important;
    }

    .profilePage /deep/ .signup-input {
      height: 50px !important;
      font-size: 18px !important;
      font-family: "ProximaNova-Regular";
    }

    .profilePage /deep/ .flagInput {
      font-family: "ProximaNova-Regular";
      background-color: white !important;
      width: 57px !important;
      text-align: center !important;
    }

    .profilePage /deep/ .flagInput button {
      outline: none;
    }

    @media only screen and (max-width: 650px) {
      .profilePage .profileStyle {
        width: 90%;
        margin: auto;
      }
      .profilePage .profileStyle .profileViewOnly {
        padding: 25px;
      }
      .profilePage .profileStyle .profileViewOnly .profileNameHeading {
        font-size: 16px;
      }
      .profilePage .profileStyle .profileViewOnly .profileNumberDiv {
        font-size: 16px;
        padding-top: 25px;
      }
      .profilePage .profileStyle .profileViewOnly .profileNumberDiv span {
        padding-left: 8px;
      }
      .profilePage .profileStyle .profileViewOnly .profileEmailDiv {
        font-size: 16px;
        padding-top: 25px;
      }
      .profilePage .profileStyle .profileViewOnly .profileEmailDiv span {
        padding-left: 8px;
      }
      .profilePage .profileStyle .profileViewOnly .editButton {
        padding-top: 25px;
      }
      .profilePage .profileStyle .profileEditView {
        padding: 25px;
      }
    }

    .profilePage .changePassword {
      background-color: var(--theme);
      font-family: 'ProximaNova-Regular';
      color: white;
    }

    .profilePage .uploadIcon {
      margin-left: 89px;
      background: gainsboro;
      border: 1px solid darkslategrey;
      border-radius: 50%;
    }

    .profilePage .uploadIcon i {
      padding: 5px;
      color: black;
      font-size: 18px;
    }
    `
  },
  payment: {
    html: `<app-header-dynamic style="height:70px;padding: 0px;" class="col-xs-12" [headerData]="appConfig"></app-header-dynamic>

    <div class="payment-page">
    
    <div class="row">
      <div class="payment_wrapper col-xs-12">
        <div class="payment_heading">
          <p class="pmnt_title text-capitalize">{{terminology.PAYMENT}}</p>
          <hr class="pmnt_title_bar" [style.border-top-color]="appConfig.color" />
        </div>
        <div class="login-form">
          <div class="payment_card">
    
    
            <div class="pmnt_inr_hdng tp">
              <img src="assets/img/bill-icon.svg" alt="bill icon" />
              <p class="pmnt_inr_hdng_txt text-capitalize">{{terminology.BILL_SUMMARY}}</p>
            </div>
            <div class="pmnt_cnt_div pmnt_cart">
    
              <div class="pmnt_crt_div">
                <div class="pt_name">
                  <ng-container i18n>Subtotal</ng-container>
                  <div class="pt_name" *ngIf="restaurantInfo && restaurantInfo.business_type == 2" style="font-size: 13px;">
                    <span [ngStyle]="{ 'direction' : direction }" *ngIf="unitType > 1">
                      <ng-container i18n>Charge</ng-container> @ {{unitValue}}
                      <span *ngIf="unitType == 2">
                        <ng-container i18n>minute(s)</ng-container> x {{unitCount}}
                      </span>
                      <span *ngIf="unitType == 3">
                        <ng-container i18n>hour(s)</ng-container> x {{unitCount}}
                      </span>
                      <span *ngIf="unitType == 4">
                        <ng-container i18n>day(s)</ng-container> x {{unitCount}}
                      </span>
                      <span *ngIf="unitType == 5">
                        <ng-container i18n>week(s)</ng-container> x {{unitCount}}
                      </span>
                      <span *ngIf="unitType == 6">
                        <ng-container i18n>month(s)</ng-container> x {{unitCount}}
                      </span>
                      <span *ngIf="unitType == 7">
                        <ng-container i18n>year(s)</ng-container> x {{unitCount}}
                      </span>
                    </span>
                  </div>
                </div>
    
                <div class="pt_val" *ngIf="currency && userPaymentData">{{currency.symbol+''}}
                  {{decimalConfigPipe(userPaymentData.ACTUAL_AMOUNT)}}
                </div>
              </div>
    
              <div class="pmnt_crt_div_bb" *ngIf="userPaymentData && (userPaymentData.DELIVERY_CHARGE ||
              (userPaymentData.autoAppliedPromoOnDelivery && userPaymentData.autoAppliedPromoOnDelivery.length))">
                <div class="pmnt_crt_div without-border">
                  <div class="pt_name text-capitalize" *ngIf="terminology">{{langJson['Delivery Charge']}}</div>
    
                  <div class="pt_val" *ngIf="currency">
                    <span
                      *ngIf="userPaymentData.DELIVERY_CHARGE_AFTER_DISCOUNT !== undefined ;else dcWithoutDiscount">{{currency.symbol+' '}}{{decimalConfigPipe(userPaymentData.DELIVERY_CHARGE_AFTER_DISCOUNT)}}</span>
                    <ng-template #dcWithoutDiscount>{{currency.symbol+' '}}{{decimalConfigPipe(userPaymentData.DELIVERY_CHARGE)}}</ng-template>
                  </div>
                </div>
                <div class="auto_promo_div"
                  *ngIf="userPaymentData.autoAppliedPromoOnDelivery && userPaymentData.autoAppliedPromoOnDelivery.length">
                  <p class="auto_promo" *ngFor="let promo of userPaymentData.autoAppliedPromoOnDelivery">
                    {{'('+promo.description+')'}}</p>
                </div>
              </div>
    
              <div class="pmnt_crt_div" *ngFor="let tax of userTaxes">
                <div class="pt_name" *ngIf="!tax.tax_type">{{tax.tax_name+' @ '+tax.tax_percentage+'%'}}</div>
                <div class="pt_name" *ngIf="tax.tax_type">{{tax.tax_name}}</div>
    
                <div class="pt_val" *ngIf="currency&&tax.tax_amount">{{currency.symbol+''}}
                  {{decimalConfigPipe(tax.tax_amount)}}
                </div>
              </div>
    
              <div class="pmnt_crt_div_bb" *ngIf="userPaymentData && userPaymentData.discount">
                <div class="pmnt_crt_div without-border">
                  <div class="pt_name" [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Discount</ng-container>
                  </div>
    
                  <div class="pt_val" *ngIf="currency && userPaymentData">-{{currency.symbol+''}}
                    {{decimalConfigPipe(userPaymentData.discount)}}
                  </div>
                </div>
                <div class="auto_promo_div"
                  *ngIf="userPaymentData && userPaymentData.autoAppliedPromoOnSubtotal && userPaymentData.autoAppliedPromoOnSubtotal.length">
                  <p class="auto_promo" *ngFor="let promo of userPaymentData.autoAppliedPromoOnSubtotal">
                    {{'('+promo.description+')'}}</p>
                </div>
              </div>
    
              <div class="pmnt_crt_div" *ngIf="userPaymentData && userPaymentData.TIP > 0">
                <div class="pt_name" [ngStyle]="{ 'direction' : direction }">
                  <ng-container>{{terminology.TIP}}</ng-container>
                </div>
    
                <div class="pt_val" *ngIf="currency && userPaymentData">{{currency.symbol+''}}
                  {{decimalConfigPipe(userPaymentData.TIP)}}
                </div>
              </div>
              <div class="pmnt_crt_div" *ngIf="userPaymentData && userPaymentData.ADDITIONAL_AMOUNT">
                <div class="pt_name">
                  <ng-container i18n>Additional Amount</ng-container>
                </div>
    
                <div class="pt_val" *ngIf="currency && userPaymentData">{{currency.symbol+''}}
                  {{decimalConfigPipe(userPaymentData.ADDITIONAL_AMOUNT)}}
                </div>
              </div>
              <div class="pmnt_crt_div" *ngIf="userPaymentData && userPaymentData.LOYALTY_POINT_USED">
                <div class="pt_name" [ngStyle]="{ 'direction' : direction }">
                  {{terminology.LOYALTY_POINT}} <ng-container i18n>Redeemed</ng-container>
                  ({{userPaymentData.LOYALTY_POINT_USED}})
                </div>
    
                <div class="pt_val" *ngIf="currency && userPaymentData">-{{currency.symbol+''}}
                  {{decimalConfigPipe(userPaymentData.LOYALTY_POINT_DISCOUNT)}}
                </div>
              </div>
    
              <hr class="pmnt_sub_sep" />
              <div class="pmnt_subtl_div">
                <p class="pmnt_subtl_txt" [ngStyle]="{ 'direction' : direction }">
                  <ng-container i18n>TOTAL</ng-container>
                </p>
                <p class="pmnt_subtl_val" [style.color]="appConfig.color" *ngIf="currency?.symbol && userPaymentData">
                  {{currency.symbol+''}} {{decimalConfigPipe(NET_PAYABLE_AMOUNT)}}
                </p>
                <div class="clearfix"></div>
              </div>
    
              <hr class="pmnt_sub_sep" *ngIf="userPaymentData && userPaymentData.TOTAL_RECURRING_AMOUNT" />
              <div class="pmnt_subtl_div" *ngIf="userPaymentData && userPaymentData.TOTAL_RECURRING_AMOUNT">
                  <p class="pmnt_subtl_txt" [ngStyle]="{ 'direction' : direction }">
                      <ng-container i18n>Subscribed</ng-container> {{userPaymentData.OCCURRENCE_COUNT}} {{terminology.ORDERS}}
                      ({{currency.symbol+''}}{{decimalConfigPipe(NET_PAYABLE_AMOUNT)}} <ng-container i18n>will be deducted on the creation of each</ng-container> {{terminology.ORDER}})
                  </p>
                  <p class="pmnt_subtl_val"  *ngIf="currency?.symbol && userPaymentData">
                      {{currency.symbol+''}}
                      {{decimalConfigPipe(userPaymentData.TOTAL_RECURRING_AMOUNT)}}
                  </p>
                  <div class="clearfix"></div>
                </div>
    
            </div>
            <!-- ====================== only tip ====================== -->
            <div
              *ngIf="(userPaymentData && userPaymentData.TIP_ENABLE_DISABLE) && deliveryMethod == 1 && !repaymentTransaction  && !recurringEnabled">
              <div class="pmnt_inr_hdng ">
                <div class="col-xs-12 col-sm-12 p0">
                  <img src="assets/img/icon_tip.svg" alt="tip icon" width="20px" />
                  <p class="pmnt_inr_hdng_txt" [ngStyle]="{ 'direction' : direction }">
                    <ng-container>{{terminology.TIP}}</ng-container>
                  </p>
                </div>
              </div>
    
              <div class="pmnt_cnt_div pmnt_tip row m0">
                <div
                  *ngIf="userPaymentData && (userPaymentData.TIP_OPTION_ENABLE == 2 || userPaymentData.TIP_OPTION_ENABLE == 1) && userPaymentData.TIP_OPTION_LIST && userPaymentData.TIP_OPTION_LIST.length > 0">
                  <div class="col-xs-6 col-sm-4 col-lg-2 promo-col mb-5"
                    *ngFor="let tipOption of userPaymentData.TIP_OPTION_LIST; let i = index;">
                    <div class="tipOption" (click)="chooseTipOption(i)"
                      [ngClass]="{'selectedTipOption': tipOption.selected, 'nonSelectedTipOption': !tipOption.selected}">
                      <span *ngIf="userPaymentData.TIP_TYPE == 2">{{currency.symbol}}</span>
                      {{decimalConfigPipe(tipOption.value)}}
                      <span *ngIf="userPaymentData.TIP_TYPE == 1">%</span>
                    </div>
                  </div>
                </div>
                <div class="col-lg-12 col-sm-12 col-xs-12 mt10" *ngIf="userPaymentData">
                  <div class="row">
                    <form role="form" [formGroup]="tipForm" autocomplete="off" (ngSubmit)="makeTipHit(tipForm)">
    
                      <div class="col-lg-8 col-sm-8 col-xs-8">
                        <input type="text" class="form-control tipInput" (change)="changeTipValue()"
                          [attr.disabled]="userPaymentData.TIP_OPTION_ENABLE == 1 ? '' : null" formControlName="tip_value"
                          placeholder="Enter Tip Amount" aria-label="Enter Tip Amount" />
                        <app-control-messages-dynamic [control]="tipForm.controls.tip_value"></app-control-messages-dynamic>
    
                      </div>
                      <div class="col-lg-4 col-sm-4 col-xs-4">
                        <button type="submit" class="btn tipButton primary-theme-btn" >
                          <ng-container i18n>Submit</ng-container>
                        </button>
                      </div>
                    </form>
    
                  </div>
                </div>
              </div>
            </div>
    
    
            <!-- ====================== only tip ====================== -->
    
    
            <!-- ====================== promotion and tip ====================== -->
            <div
              *ngIf="!customOrderFlow && !recurringEnabled && (showPromoLink || (appConfig?.is_tip_enabled && !appConfig?.payment_step) || showReferral) && !repaymentTransaction && !((loginResponse.vendor_details.debt_amount > 0) && appConfig.is_debt_payment_compulsory)  && !debtAmountCheck">
              <div class="pmnt_inr_hdng ">
                <div class="col-xs-12; col-sm-12 p0" *ngIf="showPromoLink || showReferral">
                  <img src="assets/img/promotions-icon.svg" alt="promotion icon" />
                  <p class="pmnt_inr_hdng_txt" [ngStyle]="{ 'direction' : direction }">
                    <ng-container i18n>Promotion(s)</ng-container>
                  </p>
                  <p class="hidden-xs visible-sm visible-md visible-lg promo_p"
                    (click)="showPromoDialog('Promo')" [ngStyle]="{ 'direction' : direction }"
                    *ngIf="showReferral || showPromoLink">
                    {{terminology.ADD_A_PROMO_REFERRAL_CODE}}
                  </p>
                </div>
              </div>
    
              <div class="pmnt_cnt_div pmnt_tip row m0">
    
                <div class="col-xs-12 col-sm-12 promo-col paddingZero" *ngIf="showPromoLink || showReferral">
    
                  <!-- important component to disselect all button initially -->
                  <input type="radio" class="option-input radio" name="promoCode" aria-label="promocode" checked
                    style="display:none; visibility:hidden" />
                  <div class="promo-pay-div">
                    <div *ngFor="let promo of promoList; let i=index;">
                      <div class="promotion_div">
                        <div class="table_div">
                          <div class="table_cell_div radioB">
    
    
                            <div *ngIf="billPromo.id !== promo.id" (click)="setPromoId(promo)" style="text-align: left;">
                              <svg width="22" height="22" viewBox="0 0 22 22">
                                <path fill="#000" fill-rule="nonzero"
                                  d="M11 22C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11zm0-.846c5.608 0 10.154-4.546 10.154-10.154S16.608.846 11 .846.846 5.392.846 11 5.392 21.154 11 21.154z"
                                  opacity=".3" />
                              </svg>
                            </div>
                            <div *ngIf="billPromo?.id === promo.id" (click)="removePromoId()" style="text-align: left;">
                              <svg width="22" height="22" viewBox="0 0 22 22">
                                <g fill="none" fill-rule="nonzero">
                                  <path fill="#82C548"
                                    d="M11 22C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11z" />
                                  <path fill="#FFF"
                                    d="M14.993 7.742a.805.805 0 0 1 1.151 0 .818.818 0 0 1 0 1.146l-5.852 5.939a.803.803 0 0 1-1.147 0l-3.193-3.28a.813.813 0 0 1-.012-1.155.805.805 0 0 1 1.152 0l2.625 2.702 5.276-5.352z" />
                                </g>
                              </svg>
                            </div>
    
                          </div>
                          <div class="table_cell_div">
                            <p class="discount_text">{{promo.code}}</p>
                            <p class="discount_text_description" *ngIf="promo.isPromo">{{promo.description}}</p>
                          </div>
                        </div>
                      </div>
                      <hr *ngIf="i != (promoList.length - 1)" class="seperation_line" />
                    </div>
                    <hr *ngIf="promoList && promoList.coupons && promoList.coupons.length" class="seperation_line" />
                    <div *ngFor="let coupon of promoList.coupons">
                      <input type="radio" class="option-input radio" name="promoCode" aria-label="promocode" checked
                        style="display:none; visibility:hidden" />
                      <div class="promotion_div">
                        <div class="table_div">
                          <div class="table_cell_div radioB">
    
    
                            <div *ngIf="billPromo.id !== coupon.id" (click)="setPromoId(coupon)" style="text-align: left;">
                              <svg width="22" height="22" viewBox="0 0 22 22">
                                <path fill="#000" fill-rule="nonzero"
                                  d="M11 22C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11zm0-.846c5.608 0 10.154-4.546 10.154-10.154S16.608.846 11 .846.846 5.392.846 11 5.392 21.154 11 21.154z"
                                  opacity=".3" />
                              </svg>
                            </div>
                            <div *ngIf="billPromo?.id === coupon.id" (click)="removePromoId()" style="text-align: left;">
                              <svg width="22" height="22" viewBox="0 0 22 22">
                                <g fill="none" fill-rule="nonzero">
                                  <path fill="#82C548"
                                    d="M11 22C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11z" />
                                  <path fill="#FFF"
                                    d="M14.993 7.742a.805.805 0 0 1 1.151 0 .818.818 0 0 1 0 1.146l-5.852 5.939a.803.803 0 0 1-1.147 0l-3.193-3.28a.813.813 0 0 1-.012-1.155.805.805 0 0 1 1.152 0l2.625 2.702 5.276-5.352z" />
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div class="table_cell_div">
                            <p class="discount_text_description">{{coupon.description}}</p>
                          </div>
                        </div>
                      </div>
                      <hr class="seperation_line" />
                    </div>
                  </div>
                  <button appBs class="hidden-lg hidden-md hidden-sm visible-xs ripple p-btn add-pro primary-theme-btn"
                    hoverbgSimple='true' (click)="showPromoDialog('Promo')" *ngIf="showReferral || showPromoLink">
                    <span [ngStyle]="{ 'direction' : direction }">
    
                      {{terminology.ADD_A_PROMO_REFERRAL_CODE}}
                    </span>
                  </button>
                </div>
              </div>
            </div>
    
            <app-apply-loyalty-points-dynamic
              *ngIf="appConfig.is_loyalty_point_enabled && +userPaymentData.ACTUAL_AMOUNT && !repaymentTransaction && !((loginResponse.vendor_details.debt_amount > 0) && appConfig.is_debt_payment_compulsory)  && !debtAmountCheck && !recurringEnabled"
              [originalPoints]="userPaymentData.LOYALTY_POINTS" [maxRedemptionPoints]="userPaymentData.MAX_USABLE_POINT"
              (applyPointsEvent)="applyLoyaltyPoints($event.detail)"></app-apply-loyalty-points-dynamic>
    
    
    
            <!-- ====================== promotion and tip ====================== -->
            <div class="pmnt_inr_hdng">
              <img style="margin-top:18px;" src="assets/img/payment-icon.svg" alt="payment icon" />
              <p class="pmnt_inr_hdng_txt text-capitalize">{{terminology.PAYMENT_METHOD}}</p>
              <p class="visible-xs visible-sm visible-md visible-lg promo_p" [ngStyle]="{ 'direction' : direction }"
                appTapEffect appColor onlyColor="true" *ngIf="cardEnabled" (click)="showAddCard()">
                <span *ngIf="paymentType == 32">
                  <ng-container i18n>Add Credit Card</ng-container>
                </span>
                <span *ngIf="paymentType != 32">
                  <ng-container i18n>Add Card</ng-container>
                </span>
              </p>
            </div>
    
            <div class="pay-option">
              <div class="row">
                <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 paymentOption">
                  <div class="repeatProcess" *ngFor="let option of paymentOptions;let last = last;let first = first;">
    
                    <!-- cash on delivery -->
                    <button  *ngIf="option.value === paymentModes.CASH && option.enabled && !debtAmountCheck" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != paymentModes.CASH, 'selectedMethod':paymentType == paymentModes.CASH}"
                      class="pay_btn pay_cash " (click)="setPaymentType(paymentModes.CASH.toString())">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          {{terminology.PAY}}
                          <ng-container i18n>by Cash</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- PAY_LATER -->
                    <button  *ngIf="option.value === paymentModes.PAY_LATER && option.enabled && !debtAmountCheck"
                      style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != paymentModes.PAY_LATER, 'selectedMethod':paymentType == paymentModes.PAY_LATER}"
                      class="pay_btn pay_cash" (click)="setPaymentType(paymentModes.PAY_LATER.toString())">
                      <div class="pay_btn card_btn">
                        <div class="payByCash payByPayLater text-capitalize" [ngStyle]="{ 'direction' : direction }"
                          [tooltip]="terminology.PAY_LATER || 'Pay Later'">
                          {{terminology.PAY_LATER || 'Pay Later'}}
                        </div>
                      </div>
                    </button>
                    <!-- Paytm -->
                    <button mat-button *ngIf="option.value == paymentModes.PAYTM_LINK && option.enabled && !debtAmountCheck " style="margin-top:19px" [ngClass]="{'repeatStyle': !first || cards.length || paymentType != paymentModes.PAYTM_LINK, 'selectedMethod':paymentType == paymentModes.PAYTM_LINK}"
                    class="pay_btn pay_cash" (click)="setPaymentType(paymentModes.PAYTM_LINK.toString())">
                    <div class="pay_btn card_btn">
                      <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                        {{terminology.PAY}}
                        <ng-container i18n>by Paytm</ng-container>
                      </div>
                    </div>
                    </button>
                    <!-- BILL PLZ -->
                    <button  style="margin-top:19px" *ngIf="option.value === 512 && option.enabled"
                      class="pay_btn pay_cash"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != 512, 'selectedMethod':paymentType == 512}"
                      (click)="setPaymentType('512')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>BILL PLZ</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- razorpay -->
                    <button  *ngIf="option.value === 128 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != 128, 'selectedMethod':paymentType == 128}"
                      class="pay_btn pay_cash" (click)="setPaymentType('128', 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Card/Net Banking</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- PAYU -->
                    <button  *ngIf="option.value === 8192 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 8192, 'selectedMethod':paymentType == 8192}"
                      class="pay_btn pay_cash" (click)="setPaymentType('8192', 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Card</ng-container>
                        </div>
                      </div>
                    </button>
    
                     <!-- FAC -->
                     <!-- <button  *ngIf="option.value === 2048 && option.enabled" style="margin-top:19px"
                       [ngClass]="{'repeatStyle': !first || paymentType != 2048, 'selectedMethod':paymentType == 2048}"
                       class="pay_btn pay_cash" (click)="setPaymentType(2048, 'init')">
                       <div class="pay_btn card_btn">
                         <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                           <ng-container i18n>Pay via Card</ng-container>
                         </div>
                       </div>
                     </button> -->
                    <!-- stripeideal -->
                    <button  *ngIf="option.value === 524288 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 524288, 'selectedMethod':paymentType == 524288}"
                      class="pay_btn pay_cash" (click)="setPaymentType(524288, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Stripe Ideal</ng-container>
                        </div>
                      </div>
                    </button>
                    <!-- viva-->
                    <button  *ngIf="option.value === 2097152 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 2097152, 'selectedMethod':paymentType == 2097152}"
                      class="pay_btn pay_cash" (click)="setPaymentType(2097152, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Viva</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- credimax-->
                    <button  *ngIf="option.value == 33554432 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 33554432, 'selectedMethod':paymentType == 33554432}"
                      class="pay_btn pay_cash" (click)="setPaymentType(33554432, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Credimax</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- azul -->
                    <button  *ngIf="option.value === 2147483648 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 2147483648, 'selectedMethod':paymentType == 2147483648}"
                      class="pay_btn pay_cash" (click)="setPaymentType(2147483648, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Azul</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- fatoorah -->
                    <button  *ngIf="option.value == 8589934592 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 8589934592, 'selectedMethod':paymentType == 8589934592}"
                      class="pay_btn pay_cash" (click)="setPaymentType(8589934592, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via MyFatoorah</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- theteller -->
                    <button  *ngIf="option.value == 17179869184 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 17179869184, 'selectedMethod':paymentType == 17179869184}"
                      class="pay_btn pay_cash" (click)="setPaymentType(17179869184, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via TheTeller</ng-container>
                        </div>
                      </div>
                    </button>
    
                     <!-- paynet -->
                     <button  *ngIf="option.value == 34359738368 && option.enabled" style="margin-top:19px"
                     [ngClass]="{'repeatStyle': !first || paymentType != 34359738368, 'selectedMethod':paymentType == 34359738368}"
                     class="pay_btn pay_cash" (click)="setPaymentType(34359738368, 'init')">
                     <div class="pay_btn card_btn">
                       <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                         <ng-container i18n>Pay via Paynet</ng-container>
                       </div>
                     </div>
                   </button>
    
                   <!-- tap -->
                   <button  *ngIf="option.value == 68719476736 && option.enabled" style="margin-top:19px"
                     [ngClass]="{'repeatStyle': !first || paymentType != 68719476736, 'selectedMethod':paymentType == 68719476736}"
                     class="pay_btn pay_cash" (click)="setPaymentType(68719476736, 'init')">
                     <div class="pay_btn card_btn">
                       <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                         <ng-container i18n>Pay via Tap</ng-container>
                       </div>
                     </div>
                   </button>
    
                   <!-- payhere -->
                   <button  *ngIf="option.value === 4194304 && option.enabled" style="margin-top:19px"
                     [ngClass]="{'repeatStyle': !first || paymentType != 4194304, 'selectedMethod':paymentType == 4194304}"
                     class="pay_btn pay_cash" (click)="setPaymentType(4194304, 'init')">
                     <div class="pay_btn card_btn">
                       <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                         <ng-container i18n>Pay via Payhere</ng-container>
                       </div>
                     </div>
                   </button>
    
                    <!-- checkout.com -->
                    <button  *ngIf="option.value == 536870912 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 536870912, 'selectedMethod':paymentType == 536870912}"
                      class="pay_btn pay_cash" (click)="setPaymentType(536870912, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via checkout.com</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- mpaisa -->
                    <button  *ngIf="option.value == 8388608 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 8388608, 'selectedMethod':paymentType == 8388608}"
                      class="pay_btn pay_cash" (click)="setPaymentType(8388608, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via MPaisa</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- PayMob -->
                    <button mat-button *ngIf="option.value == 131072 && option.enabled" style="margin-top:19px" [ngClass]="{'repeatStyle': !first || paymentType != 131072, 'selectedMethod':paymentType == 131072}"
                    class="pay_btn pay_cash" (click)="setPaymentType('131072', 'init')">
                    <div class="pay_btn card_btn">
                    <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                      <ng-container>Pay via PayMob</ng-container>
                    </div>
                    </div>
                    </button>
    
                    <!-- PayNow -->
                    <button mat-button *ngIf="option.value === 1048576 && option.enabled" style="margin-top:19px" [ngClass]="{'repeatStyle': !first || paymentType != 1048576, 'selectedMethod':paymentType == 1048576}"
                    class="pay_btn pay_cash" (click)="setPaymentType('1048576', 'init')">
                    <div class="pay_btn card_btn">
                      <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                        <ng-container i18n>Pay via Paynow</ng-container>
                      </div>
                    </div>
                  </button>
    
                    <!-- WALLET -->
                    <button  *ngIf="option.value === paymentModes.WALLET && option.enabled"
                      style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != 16384, 'selectedMethod':paymentType == 16384}"
                      class="pay_btn pay_cash" (click)="setPaymentType('16384', 'init')">
                      <div class="pay_btn card_btn" *ngIf="walletDetails">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay Via Wallet</ng-container><br />
                          <span style="font-size: 12px;">
                            <ng-container i18n>Wallet Balance</ng-container>:
                            {{currency?.symbol}}{{decimalConfigPipe(walletDetails.wallet_balance)}}
                          </span>
                        </div>
                      </div>
                    </button>
    
                    <!-- PAYTM -->
                    <button  *ngIf="option.value === 64 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != 64, 'selectedMethod':paymentType == 64}"
                      class="pay_btn pay_cash" (click)="setPaymentType('64', 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Paytm</ng-container><br />
                          <span style="font-size: 12px;"
                            *ngIf="paytmData && paytmData.wallet_balance >= 0 && paytmData.paytm_verified">
                            <ng-container i18n>Wallet Balance</ng-container>:
                            {{currency?.symbol}}{{decimalConfigPipe(paytmData.wallet_balance)}}
                          </span>
                        </div>
                      </div>
                    </button>
    
                    <!-- Paypal -->
                    <button  *ngIf="option.value === 4 && option.enabled" style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != 4, 'selectedMethod':paymentType == 4}"
                      class="pay_btn pay_cash" (click)="setPaymentType(4, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Paypal</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- Paystack -->
                    <button mat-button *ngIf="option.value === 256 && option.enabled" style="margin-top:19px"
                    [ngClass]="{'repeatStyle': !first || paymentType != 256, 'selectedMethod':paymentType == 256}"
                    class="pay_btn pay_cash" (click)="setPaymentType(256, 'init')">
                    <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                            <ng-container i18n>Pay via Paystack</ng-container>
                        </div>
                    </div>
                    </button>
    
                    <!-- INNSTAPAY -->
                    <button  *ngIf="option.value === paymentModes.INNSTAPAY && option.enabled"
                      style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != paymentModes.INNSTAPAY, 'selectedMethod':paymentType == paymentModes.INNSTAPAY}"
                      class="pay_btn pay_cash" (click)="setPaymentType(paymentModes.INNSTAPAY, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Card</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- PAYFAST -->
                    <button  *ngIf="option.value === paymentModes.PAYFAST && option.enabled"
                      style="margin-top:19px"
                      [ngClass]="{'repeatStyle': !first || paymentType != paymentModes.PAYFAST, 'selectedMethod':paymentType == paymentModes.PAYFAST}"
                      class="pay_btn pay_cash" (click)="setPaymentType(paymentModes.PAYFAST, 'init')">
                      <div class="pay_btn card_btn">
                        <div class="payByCash text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Pay via Card</ng-container>
                        </div>
                      </div>
                    </button>
    
                    <!-- Add Paytm money -->
                    <button
                      *ngIf="option.value === 64 && option.enabled && paytmData && paytmData.paytm_verified"
                      style="margin-top:19px;margin-left: 20px;"
                      [ngClass]="{'repeatStyle': !first || cards.length || paymentType != 64, 'selectedMethod':paymentType == 64}"
                      class="pay_btn pay_cash" (click)="addPaytmMoney(paytmData.paytm_add_money_url)">
                      <div class="pay_btn card_btn">
                        <div class="payByCash mar-box-20 text-capitalize" [ngStyle]="{ 'direction' : direction }">
                          <ng-container i18n>Add Paytm money</ng-container><br />
                          <span style="font-size: 12px;"
                            *ngIf="paytmData && paytmData.wallet_balance >= 0 && paytmData.paytm_verified">
                            <ng-container i18n>Wallet Balance</ng-container>
                          </span>
                        </div>
                      </div>
                    </button>
    
                    <!-- added card list STRIPE ,PAYFORT, AUTHORIZE_NET,VISTA_MONEY, FAC-->
                    <div
                      *ngIf="(option.value === 2 || option.value===32 || option.value == paymentModes.AUTHORIZE_NET || option.value == paymentModes.VISTA || option.value == paymentModes.FAC) && option.enabled && cards.length > 0"
                      class="paymentOption">
                      <div class="repeatProcess" *ngFor="let card of cards; let first = first;">
                        <div class="removeCard">
                          <i class="fa fa-trash-o fa-lg" aria-hidden="true" style="cursor: pointer;"
                            (click)="removeCard(card, option.value)"></i>
                        </div>
                        <button
                          [ngClass]="{'repeatStyle': paymentType != 2 || selectedCardId != card.card_id, 'selectedMethod': ((paymentType == 2||paymentType==32 || paymentType == paymentModes.AUTHORIZE_NET || paymentType == paymentModes.VISTA || paymentType == paymentModes.FAC) && selectedCardId == card.card_id)}"
                          (click)="selectedCard(card.card_id);setPaymentType(option.value,'init');">
                          <div class="pay_btn card_btn">
                            <div class="cardText">
                              <span class="cnt_dot">....</span> {{card.last4_digits}}
                            </div>
    
                          </div>
                        </button>
                      </div>
                    </div>
    
    
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
    
    
          </div>
    
          <!-- ====================== submit button ====================== -->
          <button (click)="taskViaPayment()" appBs class="pmnt_proceed_pay ripple text-capitalize"
            [style.background-color]="appConfig.color" *ngIf="!isPlatformServer">
            {{terminology.PAY}}
            <ng-container *ngIf="userPaymentData">{{currency?.symbol+''}} {{decimalConfigPipe(NET_PAYABLE_AMOUNT)}}
            </ng-container>
          </button>
        </div>
      </div>
    </div>
    
    
    <div class="parent-dialog" *ngIf="dialog?.show">
      <div class="content-dialog">
        <div class="dialog-title">
          <span>{{dialog?.title}}</span>
        </div>
        <div class="dialog-msg">
          <input type="text" [(ngModel)]="dialog.value" *ngIf="dialog.key=='Promo'" class="form-control" i18n-placeholder
            placeholder="Enter promocode" [class.has-error]="dialog.error && !dialog.value"
            [ngClass]="{'cls-upcase':dialog.value}" aria-label="Enter promocode" />
          <div class="error-msg" style="font-size: 14px;color: red;letter-spacing: 0.5px;line-height: 24px;"
            *ngIf="dialog.error && !dialog.value">
            <ng-container i18n>This field is required</ng-container>
          </div>
        </div>
        <hr class="p-hr">
        <div class="dialog-action">
          <button  class="dialog-cancel btn btn-default" (click)="hideDialog()"
            [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Cancel</ng-container>
          </button>
          <button  class="dialog-ok btn btn-default primary-theme-btn" (click)="saveDialogData()"
            [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Submit</ng-container>
          </button>
        </div>
      </div>
      <div class="back-dialog"></div>
    </div>
    
    <div class="card-dialog" [ngStyle]="{'display':cardBool ? 'block':'none'}"
      style="padding-top: 100px;display: flex;justify-content: center">
      <form #cardForm="ngForm" (ngSubmit)="getCardToken(cardForm.value,$event)" class="checkout">
        <div class="form-row">
          <label for="card-info" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Card Info</ng-container>
          </label>
          <div id="card-info" #cardInfo></div>
    
          <div id="card-errors" role="alert" *ngIf="error" style="margin-top: 5px">{{ error }}</div>
        </div>
        <div class="pay-btn-div">
          <button  class="pay-btn ripple pt-13 cancel-btn stripe-add-card-btn" type="button" [ngStyle]="{ 'direction' : direction }"
            style="margin-top: 10px" (click)="resetCard()">
            <ng-container i18n>Cancel</ng-container>
          </button>
          <button  class="pay-btn ripple add-card primary-theme-btn stripe-add-card-btn" style="color:white;margin-top: 10px"
            [class.half-opacity]="!cardForm.valid">
            <span class="login_continue_text" [ngStyle]="{ 'direction' : direction }">
              <ng-container i18n>Add Card</ng-container>
            </span>
          </button>
        </div>
    
      </form>
    </div>
    
    <!-- azulModal -->
    <app-modal-dynamic *ngIf="azulModal" [modalType]="modalType" (onClose)="azulModal = false"
      (esc)="azulModal = false">
      <div body>
        <div class="container-fluid azul-modal">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideAzulPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-azul [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-azul>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- fatoorahModal -->
    <app-modal-dynamic *ngIf="fatoorahModal" [modalType]="modalType" (onClose)="fatoorahModal = false"
      (esc)="fatoorahModal = false">
      <div body>
        <div class="container-fluid fatoorah-modal">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideFatoorahPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-my-fatoora [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-my-fatoora>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- thetellerModal -->
    <app-modal-dynamic *ngIf="thetellerModal" [modalType]="modalType" (onClose)="thetellerModal = false"
      (esc)="thetellerModal = false">
      <div body>
        <div class="container-fluid">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideThetellerPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-theteller [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-theteller>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- paynetModal -->
    <app-modal-dynamic *ngIf="paynetModal" [modalType]="modalType" (onClose)="paynetModal = false"
      (esc)="paynetModal = false">
      <div body>
        <div class="container-fluid">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hidePaynetPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-paynet [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-paynet>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <app-modal-dynamic *ngIf="tapModal" [modalType]="modalType" (onClose)="tapModal = false"
      (esc)="tapModal = false">
      <div body>
        <div class="container-fluid">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideTapPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-tap [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-tap>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- payHereModal -->
    <app-modal-dynamic *ngIf="payHereModal" [modalType]="modalType" (onClose)="payHereModal = false"
      (esc)="payHereModal = false">
      <div body>
        <div class="container-fluid payhere-modal">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hidepayherePopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-payhere [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-payhere>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- credimaxModal -->
    <app-modal-dynamic *ngIf="credimaxModal" [modalType]="modalType" (onClose)="credimaxModal = false"
      (esc)="credimaxModal = false">
      <div body>
        <div class="container-fluid">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideCredimaxPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-credimax [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-credimax>
          </div>
        </div>
    
      </div>
    </app-modal-dynamic>
    
    <!-- checkoutComModal -->
    <app-modal-dynamic *ngIf="checkoutComModal" [modalType]="modalType" (onClose)="checkoutComModal = false"
      (esc)="checkoutComModal = false">
      <div body>
        <div class="container-fluid">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideCheckoutComPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-checkout-com [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-checkout-com>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- add card payfort -->
    <app-modal-dynamic *ngIf="payfortBool" [modalType]="modalType" (esc)="hidePayFortPopup()"
      (onClose)="hidePayFortPopup()">
      <div body>
        <div class="row" style="padding: 10px">
          <div class="col-md-12 text-right">
            <span (click)="hidePayFortPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
          </div>
          <div class="col-md-12 text-center">
            <h4>
              <ng-container i18n>Add Card</ng-container>
            </h4>
          </div>
          <div class="col-md-12">
            <iframe id="payfortIframe" style="border: none" #payfortIframe [src]="payfortlink" height="610px" width="100%"
              (load)="getContentPayfort(payfortIframe)"></iframe>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- cvvPayfort modal -->
    <app-modal-dynamic *ngIf="cvvPayfort" [modalType]="'modal-sm'" (onClose)="cvvPayfort = false"
      (esc)="cvvPayfort = false">
      <div body>
        <div class="row" style="padding: 10px">
          <form validate="" (ngSubmit)="cvvPayfortSubmit()">
            <div class="col-md-12 text-right">
              <span (click)="hideCvvPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <div class="col-md-12 text-center">
              <h4>
                <ng-container i18n>Enter CVV</ng-container>
              </h4>
            </div>
            <div class="col-md-12">
              <input type="number" class="form-control" [(ngModel)]="cvvPay" [ngModelOptions]="{standalone: true}"
                i18n-placeholder placeholder="Enter CVV" aria-label="Enter CVV" required>
            </div>
            <div class="col-md-12 text-right" style="padding: 17px">
              <button class="btn btn-primary" i18n>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- razorPayModal -->
    <app-modal-dynamic *ngIf="razorPayModal" [modalType]="modalType" (onClose)="razorPayModal = false"
      (esc)="razorPayModal = false">
      <div body>
        <div class="row" style="padding: 10px">
          <div class="col-md-12 text-right">
            <span (click)="close3dver()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
          </div>
          <div class="col-md-12">
            <iframe id="razorPayPop" style="border: none" #razorPayPop [src]="razorPayUrl" height="610px" width="100%"
              (load)="getContentPayfort(payfortIframe)"></iframe>
          </div>
    
        </div>
      </div>
    </app-modal-dynamic>
    
    <app-modal-dynamic *ngIf="paytmOtpPop" [modalType]="'modal-sm'" (onClose)="paytmOtpPop = false"
      (esc)="paytmOtpPop = false">
      <div body>
        <div class="row" style="padding: 10px">
          <form [formGroup]="paytmForm" (ngSubmit)="paytmOtpSubmit()">
            <div class="col-md-12 text-right">
              <span (click)="hidePaytmPopup()" style="cursor: pointer;" class="fa fa-times"
                [ngStyle]="{'direction':direction}"></span>
            </div>
            <div class="col-md-12 text-center">
              <h4>
                <ng-container i18n>Enter OTP</ng-container>
              </h4>
            </div>
            <div class="col-md-12">
              <input type="text" class="form-control" appNumberOnly formControlName="otp" i18n-placeholder
                placeholder="Enter OTP" aria-label="Enter OTP" maxlength="6">
              <app-control-messages-dynamic [control]="paytmForm.controls.otp"></app-control-messages-dynamic>
            </div>
            <div class="col-md-12 text-right" style="padding: 17px">
              <button class="btn btn-primary primary-theme-btn" i18n>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </app-modal-dynamic>
    <!-- add paytm money -->
    <app-modal-dynamic *ngIf="paytmAddMoneyPopup" [modalType]="'modal-lg'" (esc)="hidePaytmMoneyPopup()"
      (onClose)="hidePaytmMoneyPopup()">
      <div body>
        <div class="row" style="padding: 10px">
          <div class="col-md-12 text-right">
            <span (click)="hidePaytmMoneyPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
          </div>
          <div class="col-md-12 text-center">
            <h4>
              <ng-container i18n>Add Card</ng-container>
            </h4>
          </div>
          <div class="col-md-12">
            <iframe id="paytmAddMoney" style="border: none" #paytmAddMoney [src]="paytmAddMoneylink" height="610px"
              width="100%" (load)="getContentPayfort(paytmAddMoney)"></iframe>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- billPlzModal  -->
    <app-modal-dynamic *ngIf="billPlzModal" header="Enter Description" [modalType]="'modal-sm'"
      (onClose)="billPlzModal = false" (esc)="billPlzModal = false">
      <div body>
        <div class="row" style="padding: 10px">
          <form [formGroup]="billPlzForm" (ngSubmit)="payViaBillPlz()">
            <div class="col-md-12">
              <input type="text" class="form-control" formControlName="billPlzMsgInput" i18n-placeholder
                placeholder="Enter message" aria-label="Enter message" minlength="3">
            </div>
            <div class="col-md-12 text-right" style="padding: 17px">
              <button class="btn btn-primary primary-theme-btn" i18n>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </app-modal-dynamic>
    
    <!-- facModal -->
    <app-modal-dynamic *ngIf="facModal" [modalType]="modalType" (onClose)="facModal = false" (esc)="facModal = false">
        <div body>
            <div class="container-fluid fac-modal">
            <!-- <div class="container-fluid fac-modal"> -->
                    <div class="row" style="padding: 10px">
                        <div class="col-md-12 text-right">
                            <span (click)="hideFacPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
    
                        </div>
    
                        <div class="col-md-12 text-center">
                            <h4>
                              <ng-container i18n>Add Card</ng-container>
                            </h4>
                          </div>
                          <div class="col-md-12">
                              <iframe id="facIframe" style="border: none" #facIframe [src]="facUrl" height="610px" width="100%"
                                (load)="getContentFac(facIframe)"></iframe>
                          </div>
    
                    </div>
            </div>
            <!-- </div> -->
    
        </div>
    </app-modal-dynamic>
    
    
    <!-- vista money -->
    <app-modal-dynamic *ngIf="vistaModal" [modalType]="modalType" (onClose)="vistaModal = false" (esc)="vistaModal = false">
        <div body>
            <div class="container-fluid fac-modal">
            <!-- <div class="container-fluid fac-modal"> -->
                    <div class="row" style="padding: 10px">
                        <div class="col-md-12 text-right">
                            <span (click)="hideVistaPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
    
                        </div>
    
                        <div class="col-md-12 text-center">
                            <h4>
                              <ng-container i18n>Add Card</ng-container>
                            </h4>
                          </div>
                          <div class="col-md-12">
                              <iframe id="vistaIframe" style="border: none" #vistaIframe [src]="vistaUrl" height="610px" width="100%"
                                (load)="getContentFac(vistaIframe)"></iframe>
                          </div>
    
                    </div>
            </div>
            <!-- </div> -->
    
        </div>
    </app-modal-dynamic>
    <!-- paypalModal -->
    <app-modal-dynamic *ngIf="paypalModal" [modalType]="modalType" (onClose)="paypalModal = false"
      (esc)="paypalModal = false">
      <div body>
        <div class="container-fluid paypal-modal">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hidePaypalPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-paypal-dynamic [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" [paymentFor]="'0'"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-paypal-dynamic>
          </div>
        </div>
    
      </div>
    </app-modal-dynamic>
    
    <!-- paystackModal -->
    <app-modal-dynamic *ngIf="paystackModal" [modalType]="modalType" (onClose)="paystackModal = false" (esc)="paystackModal = false">
        <div body>
            <div class="container-fluid paypal-modal">
                    <div class="row" style="padding: 10px">
                        <div class="col-md-12 text-right">
                            <span (click)="hidePaystackPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
                        </div>
                        <app-paystack-dynamic [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
                                    [paymentFor]="'0'"
                                    (paymentMadeResponse)="paymentResponse($event.detail)"
                                    [triggerPayment]="triggerPayment"
                                    [loginResponse]="sessionService.get('appData')"></app-paystack-dynamic>
                    </div>
            </div>
    
        </div>
    </app-modal-dynamic>
    
    
    <!-- payuModal -->
    <app-payu-dynamic *ngIf="payuModal" [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
      (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
      [loginResponse]="sessionService.get('appData')"></app-payu-dynamic>
    
    
      <!-- payMob -->
      <app-paymob-dynamic *ngIf="payMobModal" [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
      (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
      [loginResponse]="sessionService.get('appData')"></app-paymob-dynamic>
    
    
    
      <!-- paynowModal -->
      <app-paynow-dynamic *ngIf="paynowModal" [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
        (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
        [loginResponse]="sessionService.get('appData')"></app-paynow-dynamic>
        <!-- stripeidealModal -->
        <app-stripeideal-dynamic *ngIf="stripeIdealModal" [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
          (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
          [loginResponse]="sessionService.get('appData')"></app-stripeideal-dynamic>
          <!-- Viva -->
          <app-viva *ngIf="vivaModal" [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
            (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment" [paymentFor]="'0'"
            [loginResponse]="sessionService.get('appData')"></app-viva>
    
          <!-- mapaisa -->
          <app-modal-dynamic *ngIf="mpaisaModal" [modalType]="modalType" (onClose)="mpaisaModal = false" (esc)="mpaisaModal = false">
              <div body>
                  <div class="container-fluid fac-modal">
                          <div class="row" style="padding: 10px">
                              <div class="col-md-12 text-right">
                                  <span (click)="hideMPaisaPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
                              </div>
                              <app-mpaisa-dynamic [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT" (paymentMadeResponse)="paymentResponse($event.detail)"
                                       [triggerPayment]="triggerPayment" [loginResponse]="sessionService.get('appData')"></app-mpaisa-dynamic>
                          </div>
                  </div>
    
              </div>
          </app-modal-dynamic>
    <!-- innstapayModal -->
    <app-modal-dynamic *ngIf="innstapayModal" [modalType]="modalType" (onClose)="innstapayModal = false"
      (esc)="innstapayModal = false">
      <div body>
        <div class="container-fluid innstapay-modal">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideInnstapayPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-innstapay-dynamic [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-innstapay-dynamic>
          </div>
        </div>
    
      </div>
    </app-modal-dynamic>
    
    <!-- payFastModal -->
    <app-modal-dynamic *ngIf="payFastModal" [modalType]="modalType" (onClose)="payFastModal = false"
      (esc)="payFastModal = false">
      <div body style="min-height: 500px;">
        <div class="container-fluid payfast-modal">
          <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hidePayFastPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <app-payfast-dynamic [NET_PAYABLE_AMOUNT]="NET_PAYABLE_AMOUNT"
              (paymentMadeResponse)="paymentResponse($event.detail)" [triggerPayment]="triggerPayment"
              [loginResponse]="sessionService.get('appData')"></app-payfast-dynamic>
          </div>
        </div>
    
      </div>
    </app-modal-dynamic>
    
    
    <!-- authorizeNetModal -->
    <app-modal-dynamic *ngIf="authorizeNetModal" [modalType]="modalType" (esc)="hideAuthorizeNetPopup()"
      (onClose)="hideAuthorizeNetPopup()">
      <div body>
        <div class="row" style="padding: 10px">
          <div class="col-md-12 text-right">
            <span (click)="hideAuthorizeNetPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
          </div>
          <div class="col-md-12 text-center">
            <h4>
              <ng-container i18n>Add Card</ng-container>
            </h4>
          </div>
          <div class="col-md-12">
            <iframe id="authorizeNetIframe" style="border: none" #authorizeNetIframe [src]="authorizeNetUrl" height="610px"
              width="100%" (load)="getContentAuthorize(authorizeNetIframe)"></iframe>
          </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    
    <app-hold-overlay-dynamic *ngIf="holdPaymentCheck" (gotItEvent)="gotItEvent($event.detail)" [clickedFrom]="holdType"
      [list]="userPaymentData"></app-hold-overlay-dynamic>
    
      <app-modal-dynamic *ngIf="showPhoneNumberPopupForPaytm" header= "Confirm Payment via Paytm" [modalType]="modalType" (esc)="hidePaytmPhoneNumberPopup()" (onClose)="hidePaytmPhoneNumberPopup()">
      <div body style="padding: 15px 30px;">
        <form [formGroup]="paytmNumberForm">
          <label class="popup-text">Please confirm your mobile number to proceed. Your order will be placed right away, but will be fulfilled subject to payment confirmation.</label>
          <app-fugu-tel-input-dynamic class="phone_style" [textValue]="phoneCopy"  [country_code]="country_code" [(dialCode)]="country_code" (phoneValueChange)="phoneChange($event,paytmNumberForm.controls.phone_number)"></app-fugu-tel-input-dynamic>
          <app-control-messages [control]="paytmNumberForm.controls.phone_number"></app-control-messages>
          <div class="col-12 text-right wallet-action-btn paytm-btn" style="padding-top: 25px">
            <button class="btn btn-primary add-now-btn" style="margin-right : 15px" (click)="savePaytmNumber()" i18n>Save</button>
            <button class="btn btn-primary" (click)="hidePaytmPhoneNumberPopup()" i18n>Cancel</button>
          </div>
        </form>
      </div>
    </app-modal-dynamic>
      <app-modal-dynamic *ngIf="walletAddMoneyPopup" [modalType]="'modal-sm'">
      <div body>
        <div class="row" style="padding: 10px">
            <div class="col-md-12 text-right">
              <span (click)="hideWalletAddMoneyPopup()" class="fa fa-times" [ngStyle]="{'direction':direction}"></span>
            </div>
            <div class="col-md-12 text-center">
              <h4>
                <ng-container i18n>Do you want to add money now ?</ng-container>
              </h4>
            </div>
            <div class="col-md-12 text-right wallet-action-btn" style="padding: 17px">
              <button class="btn btn-primary add-now-btn" (click)="addNow()" i18n>Add Now</button>
              <button class="btn btn-primary" (click)="addLater()" i18n>Add Later</button>
    
            </div>
        </div>
      </div>
    </app-modal-dynamic>
    
    
    </div>
    <app-dynamic-footer></app-dynamic-footer>
    `,
    css: `
    .payment-page .mb-5 {
      margin-bottom: 5px;
    }

    .payment-page .payment_wrapper {
      height: 100%;
      background-color: #fafafa;
    }

    .payment-page .payment_heading {
      padding: 20px 0 25px;
      text-align: center;
    }

    .payment-page .pmnt_title {
      font-size: 30px;
      line-height: 30px;
      font-weight: 300;
      letter-spacing: 0.5px;
      text-align: left;
      color: #333;
      margin-bottom: 20px;
      display: inline-block;
    }

    .payment-page .pmnt_title_bar {
      margin: 0 auto;
      width: 50px;
      border-top: 2px solid #e13d36;
    }

    .payment-page .payment_card {
      width: calc(100% - 60px);
      margin: 0 auto;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 2px 35px 0 rgba(0, 0, 0, 0.05);
    }

    @media screen and (min-width: 1060px) {
      .payment-page .payment_card {
        width: 1000px;
      }
    }

    @media screen and (max-width: 650px) {
      .payment-page .payment_card {
        width: calc(100% - 38px) !important;
      }
    }

    .payment-page .mt10 {
      margin-top: 10px;
    }

    .payment-page .tipInput {
      height: 40px;
      font-family: 'ProximaNova-Regular';
      font-size: 16px;
    }

    .payment-page .tipOption {
      padding: 10px 10px;
      border: 1px solid rgba(0, 0, 0, 0.87);
      font-family: 'ProximaNova-Regular';
      text-align: center;
      font-size: 15px;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.87);
    }

    .payment-page .selectedTipOption {
      border: 1px solid #27b74b;
      color: #27b74b;
    }

    .payment-page .nonSelectedTipOption {
      border: 1px solid rgba(0, 0, 0, 0.87);
      color: rgba(0, 0, 0, 0.87);
    }

    .payment-page .pmnt_inr_hdng {
      width: 100%;
      height: 50px;
      background-color: rgba(51, 51, 51, 0.05);
      border: solid 0.5px rgba(51, 51, 51, 0.1);
      box-sizing: border-box;
    }

    .payment-page .pmnt_inr_hdng.tp {
      border-radius: 5px 5px 0 0;
    }

    .payment-page .pmnt_inr_hdng .pmnt_clr {
      margin: 10px 20px 10px 0;
      width: 70px;
      height: 30px;
      background-color: #fff;
      border: solid 1px #e1e1e1;
      float: right;
    }

    .payment-page .pmnt_inr_hdng .pmnt_clr .pmnt_clear_txt {
      color: #e13d36;
      display: block;
      text-align: center;
      line-height: 25px;
      height: 28px;
    }

    .payment-page .pmnt_inr_hdng img {
      margin: 14.5px 12px 14.5px 20px;
      float: left;
    }

    .payment-page .pmnt_inr_hdng p {
      font-size: 19px;
      font-family: 'ProximaNova-Regular';
      letter-spacing: 0.5px;
      margin-bottom: 0;
    }

    .payment-page .pmnt_inr_hdng p.pmnt_inr_hdng_txt {
      float: left;
      color: #333;
      text-align: left;
      line-height: 48px;
    }

    .payment-page .pmnt_inr_hdng p.pmnt_inr_hdng_txt_new {
      float: left;
      color: #333;
      text-align: left;
      line-height: 48px;
      margin-left: 310px;
    }

    @media only screen and (max-width: 768px) and (min-width: 600px) {
      .payment-page .pmnt_inr_hdng_txt_new {
        float: none !important;
        color: #333;
        text-align: right !important;
        line-height: 48px;
        margin-left: 0px !important;
        margin-right: 13px !important;
      }
    }

    @media only screen and (max-width: 599px) and (min-width: 450px) {
      .payment-page .pmnt_inr_hdng_txt_new {
        float: none !important;
        color: #333;
        text-align: right !important;
        line-height: 48px;
        margin-left: 0px !important;
        margin-right: 13px !important;
      }
      .payment-page .pmnt_inr_hdng p {
        font-size: 15px !important;
      }
    }

    @media only screen and (max-width: 449px) and (min-width: 400px) {
      .payment-page .pmnt_inr_hdng_txt_new {
        float: none !important;
        color: #333;
        text-align: right !important;
        line-height: 48px;
        margin-left: 0px !important;
        margin-right: 13px !important;
      }
      .payment-page .pmnt_inr_hdng p {
        font-size: 15px !important;
      }
    }

    @media only screen and (max-width: 399px) and (min-width: 300px) {
      .payment-page .pmnt_inr_hdng_txt_new {
        float: none !important;
        color: #333;
        text-align: right !important;
        line-height: 48px;
        margin-left: 0px !important;
        margin-right: 13px !important;
      }
      .payment-page .pmnt_inr_hdng p {
        font-size: 15px !important;
      }
    }

    .payment-page .m0 {
      margin: 0;
    }

    .payment-page .pmnt_cnt_div {
      background: #fff;
    }

    .payment-page .pmnt_cnt_div.pmnt_cart {
      padding: 30px 50px;
    }

    .payment-page .pmnt_cnt_div.pmnt_tip {
      padding: 15px 40px 15px;
    }

    @media screen and (max-width: 767px) {
      .payment-page .pmnt_cnt_div.pmnt_cart {
        padding: 30px 20px;
      }
      .payment-page .pmnt_cnt_div.pmnt_tip {
        padding: 30px 20px 0px;
      }
    }

    @media screen and (max-width: 500px) {
      .payment-page .pmnt_cnt_div.pmnt_cart {
        padding: 30px 15px;
      }
      .payment-page .pmnt_cnt_div.pmnt_tip {
        padding: 30px 15px;
      }
    }

    .payment-page .pmnt_crt_div_bb {
      border-bottom: 1px solid #ddd;
    }

    .payment-page .pmnt_crt_div {
      padding-bottom: 10px;
      display: table;
      width: 100%;
      table-layout: fixed;
      border-bottom: 1px solid #ddd;
      padding-top: 10px;
    }

    .payment-page .pmnt_crt_div.without-border {
      border-bottom: 0;
    }

    .payment-page .pmnt_crt_div:last-child {
      border-bottom: 1px solid #000 !important;
    }

    .payment-page .pmnt_crt_div div {
      display: table-cell;
      vertical-align: middle;
      font-size: 16px;
      letter-spacing: 0.4px;
    }

    .payment-page .pmnt_crt_div div.pt_name {
      width: 50%;
      text-align: left;
      color: rgba(0, 0, 0, 0.87);
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
    }

    .payment-page .pmnt_crt_div div.pt_coln {
      width: 20px;
      opacity: 0.5;
      text-align: center;
      color: #333;
    }

    .payment-page .pmnt_crt_div div.pt_val {
      width: 50%;
      text-align: right;
      color: #868686;
      font-family: 'ProximaNova-Regular';
      font-size: 14px;
      letter-spacing: 0.4px;
    }

    .payment-page .auto_promo_div {
      max-width: 80%;
    }

    .payment-page .auto_promo_div .auto_promo {
      color: #82c548;
      font-size: 12px;
    }

    .payment-page .tax_sep {
      width: 80%;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      margin: 20px auto;
    }

    .payment-page .pmnt_sub_sep {
      width: 100%;
      border-top: 1px solid white;
      margin: 15px 0;
    }

    .payment-page .pmnt_subtl_div p {
      margin: 0;
      line-height: 22px;
      font-size: 15px;
      letter-spacing: 0.5px;
      text-align: left;
      font-family: ProximaNova-Regular;
    }

    .payment-page .pmnt_subtl_div .pmnt_subtl_txt {
      float: left;
      color: rgba(0, 0, 0, 0.87);
    }

    .payment-page .pmnt_subtl_div .pmnt_subtl_val {
      float: right;
      color: #e13d36;
    }

    .payment-page .p0 {
      padding: 0;
    }

    .payment-page .tip-col {
      padding: 0 0 0 45px;
    }

    .payment-page .payment_wrapper .promotion_div {
      padding: 0px;
    }

    .payment-page .payment_wrapper .promotion_div p {
      margin: 0;
      word-break: break-word;
    }

    .payment-page .payment_wrapper .promotion_div input[type="radio"] {
      margin: 0;
      float: right;
    }

    .payment-page .payment_wrapper .promotion_div .table_div {
      display: table;
      height: 100%;
      width: 100%;
    }

    .payment-page .payment_wrapper .promotion_div .table_cell_div {
      display: table-cell;
      height: 100%;
      vertical-align: middle;
    }

    .payment-page .radioB {
      width: 70px;
    }

    .payment-page .payment_wrapper .manual_option {
      margin: 0 0 30px;
      font-size: 14px;
      letter-spacing: 0.4px;
      text-align: left;
      color: #e13d36;
      cursor: pointer;
    }

    .payment-page .payment_wrapper .manual_option .fa-plus {
      font-size: 8px;
      position: relative;
      bottom: 2.8px;
      margin-right: 4px;
    }

    .payment-page .payment_wrapper .add_cc {
      width: 177px;
      height: 30px;
      background-color: #fff;
      border: solid 1px #e1e1e1;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-align: center;
      color: #e13d36;
      line-height: 28px;
      margin: 0 0 30px;
    }

    .payment-page .payment_wrapper .seperation_line {
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      margin: 5px auto;
      width: 100%;
    }

    @keyframes click-wave {
      0% {
        height: 20px;
        width: 20px;
        opacity: 0.35;
        position: relative;
      }
      100% {
        height: 40px;
        width: 40px;
        margin-left: -10px;
        margin-top: -10px;
        opacity: 0;
      }
    }

    .payment-page .payment_wrapper .option-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      -o-appearance: none;
      height: 20px;
      width: 20px;
      transition: all 0.15s ease-out 0s;
      background: #fafafa;
      border: none;
      color: white;
      cursor: pointer;
      display: inline-block;
      margin-right: 0.5rem;
      outline: none;
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0.5);
    }

    .payment-page .payment_wrapper .option-input:checked {
      background: #82c548;
      border: 0;
    }

    .payment-page .payment_wrapper .option-input:checked::before {
      height: 22px;
      width: 22px;
      position: absolute;
      content: '\f00c';
      font-family: FontAwesome;
      display: inline-block;
      font-size: 12px;
      text-align: center;
      line-height: 21px;
      right: -1px;
    }

    .payment-page .payment_wrapper .option-input:checked::after {
      -webkit-animation: click-wave 0.65s;
      -moz-animation: click-wave 0.65s;
      animation: click-wave 0.65s;
      background: #82c548;
      content: '';
      display: block;
      position: relative;
      z-index: 100;
    }

    .payment-page .payment_wrapper .option-input.radio {
      border-radius: 50%;
      margin: 0 !important;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      outline: none !important;
    }

    .payment-page .payment_wrapper .option-input.radio::after {
      border-radius: 50%;
    }

    .payment-page .payment_wrapper .table_cell_div label {
      display: block;
      height: 20px !important;
      margin: 0 !important;
    }

    .payment-page .row-eq-height {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .payment-page .card_grp {
      display: inline-block;
    }

    .payment-page .payment_wrapper .card_grp {
      display: inline-block;
      margin: 11.5px;
    }

    .payment-page .payment_wrapper .card_grp input {
      display: none;
    }

    .payment-page .payment_wrapper .card_grp label {
      width: 160px;
      height: 83px;
      padding: 15px;
      margin: 0;
      border: solid 1px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    .payment-page .payment_wrapper .card_grp label .crd_no {
      font-size: 16px;
      letter-spacing: 0.5px;
      text-align: left;
      color: #000;
      bottom: 12px;
      position: absolute;
    }

    .payment-page .payment_wrapper .card_grp label .crd_no .crd_no_enc {
      font-size: xx-large;
      letter-spacing: 0px;
      position: relative;
      bottom: 2.5px;
    }

    .payment-page .crd_no p {
      margin: 0;
      display: inline;
      line-height: 20px;
    }

    .payment-page .sel_card::before {
      height: 22px;
      width: 22px;
      content: '\f00c';
      font-family: FontAwesome;
      font-size: 12px;
      font-weight: lighter;
      line-height: 21px;
      right: 10px;
      top: 10px;
      background: #82c548;
      position: absolute;
      z-index: 100;
      border-radius: 50%;
      color: white;
      text-align: center;
      padding-top: 1px;
      display: none;
    }

    .payment-page .payment_wrapper .card_grp input:checked+label {
      box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
      border: solid 1px #82c548;
    }

    .payment-page .payment_wrapper .card_grp input:checked+label .sel_card::before {
      display: block;
    }

    .payment-page .add_ncard {
      width: 160px;
      height: 83px;
      margin: 0;
      border: solid 1px rgba(0, 0, 0, 0.3);
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-align: center;
      color: #e13d36;
      padding: 15px;
    }

    .payment-page .add_ncard p {
      margin: 0;
      position: relative;
      top: 17.5px;
    }

    .payment-page .pmnt-lable {
      opacity: 0.5;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1.2px;
      text-align: left;
      color: #000;
    }

    .payment-page .pmnt_hidden_space {
      height: 65px;
    }

    .payment-page .pmnt-input {
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px rgba(0, 0, 0, 0.2);
      padding: 10px;
    }

    .payment-page .pmnt-input::-webkit-input-placeholder, .payment-page .pmnt-input::-moz-placeholder, .payment-page .pmnt-input:-ms-input-placeholder, .payment-page .pmnt-input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }

    .payment-page .pmnt_form_col:nth-child(even) {
      padding: 0 0 0 60px;
    }

    @media screen and (max-width: 1000px) {
      .payment-page .pmnt_form_col:nth-child(even) {
        padding: 0 0 0 20px;
      }
    }

    @media screen and (max-width: 767px) {
      .payment-page .pmnt_form_col:nth-child(even) {
        padding: 0;
      }
    }

    .payment-page .pmnt_form_col:nth-child(odd) {
      padding: 0 50px 0 0;
    }

    @media screen and (max-width: 1300px) {
      .payment-page .pmnt_form_col:nth-child(odd) {
        padding: 0 40px 0 0;
      }
    }

    @media screen and (max-width: 1000px) {
      .payment-page .pmnt_form_col:nth-child(odd) {
        padding: 0 20px 0 0;
      }
    }

    @media screen and (max-width: 767px) {
      .payment-page .pmnt_form_col:nth-child(odd) {
        padding: 0;
      }
    }

    .payment-page .pmnt_proceed_pay {
      width: 460px;
      height: 60px;
      border-radius: 2px;
      background-color: #e13d36;
      font-size: 16px;
      letter-spacing: 0.3px;
      text-align: center;
      color: #fff;
      border: 0;
      cursor: pointer;
      margin: 50px auto;
      display: block;
    }

    @media screen and (max-width: 767px) {
      .payment-page .pmnt_proceed_pay {
        width: calc(100% - 60px);
      }
    }

    .payment-page .pmnt_proceed_pay:focus {
      outline: none;
    }

    .payment-page .pmnt_proceed_pay img {
      margin-left: 4px;
      width: 15px;
    }

    .payment-page .pay-option {
      padding: 20px 50px 10px;
      display: inline-block;
      white-space: nowrap;
      overflow-y: hidden;
      overflow-x: auto;
      width: 100%;
    }

    .payment-page .pay-div {
      display: flex;
      padding: 20px 30px 10px;
      padding-bottom: 10px;
      padding-left: 10px;
    }

    .payment-page .cash-text {
      color: #333;
      font-size: 16px;
      padding-top: 2px;
      display: flex;
      padding: 20px 30px 10px;
      padding-bottom: 10px;
      padding-left: 10px;
    }

    .payment-page .label-pay {
      float: left;
      margin-right: 10px;
    }

    .payment-page .paymentOption {
      display: inline-flex;
    }

    @media only screen and (max-width: 990px) {
      .payment-page .paymentOption {
        display: inline-flex;
        padding: 0px;
      }
      .payment-page .pay-option {
        display: inline-block;
        white-space: nowrap;
        overflow-y: hidden;
        overflow-x: auto;
        width: 100%;
        padding-bottom: 0px;
      }
    }

    .payment-page .repeatProcess {
      margin-left: 25px;
    }

    .payment-page .repeatProcess:first-child {
      margin-left: 0px;
    }

    .payment-page .repeatProcess .repeatStyle {
      width: auto;
      height: 83px;
      border: solid 1px #bdbebd;
      outline:none;
    }

    .payment-page .repeatProcess .repeatStyle .pay_btn.card_btn {
      height: 100%;
      position: relative;
      cursor: pointer;
      width: auto;
      min-width: 160px;
    }

    .payment-page .repeatProcess .repeatStyle .pay_btn.card_btn .cardText {
      position: absolute;
      bottom: 13px;
      left: 23px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.5px;
      cursor: pointer;
      color: #000;
      min-width: 160px;
    }

    .payment-page .repeatProcess .repeatStyle .pay_btn.card_btn .payByCash {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      top: 0px;
      margin: 30px 0px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.5px;
      color: #000;
      cursor: pointer;
      width: auto;
    }

    .payment-page .repeatProcess .repeatStyle .pay_btn.card_btn .mar-box-20 {
      margin: 20px !important;
    }

    .payment-page .repeatProcess .selectedMethod {
      width: auto;
      height: 83px;
      border: 1px solid #27b74b;
      color: #27b74b;
      outline:none;
    }

    .payment-page .selectedMethod .pay_btn::after {
      content: url('assets/images/shield-sign.svg');
      position: absolute;
      right: -12px;
      top: -12px;
    }

    .payment-page .repeatProcess .selectedMethod .pay_btn.card_btn {
      height: 100%;
      position: relative;
      cursor: pointer;
      width: auto;
      min-width: 160px;
    }

    .payment-page .repeatProcess .selectedMethod .pay_btn.card_btn .cardText {
      position: absolute;
      bottom: 13px;
      left: 23px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.5px;
      color: #27b74b;
      cursor: pointer;
      min-width: 160px;
    }

    .payment-page .repeatProcess .selectedMethod .pay_btn.card_btn .payByCash {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      top: 0px;
      margin: 30px 0px;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.5px;
      color: #27b74b;
      cursor: pointer;
      width: auto;
    }

    .payment-page .repeatProcess .selectedMethod .pay_btn.card_btn .removeCard {
      position: absolute;
      top: 0px;
      right: 0px;
      color: red;
      cursor: pointer;
    }

    .payment-page .pay-border {
      border-bottom: 1px solid rgba(0, 0, 0, .1);
    }

    .payment-page .p-btn {
      font-family: ProximaNova-Regular;
      font-weight: normal;
      text-align: center;
      font-size: 16px;
      width: auto;
      margin: 20px auto;
      height: 50px;
    }

    .payment-page .p-btn.add-pro {
      width: auto;
    }

    .payment-page .paddingZero {
      padding: 0px;
    }

    .payment-page .discount_text {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
      text-align: left;
      font-family: ProximaNova-Regular;
    }

    .payment-page .discount_text_description {
      font-weight: normal;
      font-size: 13px;
      margin-bottom: 5px;
      text-align: left;
      font-family: ProximaNova-Regular;
    }

    .payment-page .parent-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-family: "ProximaNova-Regular";
      background-color: rgba(0, 0, 0, .7);
      z-index: 904;
    }

    .payment-page .parent-dialog div.content-dialog {
      width: auto;
      position: absolute;
      top: 40%;
      left: 50%;
      background-color: #fff;
      border-radius: 5.3px;
      padding: 20px 30px;
      transform: translate(-50%, -50%);
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-title {
      padding-bottom: 10px;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-title span {
      font-size: 18px;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-msg {
      font-size: 20px;
      color: #333;
      letter-spacing: 0.5px;
      line-height: 24px;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-msg input {
      outline: none;
      height: 45px;
      border: 1px solid #c6c6c6;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-msg input:focus {
      outline: none;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-action {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-action button {
      font-size: 14px;
      background-color: transparent;
      color: #fff;
      border: 1px solid;
      border-radius: 2px;
      min-width: 100px;
      font-family: "ProximaNova-Regular";
      padding: 0px 20px;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-action button.dialog-cancel {
      border-radius: 2px;
      border: solid 1px #b2b2b2;
      font-family: "ProximaNova-Regular";
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      color: #b2b2b2;
      margin-right: 20px;
    }

    .payment-page .parent-dialog div.content-dialog div.dialog-action div:hover {
      transform: scale(1);
    }

    .payment-page .parent-dialog div.content-dialog hr.p-hr {
      margin: 30px 0 0 0px;
      width: auto;
      background-color: #c1c1c1;
    }

    .payment-page .promo-pay-div {
      max-height: 245px;
      overflow: auto;
      padding-right: 0px;
    }

    .payment-page .card-dialog {
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .7);
      z-index: 904;
      width: 100%;
      height: 100%;
    }

    @media screen and (max-width: 500px) {
      .payment-page .parent-dialog div.content-dialog {
        width: 95%;
        position: absolute;
        top: 40%;
        left: 50%;
        background-color: #fff;
        border-radius: 5.3px;
        padding: 20px 30px;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
      .payment-page .parentnew-dialog div.content-dialog {
        width: 95%;
        position: absolute;
        top: 40%;
        left: 50%;
        background-color: #fff;
        border-radius: 5.3px;
        padding: 20px 30px;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
      .payment-page .p-btn {
        font-family: ProximaNova-Regular;
        font-weight: normal;
        text-align: center;
        font-size: 13px;
        width: auto;
        margin: 20px auto;
        height: 50px;
      }
      .payment-page .p-btn.add-pro {
        width: auto;
      }
    }

    .payment-page .promo_p {
      font-family: ProximaNova-Regular;
      float: right;
      font-size: 15px;
      cursor: pointer;
      margin: 13px;
      color:var(--theme)
    }

    .payment-page .promo_p:hover {
      color: #333 !important;
      transition: 0.5s;
    }

    .payment-page form.checkout {
      text-align: center;
      border: 2px solid #eee;
      border-radius: 8px;
      padding: 1rem 2rem;
      background: white;
      width: 800px;
      font-family: ProximaNova-Regular;
      color: #525252;
      font-size: 16px;
      height: 180px;
      margin: 0 auto;
    }

    .payment-page .cancel-btn {
      font-family: ProximaNova-Regular;
      min-width: 100px;
      color: #333 !important;
      background-color: #fff !important;
      border: 1px solid #ccc !important;
      cursor: pointer;
    }

    .payment-page .add-card {
      font-family: ProximaNova-Regular;
      min-width: 100px;
      cursor: pointer;
    }

    .payment-page .StripeElement {
      background-color: white;
      padding: 8px 12px;
      border: 1px solid transparent;
      box-shadow: 0 1px 3px 0 #e6ebf1;
      transition: box-shadow 150ms ease;
      margin: 15px 0;
    }

    @media only screen and (max-width: 650px) {
      .payment-page form.checkout {
        text-align: center;
        border: 2px solid #eee;
        border-radius: 8px;
        padding: 1rem 2rem;
        background: white;
        width: 350px;
        font-family: ProximaNova-Regular;
        color: #525252;
        font-size: 16px;
        height: 180px;
        margin: 0 auto;
      }
    }

    .payment-page .removeCard {
      text-align: right;
      position: relative;
      top: 30px;
      left: -5px;
      color: red;
      z-index: 100;
    }

    .payment-page .loyaty_btn {
      padding: 8px 20px;
      border: 2px solid var(--theme);
      font-weight: bold;
      background: var(--theme);
      color: #fff;
      border-radius: 0px;
    }

    .payment-page .loyaty_btn:hover {
      background: #fff;
      color: var(--theme);
    }

    .payment-page .fac-modal {
      min-height: 610px;
      width: 100%;
      padding: 0px;
    }

    .payment-page .paypal-pay-btn {
      margin: 20px auto;
    }

    .payment-page .paypal-heading {
      font-size: 18px;
      text-align: center;
      margin: 10px 0px;
    }

    .payment-page .paypal-modal {
      min-height: 610px;
      width: 100%;
      padding: 0px;
    }

    .payment-page .innstapay-modal {
      min-height: 610px;
      width: 100%;
      padding: 0px;
    }

    .payment-page .innstapay-heading {
      font-size: 18px;
      text-align: center;
      margin: 10px 0px;
    }

    .payment-page .authorizenet-modal {
      min-height: 610px;
      width: 100%;
      padding: 0px;
    }

    .payment-page .payByPayLater {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .payment-page .stripe-add-card-btn{
      padding:7px;
    }

    `
  },
  customerVerificationPopup: {
    html: `
    <app-modal-dynamic class="container" [modalType]="'modal-md'" >
    <div body>
        <div class="Container">
            <div class="image-box">
                    <img src="assets/images/group.png">
            </div>

            <div class="bold-info-box">
                 <ng-container i18n>Your account is under review for service owner's approval.</ng-container>
            </div>

            <div class="info-box">
                <ng-container i18n>You will get a confirmation email once approved.</ng-container>

            </div>

            <div class="footer">

                <button class="btn btn-primary" (click)="onConfirmClick()" >
                <ng-container>{{langJson[buttonText] || langJson['Confirm']}}</ng-container>
                </button>

            </div>
        </div>


    </div>
</app-modal-dynamic>


`,
    css: `
    .container {
      text-align: -webkit-center;
    }
    .Container {
      padding: 70px 40px 40px 40px;
      margin: 15px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 4px;
      box-shadow: #b1b1b1 0px 0px 11px;
      text-align: center;
      width: 80%;
      margin: 60px 0px;
    }
    .Container .image-box {
      margin: 5px 0px;
    }
    :host /deep/ .modal {
      top: 0px !important;
      background: rgba(0,0,0,0.6);
  }
    .Container .bold-info-box {
      font-weight: 800;
      font-size: 25px;
      margin: 38px 0px;
    }
    .Container .info-box {
      font-weight: 300;
      font-size: 20px;
    }
    .Container .footer {
      margin-top: 20px;
    }
    .Container .btn {
      border-radius: 5px !important;
      background-color: #25a1ff;
      padding: 7px 32px;
    }
    .Container .btn:hover {
      cursor: pointer;
      background-color: #1682d4;
    }

    `
  },
  mandatoryItems:{
    html : `
    <div class="mandat-items">
    <app-modal-dynamic [modalType]="modalType" *ngIf="showMandatoryItems">
        <div body style="margin: 25px 30px">
          <div class="col-12">
           <p class="main-heading text-capitalize"> Mandatory Items </p>
          </div>
          <div>
            <p>Select atleast one item from each category</p>
          </div>
          <ng-container *ngIf = "!isSingleCategoryMandatory">
            <div class="nav-tab col-12">
              <ul [class]="tabState">
                <ng-container *ngFor="let tab of tabs;let i = index">
                  <li [ngClass]="{'active' : i == activeIndex }" (click)="onItemClick($event, i)">{{tab.label}}</li>
                </ng-container>
              </ul>
            </div>
          </ng-container>
          <ng-container *ngIf="isSingleCategoryMandatory">
            <div>
              <p class="heading">{{tabs[0].label}}</p>
            </div>
          </ng-container>
          <ng-container>
            <div class="col-12">
                <app-product-dynamic class="product-app" [ngClass]="{'product-app': productList && productList.length, 'product-app_without_product': productList && !productList.length}"
                [hidden]="false" [productData]="productList" [cardInfo]="cardInfo" [searchProducts]="0"
                [paginating]="false" [hasImages]="true" [mandat_item_layout_type]="2" [showCategoryName]="false"></app-product-dynamic>
            </div>
          </ng-container>

          <div class="col-12 btn-div">
              <button type="button" class=" btn btn-default btn-block ripple cart-btn" [ngStyle]="{ 'direction' : direction }" appColor (click)="hidePopup()" [style.background-color]="formSettings.color">
                <ng-container i18n>Continue</ng-container>
              </button>
            </div>
        </div>
    </app-modal-dynamic>
</div>

    `,
    css : `

.mandat-items .nav-tab {
  display: flex;
  flex-direction: row;
}
.mandat-items .nav-tab ul {
  text-align: center;
  display: flex;
  padding-left: 0;
}
.mandat-items .nav-tab ul li {
  cursor: pointer;
  border: 1px solid var(--theme);
  padding: 6px 17px;
  list-style-type: none;
  outline: none;
}
.mandat-items .nav-tab ul li a {
  font-family: 'ProximaNova-Regular';
  color: #474747;
  font-size: 14px;
}
.mandat-items .nav-tab ul li.active {
  border: 0;
  font-family: 'ProximaNova-Semibold';
}
.mandat-items .nav-tab ul li:hover a {
  text-decoration: none;
}
.mandat-items .nav-tab ul li:first-child {
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.mandat-items .nav-tab ul li:last-child {
  border-radius: 4px;
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.mandat-items .active {
  background-color: var(--theme);
  color: white;
}
.mandat-items .active a {
  color: #fff !important;
  text-decoration: none;
}
.mandat-items .heading {
  font-family: 'ProximaNova-Regular';
  color: #474747;
  font-size: 18px;
  font-weight: 600;
}
@media (max-width: 767px) {
  .mandat-items .nav-tab ul {
    flex-direction: column;
    width: 100%;
    transition: all 0.3s ease;
  }
  .mandat-items .nav-tab ul li {
    padding: 6px 35px;
    white-space: nowrap;
    transition: all 0.3s ease;
  }
  .mandat-items .nav-tab ul.collapsed {
    position: relative;
  }
  .mandat-items .nav-tab ul.collapsed li:not(.active) {
    display: none;
  }
  .mandat-items .nav-tab ul.collapsed li {
    border-radius: 4px !important;
  }
  .mandat-items .nav-tab ul.collapsed:after {
    content: '';
    border: 8px solid white;
    position: absolute;
    right: 10px;
    /* border-top: 0; */
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom: 0;
    top: 35%;
  }
  .mandat-items .nav-tab ul.expanded {
    background-color: #eee;
  }
  .mandat-items .nav-tab ul.expanded li {
    border-radius: 0px;
    border: none;
  }
  .mandat-items .nav-tab ul.expanded li:not(:first-child) {
    border-top: 1px solid #ddd bd;
  }
}
.mandat-items .main-heading {
  font-size: 24px;
  font-weight: 300;
  color: #333;
  opacity: 0.8;
  text-align: center;
}
@media screen and (max-width: 576px) {
  .mandat-items .main-heading {
    font-size: 18px;
  }
}
.mandat-items button.cart-btn {
  width: auto !important;
  height: 40px;
  border-radius: 6px;
  margin-top: 20px;
  font-family: ProximaNova-Regular;
  font-size: 16px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
}
.mandat-items button.cart-btn span {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-align: left;
}
.mandat-items .btn-div {
  justify-content: center;
  display: flex;
}

    `
  },
  debtAmount: {
    html: `
    <div class="profilePage row">
    <div class="col-xs-12">
        <div class="heading">
            <p class="title" [ngStyle]="{ 'direction' : direction }">
                <ng-container i18n>Outstanding Payment</ng-container>
            </p>
            <hr class="line" [style.border-top-color]="appConfig.color" />
        </div>
    </div>

    <div class="container profileStyle">
        <div class="row">
            <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12 profileP">
                <div class="row">
                        <div class="debt">
                                <div class="col-12 debt-img">
                                    <img src="assets/images/debt.png" class="debt-box">
                                </div>
                                <div class="debt-amt">
                                    {{currency}}{{debtAmount}}
                                </div>
                                <div class="debt-text">
                                    <p i18n>Amount is pending from your last order.</p>
                                </div>
                                <div class="col-12 pad-top">
                                    <div class="modal-footer dialog-action">
                                        <button class="dialog-cancel btn btn-default" mat-button (click)="redirectToPayment()">
                                            <ng-container i18n>Continue to Pay</ng-container>
                                        </button>
                                        <p class="sub-text" i18n>Please settle the amount to continue using the website.</p>
                                        <span class="skip-button" *ngIf="!appConfig.is_debt_payment_compulsory" (click)="goBack()"
                                            i18n>Skip for now</span>
                                    </div>
                                </div>
                            </div>

                </div>
            </div>
        </div>
    </div>


</div>

<app-dynamic-footer></app-dynamic-footer>
    `,
    css: `
    .debt {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      flex-direction: column;
    }
    .debt .debt-img {
      display: flex;
      justify-content: center;
      padding-top: 25px;
    }
    .debt .debt-img .debt-box {
      height: 160px;
      width: 160px;
    }
    .debt .debt-amt {
      font-size: 45px;
      font-weight: bold;
      color: #474747;
      font-family: 'ProximaNova-Semibold';
    }
    .debt .debt-text {
      font-size: 20px;
      text-align: center;
      color: #474747;
      font-family: 'ProximaNova-Light';
    }
    .debt .pad-top {
      padding-top: 23px;
    }
    .debt button.dialog-cancel {
      font-size: 15px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border-radius: 5px !important;
      background-color: #2296ff;
      border-color: #2296ff;
      padding: 10px 40px;
      color: #fff;
    }
    .debt button.dialog-cancel:hover {
      background-color: #fff;
      color: #2296ff;
    }
    .debt .sub-text {
      padding-top: 10px;
    }
    .debt .skip-button {
      color: #2296ff;
      text-decoration: underline;
      cursor: pointer;
    }
    .backdrop {
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.6);
      height: 100%;
      width: 100%;
      z-index: 1040;
    }
    :host /deep/ .modal-footer {
      border-top: none !important;
      text-align: center !important;
    }
    :host /deep/ .modal-header {
      display: flex;
      justify-content: center;
      border: none !important;
    }
    :host /deep/ .modal-title {
      color: #474747 !important;
      font-size: 23px !important;
      padding-top: 10px;
    }
    @media screen and (max-width: 768px) {
      .debt-box {
        height: 120px !important;
        width: 120px !important;
      }
      .debt-amt {
        font-size: 35px !important;
      }
      .debt-text {
        font-size: 17px !important;
        padding: 0px 10px;
      }
    }

    .heading {
      text-align: center;
      padding: 20px 0;
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
      display: inline-block;
      font-family: ProximaNova-Regular;
      font-size: 25px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
    }
    .line {
      margin: 0 auto;
      width: 50px;
    }
    .card-p {
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 13px 25px 0 rgba(0, 0, 0, 0.1);
      overflow-y: scroll;
    }
    .center-p {
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      justify-content: center;
    }
    .fg {
      font-size: 16px;
      padding: 15px;
    }
    /deep/ .signup-input {
      height: auto !important;
      font-size: 14px !important;
    }
    /deep/ .flagInput {
      background-color: white !important;
      width: 18px !important;
      text-align: center !important;
    }
    /deep/ .flagInput button {
      outline: none;
    }
    .minheightft {
      min-height: 40px;
      line-height: 40px;
      font-family: "ProximaNova-Regular";
      font-size: 14px;
      font-weight: 600;
    }
    .minheightft span {
      font-weight: normal;
    }
    .profilePage {
      padding-bottom: 20px;
      height: auto;
      min-height: calc(100vh - 180px);
    }
    .profileStyle {
      width: 600px;
      height: auto;
    }
    .profileStyle .profileP {
      background-color: #fff;
      box-shadow: 0 2px 35px 0 rgba(0, 0, 0, 0.05);
      padding-bottom: 10px;
    }
    .profileStyle .profileEditView {
      padding: 55px 60px;
    }
    .profileStyle .profileEditView label {
      font-family: "ProximaNova-Regular";
      font-size: 12px;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #9c9c9c;
    }
    .profileStyle .profileEditView input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }
    .profileStyle .profileEditView input::-webkit-input-placeholder, .profileStyle .profileEditView input::-moz-placeholder, .profileStyle .profileEditView input:-ms-input-placeholder, .profileStyle .profileEditView input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }
    .profileStyle .profileEditView input:focus {
      outline: none;
    }
    .profileStyle .profileEditView select {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }
    .profileStyle .profileEditView select::-webkit-input-placeholder, .profileStyle .profileEditView select::-moz-placeholder, .profileStyle .profileEditView select:-ms-input-placeholder, .profileStyle .profileEditView select:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }
    .profileStyle .profileEditView select:focus {
      outline: none;
    }
    .profileStyle .profileEditView .saveButton {
      padding: 15px 0px;
    }
    .profileStyle .profileEditView .saveButton .backButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      color: #333 !important;
      background-color: #fff !important;
      border: 1px solid #ccc !important;
      border-radius: 4.8px !important;
    }
    .profileStyle .profileEditView .saveButton .okButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      border: 1px solid transparent !important;
      border-radius: 4.8px;
      margin-left: 10px;
    }
    .profileStyle .profileViewOnly {
      padding: 55px 60px;
    }
    .profileStyle .profileViewOnly .profileNameHeading {
      font-family: ProximaNova-Regular;
      font-size: 22px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      text-align: center;
    }
    .profileStyle .profileViewOnly .profileNumberDiv {
      font-family: ProximaNova-Regular;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      padding-top: 46px;
      text-align: center;
    }
    .profileStyle .profileViewOnly .profileNumberDiv span {
      padding-left: 22px;
    }
    .profileStyle .profileViewOnly .profileEmailDiv {
      font-family: ProximaNova-Regular;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      padding-top: 36px;
      text-align: center;
    }
    .profileStyle .profileViewOnly .profileEmailDiv span {
      padding-left: 22px;
    }
    .profileStyle .profileViewOnly .editButton {
      text-align: center;
      padding-top: 46px;
    }
    .profileStyle .profileViewOnly .editButton button {
      min-width: 143.8px;
      height: 40px;
      padding: 8px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      border-radius: 4.8px;
    }
    .profileStyle .additionalInformation {
      background: #ddd 8a;
    }
    .profileStyle .additionalInformation .additionalText {
      padding: 13px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
    }
    .profileStyle .additionalData {
      padding-top: 10px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
    }
    .input-group .fugu-tel-input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px !important;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }
    .input-group .fugu-tel-input::-webkit-input-placeholder, .input-group .fugu-tel-input::-moz-placeholder, .input-group .fugu-tel-input:-ms-input-placeholder, .input-group .fugu-tel-input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }
    .input-group .fugu-tel-input:focus {
      outline: none;
    }
    .input-group .flagInput {
      height: 50px !important;
    }
    /deep/ .signup-input {
      height: 50px !important;
      font-size: 18px !important;
      font-family: "ProximaNova-Regular";
    }
    /deep/ .flagInput {
      font-family: "ProximaNova-Regular";
      background-color: white !important;
      width: 57px !important;
      text-align: center !important;
    }
    /deep/ .flagInput button {
      outline: none;
    }
    @media only screen and (max-width: 650px) {
      .profileStyle {
        width: 90%;
        margin: auto;
      }
      .profileStyle .profileViewOnly {
        padding: 25px;
      }
      .profileStyle .profileViewOnly .profileNameHeading {
        font-size: 16px;
      }
      .profileStyle .profileViewOnly .profileNumberDiv {
        font-size: 16px;
        padding-top: 25px;
      }
      .profileStyle .profileViewOnly .profileNumberDiv span {
        padding-left: 8px;
      }
      .profileStyle .profileViewOnly .profileEmailDiv {
        font-size: 16px;
        padding-top: 25px;
      }
      .profileStyle .profileViewOnly .profileEmailDiv span {
        padding-left: 8px;
      }
      .profileStyle .profileViewOnly .editButton {
        padding-top: 25px;
      }
      .profileStyle .profileEditView {
        padding: 25px;
      }
    }
    .changePassword {
      background-color: var(--theme);
      font-family: 'ProximaNova-Regular';
      color: white;
    }
    .uploadIcon {
      margin-left: 89px;
      background: gainsboro;
      border: 1px solid darkslategrey;
      border-radius: 50%;
    }
    .uploadIcon i {
      padding: 5px;
      color: black;
      font-size: 18px;
    }
    .profilePage /deep/ .ui-calendar {
      font-family: 'ProximaNova-Regular';
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      /* padding: 10px; */
      font-size: 18px;
    }
    .profilePage /deep/ .ui-calendar .ui-inputtext {
      width: 100%;
      height: 100%;
    }
    .heading {
      text-align: center;
      padding: 20px 0;
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
      display: inline-block;
      font-family: ProximaNova-Regular;
      font-size: 25px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
    }
    .line {
      margin: 0 auto;
      width: 50px;
    }
    .card-p {
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 13px 25px 0 rgba(0, 0, 0, 0.1);
      overflow-y: scroll;
    }
    .center-p {
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: center;
      justify-content: center;
    }
    .fg {
      font-size: 16px;
      padding: 15px;
    }
    /deep/ .signup-input {
      height: auto !important;
      font-size: 14px !important;
    }
    /deep/ .flagInput {
      background-color: white !important;
      width: 18px !important;
      text-align: center !important;
    }
    /deep/ .flagInput button {
      outline: none;
    }
    .minheightft {
      min-height: 40px;
      line-height: 40px;
      font-family: "ProximaNova-Regular";
      font-size: 14px;
      font-weight: 600;
    }
    .minheightft span {
      font-weight: normal;
    }
    .profilePage {
      padding-bottom: 20px;
      height: auto;
      min-height: calc(100vh - 180px);
    }
    .profileStyle {
      width: 600px;
      height: auto;
    }
    .profileStyle .profileP {
      background-color: #fff;
      box-shadow: 0 2px 35px 0 rgba(0, 0, 0, 0.05);
      padding-bottom: 10px;
    }
    .profileStyle .profileEditView {
      padding: 55px 60px;
    }
    .profileStyle .profileEditView label {
      font-family: "ProximaNova-Regular";
      font-size: 12px;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #9c9c9c;
    }
    .profileStyle .profileEditView input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }
    .profileStyle .profileEditView input::-webkit-input-placeholder, .profileStyle .profileEditView input::-moz-placeholder, .profileStyle .profileEditView input:-ms-input-placeholder, .profileStyle .profileEditView input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }
    .profileStyle .profileEditView input:focus {
      outline: none;
    }
    .profileStyle .profileEditView select {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }
    .profileStyle .profileEditView select::-webkit-input-placeholder, .profileStyle .profileEditView select::-moz-placeholder, .profileStyle .profileEditView select:-ms-input-placeholder, .profileStyle .profileEditView select:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }
    .profileStyle .profileEditView select:focus {
      outline: none;
    }
    .profileStyle .profileEditView .saveButton {
      padding: 15px 0px;
    }
    .profileStyle .profileEditView .saveButton .backButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      color: #333 !important;
      background-color: #fff !important;
      border: 1px solid #ccc !important;
      border-radius: 4.8px !important;
    }
    .profileStyle .profileEditView .saveButton .okButton {
      font-family: "ProximaNova-Regular";
      min-width: 100px;
      border: 1px solid transparent !important;
      border-radius: 4.8px;
      margin-left: 10px;
    }
    .profileStyle .profileViewOnly {
      padding: 55px 60px;
    }
    .profileStyle .profileViewOnly .profileNameHeading {
      font-family: ProximaNova-Regular;
      font-size: 22px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      text-align: center;
    }
    .profileStyle .profileViewOnly .profileNumberDiv {
      font-family: ProximaNova-Regular;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      padding-top: 46px;
      text-align: center;
    }
    .profileStyle .profileViewOnly .profileNumberDiv span {
      padding-left: 22px;
    }
    .profileStyle .profileViewOnly .profileEmailDiv {
      font-family: ProximaNova-Regular;
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      padding-top: 36px;
      text-align: center;
    }
    .profileStyle .profileViewOnly .profileEmailDiv span {
      padding-left: 22px;
    }
    .profileStyle .profileViewOnly .editButton {
      text-align: center;
      padding-top: 46px;
    }
    .profileStyle .profileViewOnly .editButton button {
      min-width: 143.8px;
      height: 40px;
      padding: 8px;
      font-family: ProximaNova-Regular;
      font-size: 17px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      border-radius: 4.8px;
    }
    .profileStyle .additionalInformation {
      background: #ddd 8a;
    }
    .profileStyle .additionalInformation .additionalText {
      padding: 13px;
      font-family: 'ProximaNova-Regular';
      font-size: 17px;
    }
    .profileStyle .additionalData {
      padding-top: 10px;
      font-family: 'ProximaNova-Regular';
      font-size: 17px;
    }
    .input-group .fugu-tel-input {
      font-family: "ProximaNova-Regular";
      width: 100%;
      height: 50px !important;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      padding: 10px;
      font-size: 18px;
    }
    .input-group .fugu-tel-input::-webkit-input-placeholder, .input-group .fugu-tel-input::-moz-placeholder, .input-group .fugu-tel-input:-ms-input-placeholder, .input-group .fugu-tel-input:-moz-placeholder {
      opacity: 0.5;
      font-size: 18px;
      text-align: left;
    }
    .input-group .fugu-tel-input:focus {
      outline: none;
    }
    .input-group .flagInput {
      height: 50px !important;
    }
    /deep/ .signup-input {
      height: 50px !important;
      font-size: 18px !important;
      font-family: "ProximaNova-Regular";
    }
    /deep/ .flagInput {
      font-family: "ProximaNova-Regular";
      background-color: white !important;
      width: 57px !important;
      text-align: center !important;
    }
    /deep/ .flagInput button {
      outline: none;
    }
    @media only screen and (max-width: 650px) {
      .profileStyle {
        width: 90%;
        margin: auto;
      }
      .profileStyle .profileViewOnly {
        padding: 25px;
      }
      .profileStyle .profileViewOnly .profileNameHeading {
        font-size: 16px;
      }
      .profileStyle .profileViewOnly .profileNumberDiv {
        font-size: 16px;
        padding-top: 25px;
      }
      .profileStyle .profileViewOnly .profileNumberDiv span {
        padding-left: 8px;
      }
      .profileStyle .profileViewOnly .profileEmailDiv {
        font-size: 16px;
        padding-top: 25px;
      }
      .profileStyle .profileViewOnly .profileEmailDiv span {
        padding-left: 8px;
      }
      .profileStyle .profileViewOnly .editButton {
        padding-top: 25px;
      }
      .profileStyle .profileEditView {
        padding: 25px;
      }
    }
    .changePassword {
      background-color: var(--theme);
      font-family: 'ProximaNova-Regular';
      color: white;
    }
    .uploadIcon {
      margin-left: 89px;
      background: gainsboro;
      border: 1px solid darkslategrey;
      border-radius: 50%;
    }
    .uploadIcon i {
      padding: 5px;
      color: black;
      font-size: 18px;
    }
    .profilePage /deep/ .ui-calendar {
      font-family: 'ProximaNova-Regular';
      width: 100%;
      height: 50px;
      opacity: 1;
      border-radius: 2px;
      background-color: #fff;
      border: solid 1px #d2d2d2;
      font-size: 18px;
    }
    .profilePage /deep/ .ui-calendar .ui-inputtext {
      width: 100%;
      height: 100%;
    }


    `
  },

  otpVerification: {
    html: `
    <div class='container-fluid signup otp-verify'>
  <div class="row">
    <div class="col-xs-12 card-signup">
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showOtp == 1" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Verification</ng-container>
      </p>
      <p class="main-heading" style="text-transform: uppercase;" *ngIf="showOtp == 3" [ngStyle]="{ 'direction' : direction }">
        <ng-container i18n>Change Password</ng-container>
      </p>
      <form role="form" class="otpFormStyle" *ngIf="showOtp == 1" [formGroup]="otpForm" (keydown)="keyDownFunction($event)" autocomplete="off" style="padding-top:15px">
        <div class="formHeading">
          <p style="font-size:16px;margin:0px;" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Enter the OTP that you’ve recieved on your phone number/email</ng-container>
          </p>
        </div>
        <div class="otpWidth">
          <label for="OTP" class="fontSize" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Enter OTP</ng-container><span style="color:red">*</span>
          </label>
          <input [id]="OTP" type="text" maxlength="6" appNumberOnly autocomplete="off" formControlName="otpValue" class="focusable form-control custom_register_form-control input-style"
            i18n-placeholder placeholder="6 digit OTP" />
          <app-control-messages-dynamic [control]="otpForm.controls.otpValue"></app-control-messages-dynamic>
          <button type="submit" class="btn btn-sm btnSubmit" name="OTP" (click)="otpVerification()" [disabled]="!otpForm.valid">
            <ng-container i18n>Submit</ng-container>
          </button>
          <div class="form-group frm-grp-set" style="padding-bottom:20px;">
            <div class="col-xs-6 otpOption" style="text-align: left;">
              <a (click)="changeMobileNumberUI()" style="color:none;cursor: pointer;" [ngStyle]="{ 'direction' : direction }">
                <ng-container i18n>Change Phone number/Email</ng-container>
              </a>
            </div>
            <div class="col-xs-6 otpOption" style="text-align: right;" [ngStyle]="{ 'direction' : direction }">
              <a (click)="resendOTP()" style="color: none;cursor: pointer;">
                <ng-container i18n>Resend OTP</ng-container>
              </a>
            </div>
          </div>
        </div>
      </form>
      <form role="form" class="changeNumberFormStyle" *ngIf="showOtp == 3" [formGroup]="changePswdForm" autocomplete="off"
        style="padding-top:30px">
        <div class="form-group frm-grp-set">
          <label class="fontSize" for="new-pswd" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>New Password</ng-container><span style="color:red">*</span>
          </label>
          <div class="input-group" style="width: 100%">
            <svg class="eye" width="26px" height="18px" viewBox="0 0 26 18" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" tabIndex="-1" id="showPassword" (click)="togglePassword('new-pswd')">
              <!-- Generator: Sketch 48.2 (47327) - http://www.bohemiancoding.com/sketch -->
              <title>eye icon</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="eye-icon" fill-rule="nonzero">
                  <g id="noun_67883_cc" transform="translate(5.000000, 4.000000)">
                    <path d="M15.9265,5.32 C14.687,2.271 11.501,0.2225 8,0.2225 C4.4985,0.2225 1.313,2.271 0.0735,5.3195 L0,5.5 L0.0735,5.6805 C1.313,8.729 4.4985,10.777 8,10.777 C11.501,10.777 14.687,8.7285 15.9265,5.6805 L16,5.5 L15.9265,5.32 Z M1.038,5.5 C1.7955,3.786 3.2645,2.4505 5.0535,1.742 C3.939,2.6175 3.2215,3.976 3.2215,5.5 C3.2215,7.0235 3.9395,8.382 5.0535,9.2575 C3.264,8.5495 1.795,7.214 1.038,5.5 Z M8,9.32 C5.8935,9.32 4.18,7.6065 4.18,5.5 C4.18,3.3935 5.8935,1.68 8,1.68 C10.1065,1.68 11.8205,3.3935 11.8205,5.5 C11.8205,7.6065 10.1065,9.32 8,9.32 Z M10.947,9.2575 C12.0615,8.382 12.779,7.0235 12.779,5.5 C12.779,3.9765 12.0615,2.618 10.947,1.7425 C12.736,2.4505 14.205,3.786 14.963,5.5 C14.2045,7.214 12.736,8.5495 10.947,9.2575 Z M8,3.25 C6.7575,3.25 5.75,4.2575 5.75,5.5 C5.75,6.7425 6.7575,7.75 8,7.75 C9.2425,7.75 10.25,6.7425 10.25,5.5 C10.25,4.2575 9.2425,3.25 8,3.25 Z"
                      id="Shape"></path>
                  </g>
                </g>
              </g>
            </svg>
            <input type="password" id="new-pswd" autocomplete="off" formControlName="newPswd" [ngStyle]="{ 'direction' : direction }"
              class="focusable form-control custom_register_form-control input-style" i18n-placeholder placeholder="Enter password" />
          </div>
          <app-control-messages-dynamic [control]="changePswdForm.controls.newPswd"></app-control-messages-dynamic>
        </div>

        <div class="form-group frm-grp-set">
          <label class="fontSize" for="confirm-pswd" [ngStyle]="{ 'direction' : direction }">
            <ng-container i18n>Confirm Password</ng-container><span style="color:red">*</span>
          </label>
          <div class="input-group" style="width: 100%">
            <svg class="eye" width="26px" height="18px" viewBox="0 0 26 18" version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" tabIndex="-1" id="showPassword" (click)="togglePassword('confirm-pswd')">
              <!-- Generator: Sketch 48.2 (47327) - http://www.bohemiancoding.com/sketch -->
              <title>eye icon</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="eye-icon" fill-rule="nonzero">
                  <g id="noun_67883_cc" transform="translate(5.000000, 4.000000)">
                    <path d="M15.9265,5.32 C14.687,2.271 11.501,0.2225 8,0.2225 C4.4985,0.2225 1.313,2.271 0.0735,5.3195 L0,5.5 L0.0735,5.6805 C1.313,8.729 4.4985,10.777 8,10.777 C11.501,10.777 14.687,8.7285 15.9265,5.6805 L16,5.5 L15.9265,5.32 Z M1.038,5.5 C1.7955,3.786 3.2645,2.4505 5.0535,1.742 C3.939,2.6175 3.2215,3.976 3.2215,5.5 C3.2215,7.0235 3.9395,8.382 5.0535,9.2575 C3.264,8.5495 1.795,7.214 1.038,5.5 Z M8,9.32 C5.8935,9.32 4.18,7.6065 4.18,5.5 C4.18,3.3935 5.8935,1.68 8,1.68 C10.1065,1.68 11.8205,3.3935 11.8205,5.5 C11.8205,7.6065 10.1065,9.32 8,9.32 Z M10.947,9.2575 C12.0615,8.382 12.779,7.0235 12.779,5.5 C12.779,3.9765 12.0615,2.618 10.947,1.7425 C12.736,2.4505 14.205,3.786 14.963,5.5 C14.2045,7.214 12.736,8.5495 10.947,9.2575 Z M8,3.25 C6.7575,3.25 5.75,4.2575 5.75,5.5 C5.75,6.7425 6.7575,7.75 8,7.75 C9.2425,7.75 10.25,6.7425 10.25,5.5 C10.25,4.2575 9.2425,3.25 8,3.25 Z"
                      id="Shape"></path>
                  </g>
                </g>
              </g>
            </svg>
            <input type="password" id="confirm-pswd" autocomplete="off" formControlName="confirmPswd" [ngStyle]="{ 'direction' : direction }"
              class="focusable form-control custom_register_form-control input-style" i18n-placeholder placeholder="Retype password" />
          </div>
          <app-control-messages-dynamic [control]="changePswdForm.controls.confirmPswd"></app-control-messages-dynamic>
        </div>
        <div class=" text-right" style="padding-bottom:20px;">
          <button type="submit" class="btn btn-red" name="reset_pswd" [ngStyle]="{ 'direction' : direction }" (click)="changePassword()"
            [disabled]="!changePswdForm.valid">
            <ng-container i18n>Submit</ng-container>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    `,
    css: `
    .otp-verify .card-signup {
      background-color: #fff;
      border-radius: 6px;
      padding: 20px;
      padding-bottom: 0;
    }
    .otp-verify .card-signup .line {
      margin: 5px auto;
      width: 60px;
      float: left;
    }
    .otp-verify .otpWidth {
      text-align: center;
    }
    .otp-verify .otpWidth input {
      width: 100%;
    }
    .otp-verify .otpWidth .form-group {
      width: 100%;
    }
    .otp-verify .otpWidth app-control-messages {
      width: 100%;
      display: block;
      text-align: left !important;
    }
    .otp-verify .formHeading {
      opacity: 0.6;
      font-family: ProximaNova-Regular;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #525252;
      padding-bottom: 25px;
    }
    @media only screen and (max-width: 768px) {
      .otp-verify .card-signup {
        padding: 5px;
      }
      .otp-verify .otpWidth {
        text-align: center;
      }
      .otp-verify .otpWidth input {
        width: 100%;
      }
      .otp-verify .otpWidth .form-group {
        width: 100%;
      }
      .otp-verify .otpWidth app-control-messages {
        width: 100%;
        display: block;
        text-align: left !important;
      }
    }
    .otp-verify .main-heading {
      font-size: 24px;
      font-weight: 300;
      color: #333;
      opacity: 0.8;
      text-align: center;
      font-family: ProximaNova-Regular;
      font-size: 22px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.7px;
      text-align: center;
      color: #000;
      margin-top: 10px;
    }
    @media screen and (max-width: 576px) {
      .otp-verify .main-heading {
        font-size: 18px;
      }
    }
    .otp-verify .input-style {
      color: #333;
      height: 60px;
      font-size: 20px;
    }
    .otp-verify .btnSubmit {
      border-radius: 8px;
      border: solid 1px #fff;
      font-size: 16px;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
      margin: 30px 0 15px 0;
      padding: 15px 0;
      width: 100%;
      background-color: var(--theme);
    }
    .otp-verify .otpOption {
      font-family: ProximaNova-Regular;
      font-size: 18.5px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: 0.7px;
      text-align: left;
      color: #06aed5;
      padding: 0;
    }
    .otp-verify .btn-red {
      background-color: #e13d36;
      color: white !important;
      font-size: 18px;
    }
    /deep/ .otp-verify .signup-input {
      height: 60px !important;
      font-size: 20px;
    }
    /deep/ .otp-verify .flagInput {
      background-color: white !important;
      width: 57px !important;
      text-align: center !important;
    }
    /deep/ .otp-verify .flagInput button {
      outline: none;
    }
    .otp-verify .fontSize {
      font-size: 18px;
    }
    .otp-verify .checkbox input[type=checkbox] {
      margin-top: 7px;
    }
    .otp-verify #formTelephone .input-group {
      height: 60px !important;
    }
    .otp-verify #formTelephone .input-group .flagInput {
      height: 60px !important;
    }
    .otp-verify #formTelephone .input-group .fugu-tel-input {
      height: 60px !important;
    }
    .otp-verify #SignUpformTelephone .input-group {
      height: 60px !important;
    }
    .otp-verify #SignUpformTelephone .input-group .flagInput {
      height: 60px !important;
    }
    .otp-verify #SignUpformTelephone .input-group .fugu-tel-input {
      height: 60px !important;
    }
    .otp-verify .addFormData {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-left: 1%;
      margin-right: 1%;
    }
    .otp-verify .input-group {
      border: none;
      box-shadow: none;
    }
    .otp-verify #showPassword #eye-icon {
      fill: #999;
    }
    .otp-verify #showPassword #eye-icon.selected {
      fill: var(--blue) !important;
    }
    .otp-verify #showPassword:hover #eye-icon {
      fill: var(--blue);
    }
    .otp-verify .eye {
      position: absolute;
      top: 20px;
      right: 10px;
      z-index: 10;
    }

    `
  }
};
