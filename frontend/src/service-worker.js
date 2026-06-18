/* eslint-disable no-restricted-globals */

// This file exists to satisfy CRA's InjectManifest workbox plugin during build.
// The actual service worker logic is in public/service-worker.js and is
// registered manually in index.js.

// This line is required by react-scripts build to prevent the
// "Can't find self.__WB_MANIFEST" error.
const ignored = self.__WB_MANIFEST;
void ignored;
