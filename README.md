# Angular Client Starter

### Temporary fixes

node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js

```js
node: false
```

change to
```js

node: { crypto: true, stream: true, buffer: true }
```

node_modules/@types/pouchdb-core/index.d.ts

```ts
interface RemoteDatabaseConfiguration extends CommonDatabaseConfiguration {
  ajax?: RemoteRequesterConfiguration;
```

add headers

```ts
interface RemoteDatabaseConfiguration extends CommonDatabaseConfiguration {
  ajax?: RemoteRequesterConfiguration;

  /**
   * HTTP headers to add to requests.
   */
  headers?: {
      [name: string]: string;
  };
```