import { UPDATE_SUCCESS, UPDATE_FAIL, ADD_SUCCESS, ADD_FAIL, SET_MESSAGE, DELETE_SUCCESS, DELETE_FAIL } from "./types";

import CategoryService from "../services/category.service";

export const updateCategory = (category_id, title, description) => (dispatch) => {
    return CategoryService.updateCategory(category_id, title, description).then(
      (data) => {
        dispatch({
          type: UPDATE_SUCCESS,
          payload: { post: data },
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: UPDATE_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };

export const createCategory = (title, description) => (dispatch) => {
    return CategoryService.createCategory(title, description).then(
      (data) => {
        dispatch({
          type: ADD_SUCCESS,
          payload: { post: data },
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: ADD_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
};

export const deleteCategory = (category_id) => (dispatch) => {
    return CategoryService.deleteCategory(category_id).then(
      (data) => {
        dispatch({
          type:  DELETE_SUCCESS,
          payload: {content: data}
        })
        return Promise.resolve()
      },
      (error) => {
        const message = 
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
          error.message ||
          error.toString()

          dispatch({
            type: DELETE_FAIL,
          })

          dispatch({
            type: SET_MESSAGE,
            payload: message
          })

          return Promise.reject()
      }
    )
  }