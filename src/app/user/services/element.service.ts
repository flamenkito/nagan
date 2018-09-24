import { Injectable } from '@angular/core';
import { LoadableScriptModel } from '@app/user/models';
import { Logger } from '@app/shared/logger';
import { IMap } from '@app/shared/models';
import { Observable } from 'rxjs';

const Log = Logger('ElementService');

@Injectable()
export class ElementService {
  private loaded: IMap<boolean> = {};

  constructor() {
    const customElementsDefine = window.customElements.define;
    window.customElements.define = (name, ...args) => {
      if (!customElements.get(name)) {
        customElementsDefine.call(window.customElements, name, ...args);
      } else {
        this.loaded[name] = true;
      }
    };
  }

  isLoaded(selector: string) {
    return this.loaded[selector];
  }

  public tryLoad(script: LoadableScriptModel): Observable<void> {
    return Observable.create(observer => {
      const selector = script.selector;

      // Complete if already loaded
      if (this.loaded[selector]) {
        observer.next();
        observer.complete();
      } else {
        // Add the script
        this.loaded[selector] = false;
        // Load the script
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.async = true;
        scriptElement.src = script.url;

        scriptElement.onload = () => {
          this.loaded[selector] = true;
          observer.next();
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error(error);
        };

        document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }
}
