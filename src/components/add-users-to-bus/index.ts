import { lazy } from 'react';

const AddUsersToBUs
 = lazy(
  () => import('./add-users-to-bus' /* webpackChunkName: "add-users-to-bus" */)
);

export default AddUsersToBUs;
