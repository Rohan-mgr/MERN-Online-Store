import * as actionTypes from "../action/actionTypes";

const initialState = {
  isEditing: false,
  loading: false,
  selectedProduct: null,
};

const editProduct = (state) => {
  return {
    ...state,
    isEditing: true,
  };
};

const initLoading = (state, action) => {
  return {
    ...state,
    loading: action.status,
  };
};
const finishLoading = (state, action) => {
  return {
    ...state,
    loading: action.status,
  };
};

const selectProduct = (state, action) => {
  return {
    ...state,
    selectedProduct: action.selectedProduct,
  };
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_EDIT_PRODUCT:
      return editProduct(state);
    case actionTypes.INIT_SELECT_PRODUCT:
      return selectProduct(state, action);
    case actionTypes.INIT_LOADING_PRODUCTS:
      return initLoading(state, action);
    case actionTypes.FINISH_LOADING_PRODUCTS:
      return finishLoading(state, action);
    default:
      return state;
  }
};

export default productReducer;
