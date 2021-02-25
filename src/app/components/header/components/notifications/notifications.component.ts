import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HeaderService } from "../../header.service";
import { SessionService } from "../../../../services/session.service";
import { AppService } from "../../../../app.service";
import { NavigationEnd, Router } from "@angular/router";
import { MessageService } from "../../../../services/message.service";
import { fadeInOutDOM } from "../../../../animations/fadeInOut.animation";

declare var $: any;

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  animations: [fadeInOutDOM]
})
export class NotificationsComponent implements OnInit {
  public vendor_id;
  public access_token;
  public isFetchingNotification;
  formSettings: any;
  notificationData = [];
  isNotificationPopupOpen = false;
  offset = 0;
  limit = 7;
  notifyFlag = true;
  // router: Router;
  langJson: any = {};
  count = 0;
  totalCount = 0;
  id: any;
  terminology: any = {};
  @Output()
  logout: EventEmitter<any> = new EventEmitter<any>();
  languageStrings: any={};
  constructor(
    protected headerService: HeaderService,
    protected sessionService: SessionService,
    protected appService: AppService,
    protected messageService: MessageService,
    public router: Router
  ) { }

  ngOnInit() {
    this.initData();
    this.fetchNotifications(true, 0);
    this.setFormSettingsAndTerminlology();
    this.setLangJson();

    this.messageService.addNotificationData.subscribe(data => {
      data.is_read = false;
      data.is_delete = false;
      this.notificationData.unshift(data);
      this.offset++;
      this.count++;
      this.totalCount++;
      // this.loader.hide();
    });
  }

  setFormSettingsAndTerminlology() {
    this.formSettings = this.sessionService.get("config");
    if (this.formSettings && this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology || {};
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.no_notifications_are_available = (this.languageStrings.no_notifications_are_available || "No notifications are available.")
     .replace("NOTIFICATIONS_NOTIFICATIONS", this.terminology.NOTIFICATIONS);
    });
  }

  read(column) {
    this.id = column.app_notif_id;
    this.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    this.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    const data = {
      access_token: this.access_token,
      vendor_id: this.vendor_id,
      push_id: this.id
    };

    this.headerService.readNotification(data).subscribe(
      data => {
        if (data.status === 200) {
          this.count = 0;
          const index = this.notificationData.indexOf(column);
          this.notificationData[index].is_read = true;
          this.sessionService.setToString("job_id", column.job_id);
          if (this.router.url === "/orders") {
            this.messageService.showOrderDetail(
              this.sessionService.getString("job_id")
            );
          }
          if (column.socket_type == 24 || column.push_type ==24) {
            this.router.navigate(["projects"]);
          } else if(column.socket_type == 68 || column.push_type ==68) {
            this.router.navigate(["debtAmount"]);
          }
          else if (column.push_type == 69 || column.push_type == 70 || column.push_type == 71 || column.push_type == 72) {
            this.router.navigate(["subscriptions"]);
          }
          else
            this.router.navigate(["orders"]);
        } else if (data.status === 101) {
          this.logout.emit();
          return;
        } else {
          if (data.message) {
            // showFailure(data.message.toString());
          } else {
            // showFailure('Something went wrong.');
          }
        }
      },
      error => {
        // showFailure('Something went wrong.');
        // hideLoader();
      }
    );

    // switch(column.socket_type){
    //   case 20:
    //     if($state.current.name == 'app.vendor'){
    //       $state.reload();
    //     }else{
    //       $state.go('app.vendor');
    //     }
    //     break;
    //   case 10:
    //     if($state.current.name == 'app.home'){
    //       $state.reload();
    //     }else{
    //       $state.go('app.home');
    //     }
    //     break;
    // }
    // Close the popup
    $("#notificationContainer").hide();
  }
  initData() {
    try {
      this.vendor_id = this.sessionService.get(
        "appData"
      ).vendor_details.vendor_id;
      this.access_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
    } catch (e) {
    }
  }

  setLangJson() {
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      
    });
  }

  toggleContainer() {
    this.isNotificationPopupOpen = !this.isNotificationPopupOpen;

    if (this.isNotificationPopupOpen) {
      this.fetchNotifications(true, 1);
    }

    // $('#notification_count').fadeOut('slow');
    return false;
  }
  onClickOutside(event) {
    if (event && event["value"] === true) {
      $("#notificationContainer").hide();
    }
  }

  clearAllNotification() {

    this.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    this.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    const data = {
      access_token: this.access_token,
      vendor_id: this.vendor_id
      // form_id: $cookieStore.get('formId'),
      // delete_all : 1,
    };

    this.headerService.clearAllNotifications(data).subscribe(
      data => {
        if (data.status === 200) {
          this.count = 0;
          this.offset = 0;
          this.totalCount = 0;
          this.notificationData = [];
          this.notifyFlag = true;
        } else if (data.status === 101) {
          this.logout.emit();
          return;
        } else {
          if (data.message) {
            // showFailure(data.message.toString());
          } else {
            // showFailure('Something went wrong.');
          }
        }
      },
      error => {
        console.error(error);
        // hideLoader();
      }
    );
  }

  fetchNotifications(isFirstTime, readAll) {
    if (this.sessionService.get("appData")) {
      if (!isFirstTime) {
        return;
      }
      this.isFetchingNotification = true;
      const data = {
        access_token: this.access_token,
        vendor_id: this.vendor_id
      };
      if (readAll) {
        data["read_all"] = readAll;
        this.count = 0;
      }
      this.headerService.getNotifications(data).subscribe(
        data => {
          try {
            if (data.status === 200) {
              this.count = data.data.unread_count;
              this.totalCount = data.data.count;
              this.notificationData = data.data.notifications;
            } else if (data.status === 101) {
              this.logout.emit();
              return;
            } else {
              // if(data.message){
              // showFailure(data.message.toString());
              // }else{
              // showFailure('Something went wrong.');
              // }
            }
            this.notifyFlag = this.notificationData.length > 0 ? false : true;
            this.isFetchingNotification = false;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
          this.notifyFlag = this.notificationData.length > 0 ? false : true;
          // showFailure('Something went wrong.');
          this.isFetchingNotification = false;
          // hideLoader();
        }
      );
    }
  }
}
