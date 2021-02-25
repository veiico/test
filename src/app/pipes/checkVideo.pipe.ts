import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'checkVideo' })
export class CheckVideoPipe implements PipeTransform {
  transform(value: string): boolean {
    if(typeof(value)==='undefined'){
      return false;
    }
    var videoLink = value.split('.');
    if ((videoLink.includes('mp4') || videoLink.includes('mov') || videoLink.includes('ogg') || videoLink.includes('mkv') && !videoLink.includes('thumbnail'))) {
      return true;
    }
   return false;
  }
}