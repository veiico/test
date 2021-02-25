import { Component } from '@angular/core';
import { SessionService } from '../../../../services/session.service';

declare var $:any;
@Component({
    selector: "app-login-signup-fragment",
    templateUrl: "./login-signup-fragment.component.html",
})
export class LoginSignupFragmentComponent {
    public config: any;
    constructor(private sessionService: SessionService) {
    }
    ngOnInit() {
        this.config = this.sessionService.get('config');
    }
    ngAfterViewInit(){
        $('#loginDialog').modal('show');
    }
}
