import { createTypedHooks, createStore } from 'easy-peasy';
import model, { StoreModel } from './model';

const store = createStore(model);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export default store;
