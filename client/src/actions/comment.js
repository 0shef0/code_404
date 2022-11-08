import { ADD_SUCCESS, ADD_FAIL, SET_MESSAGE, DELETE_SUCCESS, DELETE_FAIL } from "./types";

import CommentSercvice from "../services/comment.service";

export const createLikeComment = (comment_id, type) => (dispatch) => {
    return CommentSercvice.createLike(comment_id, type).then(
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

  export const deleteLikeComment = (comment_id) => (dispatch) => {
    return CommentSercvice.deleteLike(comment_id).then(
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