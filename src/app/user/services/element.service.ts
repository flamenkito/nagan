import { Injectable } from '@angular/core';
import { ScriptModel } from '@app/user/models';

@Injectable()
export class ElementService {
  load(element: ScriptModel): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!element) {
        reject(new Error('Missing element'));
      }
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = element.url;
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(error);
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }

  // async broadcast(state: any) {
  //   await Promise.all(
  //     Object.keys(this.scripts)
  //       .map(key => this.scripts[key])
  //       .filter(script => script.loaded)
  //       .map(async ({ name }) => {
  //         const element = document.querySelector(name);
  //         element.setAttribute('state', JSON.stringify(state));
  //       })
  //   );
  // }

  // _load(name: string): void {
  //   const configItem = this.scripts[name];

  //   if (configItem.loaded) {
  //     return;
  //   }

  //   const content = document.getElementById('content');

  //   const script = document.createElement('script');
  //   script.src = configItem.path;
  //   content.appendChild(script);

  //   const element: HTMLElement = document.createElement(configItem.name);
  //   content.appendChild(element);

  //   element.addEventListener('message', msg => this.handleMessage(msg));
  //   element.setAttribute('state', 'init');

  //   script.onerror = () => console.error(`error loading ${configItem.path}`);

  //   //  this.stateService.registerClient(element);
  // }

  // handleMessage(msg): void {
  //   console.log('shell received message: ', msg.detail);
  // }
}
