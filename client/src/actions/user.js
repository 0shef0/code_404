import { UPDATE_SUCCESS, UPDATE_FAIL, REGISTER_SUCCESS, REGISTER_FAIL, SET_MESSAGE, DELETE_SUCCESS, DELETE_FAIL } from "./types";

  
  import UserService from "../services/user.service";
  
  export const createUser = (username, email, password, confirm_password, role) => (dispatch) => {
    let roleArr = []
    roleArr.push(role)
    return UserService.createUser(username, email, password, confirm_password, roleArr).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
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
          type: REGISTER_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };

  export const deleteUser = (user_id) => (dispatch) => {
    return UserService.deleteUser(user_id).then(
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

    export const updateUser = (user_id, username, email) => (dispatch) => {
      return UserService.updateUser(user_id, username, email).then(
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