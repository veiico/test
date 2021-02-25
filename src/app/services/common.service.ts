import { Injectable } from '@angular/core';
declare var __insp;

@Injectable()
export class CommonService {
  public getParams(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

  /*load script for jini */
  insertInspectletScript(id) :Promise<boolean> {
    return new Promise((resolve, reject) => {
      (window as any).__insp = (window as any).__insp || [];
      __insp.push(['wid', id]);
      let loadInspectlet = function () {
      if (typeof (window as any).__inspld != "undefined") return;
      (window as any).__inspld = 1;
      let insp = document.createElement('script');
      insp.type = 'text/javascript';
      insp.async = true;
      insp.id = "inspsync";
      // insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=865942142&r=' + Math.floor(new Date().getTime() / 3600000);
      insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid='+id +'&r=' + Math.floor(new Date().getTime() / 3600000);
      let x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(insp, x);
      insp.onload = ()=>{
        resolve(true)
      }
      };
      setTimeout(() => {
        loadInspectlet();
      }, 0);
    });
  }
}
