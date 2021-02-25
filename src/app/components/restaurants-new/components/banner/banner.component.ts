/**
 * Created by cl-macmini-51 on 18/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { BannerService } from "./banner.service";
import { GoogleAnalyticsEventsService } from "../../../../services/google-analytics-events.service";
import { GoogleAnalyticsEvent } from "../../../../enums/enum";
import { MessageService } from "../../../../services/message.service";
import { takeWhile } from 'rxjs/operators';
import { DeliveryMethod } from '../../../../enums/enum';


// declare var $: any;

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public ecomView;
  public showMultipleBanners: boolean;
  public newList: any = [];
  public inHeaderView: boolean = false;
  public screenWidth: any;
  public is3dEnabled: boolean = false;
  interval;
  public deliveryHTMLToShow = 1;

  @Input() showAutoComplete: string;
  alive = true;
  availableMerchant: any;
  deliveryMode: string = '1';
  carousel: any;
  newListfigure: any;
  nav: any;
  numImages: any;
  theta: number;
  currImage: number;
  figure: any;
  gap: any;
  bfc: boolean;
  images: any =[];
  timer;
  bannerInterval;

  constructor(protected appService: AppService, public sessionService: SessionService,
    public bannerService: BannerService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService, public router: Router) {
    this.setConfig();
    this.setLanguage();
    this.ecomView = (this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2);
  }

  // =====================life cycles==========================
  ngOnInit() {
    this.subscriptionForListeningMessage();
    if( this.config && this.config.is_banners_enabled){
      this.getBanner();
    }
  }
  private swipeCoord?: [number, number];
private swipeTime?: number;

swipe(e: TouchEvent, when: string, currentIndex?): void {
  const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
  const time = new Date().getTime();

  if (when === 'start') {
    this.swipeCoord = coord;
    this.swipeTime = time;
  } else if (when === 'end') {
    const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
    const duration = time - this.swipeTime;

    if (duration < 1000 //
      && Math.abs(direction[0]) > 30 // Long enough
      && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        if(swipe == 'next'){
          document.getElementById('click-event').click();
        }else if(swipe == 'previous'){
          document.getElementById('prev').click();
        }
    }
  }
}

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if(!this.sessionService.isPlatformServer() && this.timer){
      clearInterval(this.timer);
    }
    if(!this.sessionService.isPlatformServer() && this.bannerInterval){
      clearInterval(this.bannerInterval);
    }
    if (!this.sessionService.isPlatformServer()) {
      clearInterval(this.interval);
    }
    this.alive = false;
  }

  // ===============set config==================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.sessionService.set('user_id', this.config.marketplace_user_id);
      this.terminology = this.config.terminology;
      this.showMultipleBanners = this.config.is_banners_enabled ? true : false;
    }
  }

  // ==================set language and direction===============
  setLanguage() {
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }

    this.langJson = this.appService.getLangJsonData();
  }

  /**
   * getBanner details
   */
  getBanner() {
    this.is3dEnabled = false;
    if(!this.sessionService.isPlatformServer() && this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
    const obj: any = {
      'marketplace_reference_id': this.config.marketplace_reference_id,
      'marketplace_user_id': this.config.marketplace_user_id
    };
    if(this.deliveryMode == '2') {
      obj['delivery_method'] = 1;
    } else if (this.deliveryMode == '1') {
      obj['delivery_method'] = 0;
    }
    else if (this.deliveryMode == '8') {
      obj['delivery_method'] = 2;
    }
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    if (this.sessionService.get('location')) {
      const lat = this.sessionService.get('location').lat;
      const lng = this.sessionService.get('location').lng;
      if (lat && lng) {
        obj.latitude = lat;
        obj.longitude = lng;
      }
    }

    this.bannerService.getBannerDetails(obj)
      .subscribe(
        response => {
          try {
            this.screenWidth = window.innerWidth;
            if (response.status === 200)  {
              let currentSlide = 1;
              let previousSlide = 1;
              this.newList = response.data.result;
              const is3dEnabled = this.showMultipleBanners && this.newList &&
                      this.newList.length > 1 && this.config.is_3d_banner_enabled === 1 && this.screenWidth > 768
              if (is3dEnabled) {
                this.is3dEnabled = true;
              } else if (this.newList && this.newList.length > 0 && this.showMultipleBanners) {
                if (!this.sessionService.isPlatformServer()) {
                  this.interval = setInterval(function () {
                    const profileDropOpen = document.getElementsByClassName('open');
                    let openDrop = (profileDropOpen && profileDropOpen[0]) ? true :false;
                    const profileDrop = document.querySelector('.profileDrop') as HTMLElement ;
                    if(document.getElementById('click-event') && ((currentSlide >1 && currentSlide != previousSlide) || currentSlide==1)){
                      document.getElementById('click-event').click();
                      previousSlide = currentSlide;
                      currentSlide++;
                    }
                    if(openDrop){
                      profileDrop.click();
                    }
                  }, 5000);
                }
              } else {
                //this.showMultipleBanners = false;
              }
              if(this.is3dEnabled) {
             this.timer = setTimeout(()=> {
                this.initiate3DCorosoul();
                if (document.getElementsByClassName("bannerComponent") && document.getElementsByClassName("bannerComponent").length > 0) {
                document.getElementsByClassName("bannerComponent")[0].setAttribute("style", "background-color: white")
                }
               }, 0);
            }
          } else if (response.status === 400) {
            }
          } catch (e) {
            // console.log(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }
  initiate3DCorosoul() {
    this.carousel = document.querySelector('.carousel');
    this.figure = this.carousel.querySelector('figure');
    this.numImages = this.newList.length;
    this.theta =  (2 * Math.PI) / this.numImages;
    this.currImage = 0;
    this.initiateCorosoul(this.carousel);
  }
  initiateCorosoul(root) {
  let img = this.figure.children;
  this.images = [].slice.call(img);
		this.gap = root.dataset.gap || 0;
    this.bfc = 'bfc' in root.dataset;
    this.setupCarousel(this.images.length, parseFloat(getComputedStyle(this.images[0]).width));
  }
setupCarousel(n, s) {
		let	apothem = s / (2 * Math.tan(Math.PI / n));

		this.figure.style.transformOrigin = `50% 50% ${- apothem}px`;
    this.images[0].style.position = 'relative';
		for (let i = 0; i < n; i++) {
      this.images[i].style.padding = `${this.gap}px`;
    }
		for (let i = 1; i < n; i++) {
      this.images[i].style.transform = `rotateY(${i * this.theta}rad)`;
      this.images[i].style.zIndex = "auto";
      this.images[i].style.transformOrigin = `50% 50% ${- apothem}px`;
      //this.images[i].style.opacity = 0;
		}
		if (this.bfc)
			for (let i = 0; i < n; i++) {
         this.images[i].style.backfaceVisibility = 'hidden';
      }

    this.rotateCarousel(this.currImage);
    this.bannerInterval = setInterval(()=> {
      if (this.is3dEnabled) {
       this.onClick(true);
      }
     }, 6000);
  }
  rotateCarousel(imageIndex) {
    this.figure.style.transform = `rotateY(${imageIndex * -this.theta}rad)`;
    this.images[(this.currImage)% (this.numImages)].style.zIndex = 1000;

	}


  onClick(value) {
    this.images[(this.currImage)%(this.numImages)].style.zIndex = "auto";
    if(value) {
      this.currImage++;
    } else {
      if(this.currImage === 0) {
        this.currImage = this.numImages - 1;
      } else {
      this.currImage--;
      }
    }
    this.rotateCarousel(this.currImage);
}


  /**
   * go to particular restaurant
   */
  goToParticularRestaurant(data) {
         if(data.external_link){
          window.open(data.external_link, "_blank");
         }
    if (this.sessionService.get('location')) {
      const obj = {
        'marketplace_reference_id': this.config.marketplace_reference_id,
        'marketplace_user_id': this.config.marketplace_user_id,
        'latitude': this.sessionService.get('location').lat,
        'longitude': this.sessionService.get('location').lng,
        'user_id': data.merchant_id,
        // 'access_token' : this.sessionService.get('appData').vendor_details.app_access_token,
      };
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }


      this.bannerService.getSingleRestaturant(obj)
        .subscribe(
          response => {
            try {
              if (response.status === 200) {
                this.navigate(response.data[0]);
              } else if (response.status === 400) {
              }
            } catch (e) {
              console.error(e);
            }
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  /**
   * navigate to particular restaurant
   * @param item
   */
  navigate(item) {
    this.sessionService.set('info', item);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_click, item.store_name, '', '');
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_detail_order_online, item.store_name, '', '');
    const id = this.sessionService.getByKey('app', 'rest_id') || undefined;
    this.sessionService.remove('preOrderTime');
    if (id !== item.storefront_user_id) {
      this.messageService.clearCartOnly();
      // this.cartService.cartClearCall();
      this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
      // try {
      //
      // } catch (e) {
      // }
    } else {
      this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
    }

  }


  /**
   * subscription for listing message event
   */
  subscriptionForListeningMessage() {
    this.messageService.getMessage()
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
        if(this.availableMerchant) {
          this.availableMerchant.data = [];
        }
        // if( this.config && this.config.is_banners_enabled){
        //   this.getBanner();
        // }
      });
      this.messageService.merchantList.pipe(takeWhile(_ => this.alive)).subscribe(next=> {
        this.deliveryMode = this.sessionService.getString("deliveryMethod");
        this.availableMerchant = next;
        // if( this.config && this.config.is_banners_enabled){
        //   this.getBanner();
        // }
      })
  }


}
