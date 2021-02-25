import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WechatComponent } from './wechat.component';
import { WechatService } from './wechat.service';

@NgModule({
  declarations: [WechatComponent],
  imports: [
    CommonModule
  ],
  exports: [WechatComponent],
  providers: [WechatService]
})
export class WechatModule { }
