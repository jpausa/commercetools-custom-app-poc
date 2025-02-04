import { lazy } from 'react';

const PricesUploadForm = lazy(
  () => import('./prices-upload-form' /* webpackChunkName: "prices-upload-form" */)
);

export default PricesUploadForm;
