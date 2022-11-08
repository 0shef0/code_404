import { UPDATE_SUCCESS, UPDATE_FAIL, ADD_SUCCESS, ADD_FAIL, SET_MESSAGE, DELETE_SUCCESS, DELETE_FAIL } from "./types";

import PostService from "../services/post.service";

export const create = (title, content, category) => (dispatch) => {
    return PostService.createPost(title, content, category).then(
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

  export const updatePost = (post_id, title, content, categories, status) => (dispatch) => {
    return PostService.updatePost(post_id, title, content, categories, status).then(
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

  export const deletePost = (post_id) => (dispatch) => {
    return PostService.deletePost(post_id).then(
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

  export const createComment = (content, post_id) => (dispatch) => {
    return PostService.createComment(content, post_id).then(
      (data) => {
        dispatch({
          type:  ADD_SUCCESS,
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
            type: ADD_FAIL,
          })

          dispatch({
            type: SET_MESSAGE,
            payload: message
          })

          return Promise.reject()
      }
    )
  }

  export const updateComment = (comment_id, content) => (dispatch) => {
    return PostService.updateComment(comment_id, content).then(
      (data) => {
        dispatch({
          type:  UPDATE_SUCCESS,
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
            type: UPDATE_FAIL,
          })

          dispatch({
            type: SET_MESSAGE,
            payload: message
          })

          return Promise.reject()
      }
    )
  }

  export const deleteComment = (comment_id) => (dispatch) => {
    return PostService.deleteComment(comment_id).then(
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

  export const createLike = (post_id, type) => (dispatch) => {
    return PostService.createLike(post_id, type).then(
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

  export const deleteLike = (post_id) => (dispatch) => {
    return PostService.deleteLike(post_id).then(
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

