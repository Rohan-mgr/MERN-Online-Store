import * as actionTypes from "./actionTypes";

export const editProduct = () => {
  return {
    type: actionTypes.INIT_EDIT_PRODUCT,
  };
};
export const selectProduct = (product) => {
  return {
    type: actionTypes.INIT_SELECT_PRODUCT,
    selectedProduct: product,
  };
};

export const initLoading = () => {
  return {
    type: actionTypes.INIT_LOADING_PRODUCTS,
    status: true,
  };
};
export const finishLoading = () => {
  return {
    type: actionTypes.FINISH_LOADING_PRODUCTS,
    status: false,
  };
};
