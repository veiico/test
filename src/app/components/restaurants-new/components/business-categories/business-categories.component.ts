/**
 * Created by cl-macmini-51 on 10/09/18.
 */
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { BusinessCategoriesService } from "./business-categories.service";
import { SessionService } from "../../../../services/session.service";
import { MessageService } from "../../../../services/message.service";
import { GoogleAnalyticsEventsService } from "../../../../services/google-analytics-events.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GoogleAnalyticsEvent } from '../../../../enums/enum';
import { takeWhile } from 'rxjs/operators';
import { RestaurantsService } from '../../restaurants-new.service';


declare var $: any;

@Component({
  selector: "app-business-categories",
  templateUrl: "./business-categories-new.component.html",
  styleUrls: ["./business-categories-new.component.scss"]
})
export class BusinessCategoriesComponent
  implements OnInit, OnDestroy, AfterViewInit {
  first_radius: any;
  public config: any;
  public list: Array<any> = [];
  public newList: Array<any> = [];
  public showCategories: boolean;
  public showArrows: boolean;
  selectedBusinessCategory: any[];
  public clientWidth: number;
  public repeatLength: number;
  public lastPage: boolean;
  public mapInitCheck: Boolean = false;
  isPlatformServer: boolean;
  serverList;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  firstPage = true;
  numVisible = 4;
  selected: number;
  businessCategoryPage:boolean;
  @Output() hideCategoryPage: EventEmitter<boolean> = new EventEmitter<boolean>();
  showCategoriesBusinessCategoriesPage :boolean;
  alive: boolean = true;
  public showBoxCategories:boolean = false;
  constructor(
    public businessCategoriesService: BusinessCategoriesService,
    public sessionService: SessionService,
    public messageService: MessageService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public router: Router,
    public restaurantService: RestaurantsService,
    protected route: ActivatedRoute
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    // this.serverList = this.newList.length > this.numVisible ? this.serverList : this.newList ; 
    this.setConfig();
    if(this.sessionService.get("config") && this.sessionService.get("config").is_business_category_enabled){
      this.getCategories();
    }
    if (this.sessionService.get('mapView') == true) {
      this.mapInitCheck = true;
    } else {
      this.mapInitCheck = false;
    }
    this.subscriptionForListeningMessage();
    this.restaurantService.reloadPage
    .pipe(takeWhile(_ => this.alive))
    .subscribe(res => {
      if(res === false) {
        if(this.showCategoriesBusinessCategoriesPage === true) {
          this.showBoxCategories = true;
          this.businessCategoryPage = true;
        } else 
        {
          this.showBoxCategories = false;  }
      }
      this.hideCategoryPage.emit(false);
    });
  }
  private swipeCoord?: [number, number];
private swipeTime?: number;

  swipe(e: TouchEvent, when: string, currentIndex?): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    const el = document.querySelector('.ui-carousel-items') as HTMLElement;
    if(this.clientWidth < 768  && el){
      el.style.transitionDuration = '0.25s'
    }
  
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
          if(swipe == 'previous'){
            document.getElementsByClassName('ui-carousel-prev-button')[0].id = "right"
            document.getElementById('right').click();
          }else if(swipe == 'next'){
            document.getElementsByClassName('ui-carousel-next-button')[0].id = "left"
            document.getElementById('left').click();
          }
      }
    }
  }

  /**
   * set config value
   */
  setConfig() {
    this.config = this.sessionService.get("config");
    if (this.config) {
      this.showCategories = this.config.is_business_category_enabled
        ? true
        : false;

      this.showCategoriesBusinessCategoriesPage = (this.config.is_business_category_enabled && this.config.business_category_page)
        ? true
        : false;
      this.businessCategoryPage = this.showCategoriesBusinessCategoriesPage;

      if(this.businessCategoryPage === true) {
        this.showBoxCategories = true;
      }
    }

    if (this.businessCategoryPage) {
      this.messageService.merchantsLoaded
        .pipe(takeWhile(_ => this.alive))
        .subscribe((res) => {
          if (this.businessCategoryPage && res) {
            this.businessCategoryPage = false;
            this.hideCategoryPage.emit(true);
          }
        });
    }

  }
  /**
   * get business categories
   */
  getCategories() {
    const obj = {
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
      marketplace_user_id: this.config.marketplace_user_id,
      version: 2
};
 if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      }
      if(this.sessionService.get('location') && this.sessionService.get('location').lat && this.sessionService.get('location').lng)
      {
        obj['latitude']= this.sessionService.get('location').lat
        obj['longitude']=this.sessionService.get('location').lng
      }
  
    this.businessCategoriesService.getBusinessCategories(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            // this.list.push({
            //   id: 0,
            //   name: "All",
            //   icon: "assets/img/allCat.svg"
            // });
            this.list = response.data.result;
            if(this.list.length > 0) {
              this.serverList = new Array(8);
              this.selectedBusinessCategory = this.list.filter(
                o =>
                  (o.id ==
                Number(this.sessionService.getString('bId')))
              );
              if(this.selectedBusinessCategory[0])
              {
                this.messageService.sendCategoryName(this.selectedBusinessCategory[0].name);
              }
            else
              {
              this.list.forEach((elem) => {
                if(elem.is_all_category) {
               //   this.selected = elem.id;
                  this.messageService.sendCategoryName(elem.name);
                }
              });
            } 
           } 
        else {
              if (!this.isPlatformServer) {
                if (this.showCategoriesBusinessCategoriesPage) {
                  this.businessCategoryPage = false;
                  this.hideCategoryPage.emit(true);
                }
              }
            } 
            if(!this.sessionService.get('config').is_custom_order_active){
              this.list = this.list.filter((category) => !category.is_custom_order_active);
            }
            /**
             * check to remove single all category
             */
            if(this.list && this.list.length == 1 && this.list[0].is_all_category) {
              this.list = [];

              if (!this.isPlatformServer) {
                if (this.showCategoriesBusinessCategoriesPage) {
                  this.businessCategoryPage = false;
                  this.hideCategoryPage.emit(true);
                }
              }
            }
            // this.list.unshift({
            //   id: 0,
            //   name: "All",
            //   icon: "assets/img/allCat.svg"
            // });

            this.checkWidth();

          } else if (response.status === 400) {
            if (!this.isPlatformServer) {
              if (this.showCategoriesBusinessCategoriesPage) {
                this.businessCategoryPage = false;
                this.hideCategoryPage.emit(true);
              }
            }
          }
          this.selected = this.sessionService.get('bId');
        } catch (e) {
          if (!this.isPlatformServer) {
            if (this.showCategoriesBusinessCategoriesPage) {
              this.businessCategoryPage = false;
              this.hideCategoryPage.emit(true);
            }
          }
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  /**
   * select business category
   * @param data for particular category
   */
  selectCategory(data) {
    if (this.route.snapshot.queryParams['bId']) {
      this.router.navigate(['/list'], { replaceUrl: true });
    }
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.business_category, data.name, '', '');
    if(data.external_link){
      // if (this.sessionService.get('appData')) {
      //   window.open(data.external_link, "_blank");
      // } else {
      //   this.messageService.getLoginSignupLocation('From Checkout Button');
      //   $('#loginDialog').modal('show');
      // }
      window.open(data.external_link, "_blank");
    } 
    else if (data.is_custom_order_active) {
      if (this.sessionService.get('appData')) {
        this.router.navigate(['customCheckout']);
      } else {
        this.messageService.getLoginSignupLocation('From Checkout Button');
        $('#loginDialog').modal('show');
      }
    } else { 
      this.businessCategoryPage = false;
      this.showBoxCategories = false;
      this.hideCategoryPage.emit(true);
      this.sessionService.setString("bId", data.is_all_category ? 0 : data.id);
      this.selected = data.id;
      this.messageService.sendCategoryName(data.name);
      this.messageService.sendBusinessCategory({ id: data.is_all_category ? 0 : data.id });
    }
    this.selected = data.id;   
  }

  /**
   * check width of device
   */
  checkWidth() {
    // console.log(
    //   window.innerWidth ||
    //   document.documentElement.clientWidth ||
    //   document.body.clientWidth
    // );
    this.newList = [];
    this.clientWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    this.repeatLength = 0;

    if(this.clientWidth >= 1200){
      this.numVisible = 10;
    }
    else if (this.clientWidth > 992 && this.clientWidth < 1200) {
      this.numVisible = 8;
    } else if (this.clientWidth > 768 && this.clientWidth <= 992) {
      this.numVisible = 7;
    } else if (this.clientWidth > 560 && this.clientWidth <= 768) {
      this.numVisible = 7;
    } else {
      this.numVisible = 3;
    }

    const totalPage = Math.ceil(this.list.length / this.numVisible);
    this.newList = [...this.list];
    if (totalPage > 1 &&  totalPage !== (this.list.length / this.numVisible)) {
      const totalSlots =  totalPage * this.numVisible;
      const blankSlots = totalSlots - this.list.length;
      const secondLastPageLastIndex = (totalPage - 1) * this.numVisible;
      this.newList.splice(secondLastPageLastIndex, 0, ...this.newList.slice(secondLastPageLastIndex - blankSlots, secondLastPageLastIndex));
    }

    if (totalPage === 1) {
      this.lastPage =  true;
    }
    this.serverList = new Array(8);
    // } else {
    //   this.lastPage =  false;
    // }

  }

  /**
   * check for desktop centralization
   */
  // centralisedParam(data) {
  //   switch (data.length) {
  //     case 1:
  //       return 1;
  //     case 2:
  //       return 2;
  //     case 3:
  //       return 3;
  //     default:
  //       return 4;
  //   }
  // }

  /**
   * divide array for caraousel
   */
  // divideArray(repeatLength, data) {
  //   this.newList = [];
  //   for (let i = 0; i < data.length; i += repeatLength) {
  //     this.newList.push(data.slice(i, i + repeatLength));
  //   }
  // }

  /**
   * check arrows to show
   */
  // checkArrowsToShow(repeatLength, data) {
  //   switch (repeatLength) {
  //     case 4:
  //       if (data.length > 4) {
  //         this.showArrows = true;
  //       } else {
  //         this.showArrows = false;
  //       }
  //       break;
  //     case 3:
  //       if (data.length > 3) {
  //         this.showArrows = true;
  //       } else {
  //         this.showArrows = false;
  //       }
  //       break;
  //     case 1:
  //       if (data.length > 1) {
  //         this.showArrows = true;
  //       } else {
  //         this.showArrows = false;
  //       }
  //       break;
  //   }
  // }

  /**
   * window resize event
   */
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.checkWidth();
  }

  onPage(event) {
    this.lastPage = (event.page + 1) === Math.ceil(this.list.length / this.numVisible) ? true : false;
    this.firstPage = event.page === 0 ? true : false;
  }

  ngOnDestroy() {
    this.alive = false;
  }
    /**
   * subscription for listing message event
   */
  subscriptionForListeningMessage() {
    this.messageService.getMessage()
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
        if( this.config && this.config.is_business_category_enabled){
          this.getCategories()
        }
      });
      this.messageService.merchantList.pipe(takeWhile(_ => this.alive)).subscribe(next=> {
        if( this.config && this.config.is_business_category_enabled){
          this.getCategories()
        }
      })
  }

}
