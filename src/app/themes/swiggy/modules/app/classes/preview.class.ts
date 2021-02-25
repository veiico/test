import { ThemeService } from "../../../../../services/theme.service";
import { OnInit } from "../../../../../../../node_modules/@angular/core";
import { takeWhile } from "rxjs/operators";

export interface IPreviewConfig {
    [key: string]: {
        styles: any;
        data: any;
        is_enabled: boolean;
    }
}

export interface onPreview {
    alive: boolean;
    onPreview(config: IPreviewConfig);
}

export class Preview implements OnInit, onPreview {
    alive = true;
    static _previewMode =false;

    constructor(themeService: ThemeService) {
        themeService.themeChange.pipe(takeWhile(_ => this.alive))
            .subscribe(
                (data: any) => {
                    // setTimeout(() => {
                        switch (data.type) {
                            case 'Page':
                                const previewDatapage = data;
                                this.onPreview(previewDatapage);
                                break;
                            case 'Module':
                                const previewData = data;
                                // delete previewData['type'];

                                this.onPreview(previewData);
                                break;
                            case 'previewOn':
                                Preview._previewMode = true;
                                break;
                        }

                    // }, 0)
                });
    }

    ngOnInit() {
        console.log('BaseClass');
    }

    onPreview(data) {
        console.log('BaseClass preview');
    }

    get previewOn(){
        return Preview._previewMode;
    }
    set previewOn(val){
        Preview._previewMode = val;
    }
}
