import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuguTelInputComponent } from './fugu-tel-input.component';
import { FuguIntelInputService } from './fugu-tel-input.service';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        JwCommonModule, 
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        FuguTelInputComponent,
    ],
    exports: [
        FuguTelInputComponent
    ],
    providers: [
        FuguIntelInputService
    ]
})
export class FuguTelInputModule {
}
