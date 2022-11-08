import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { Navigate } from "react-router-dom";

import { connect } from "react-redux";
import { updateUser } from "../actions/user";
import "../App.css";
import UserService from "../services/user.service";

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);

    this.state = {
      username: "",
      email: "",
      roles: [],
      successful: false,
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  componentDidMount() {
    UserService.getUser(this.props.user_id).then(
      response => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
          role: response.data.roles
        });
      },
      error => {
        this.setState({
          posts:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
    
  }

  handleEdit(e) {
    e.preventDefault();

    this.setState({
      successful: true,
    });

    this.form.validateAll();

    const { dispatch } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
        dispatch(updateUser(this.props.user_id, this.state.username, this.state.email))
        .then(() => {
            window.location.reload();
          })
          .catch(() => {
            this.setState({
              successful: false
            });
          });
      } else {
        this.setState({
          successful: false,
        });
    }
  }

  render() {
    const { message } = this.props;
    const { user: currentUser } = this.props
    
    if(this.state.successful === true && currentUser.roles.includes("ROLE_USER")) {
      return <Navigate to="/profile"/>
    }
    if (this.state.successful === true && currentUser.roles.includes("ROLE_ADMIN")) {
      return <Navigate to="/admin"/>
    }

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleEdit}
            ref={(c) => {
              this.form = c;
            }}
          >
            
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[vusername]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[email]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Save</button>
                </div>
              </div>

            {message && (
              <div className="form-group">
                <div className={ this.state.successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { message } = state.message;
  const { user } = state.auth
  return {
    message,
    user
  };
}

export default connect(mapStateToProps)(EditUser);