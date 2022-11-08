import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { createUser } from "../actions/user";
import { deleteUser } from "../actions/user";

import UserService from "../services/user.service";
import "bootstrap/dist/css/bootstrap.min.css";


import "../App.css";


const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

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

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

class BoardAdmin extends Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this)
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this)

    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      users: [],
      successful: false,
    };
  }

  componentDidMount() {
    UserService.getUsers().then(
      response => {
        console.log(response.data)
        this.setState({
          users: response.data
        });
      },
      error => {
        this.setState({
          users:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
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

  onChangeRole(e) {
    this.setState({
      role: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value,
    });
  }

  handleDeleteUser(e) {
    const value = e.target.attributes.value.value
    e.preventDefault();

    this.setState({
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          deleteUser(value)
        )
        .then(() => {
          window.location.reload();
          this.setState({
            successful: true,
          });
        })
        .catch(() => {
          this.setState({
            successful: false,
          });
        });
    }
  }

  handleCreate(e) {
    e.preventDefault();

    this.setState({
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          createUser(this.state.username, this.state.email, this.state.password, this.state.confirmPassword, this.state.role)
        )
        .then(() => {
          this.setState({
            successful: true,
          });
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            successful: false,
          });
        });
    }
  }

  render() {
    const { message } = this.props;

    return (
      <div className="card">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
          <Link to={"/admin"} className="nav-link active">
              User control
          </Link>
          </li>
          <li className="nav-item">
          <Link to={"/admin/category"} className="nav-link">
              Category control
          </Link>
          </li>
          <li className="nav-item">
          <Link to={"/admin/post"} className="nav-link">
              Post control
          </Link>
          </li>
        </ul>
      </div>
      <div className="row">
      <div className="col-md-4">
        <div className="card card-container">

          <Form
            onSubmit={this.handleCreate}
            ref={(c) => {
              this.form = c;
            }}
          >
            <h3>
              Create User
            </h3>
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
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
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ConfirmPassword">Confirm Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="ConfirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.onChangeConfirmPassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Role</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.role}
                    onChange={this.onChangeRole}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Create</button>
                </div>
              </div>
            )}

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
          <div className="col-md-8"> 
            {this.state.users.map((user) => {
              return(
                <div className ="post d-flex just" key={user.id}>
                    <div className="vl user_admin">
                      <p className="title">
                        username
                      </p>
                      <p>
                        {user.username}
                      </p>
                    </div>
                    <div className="vl user_admin">
                      <p className="title">
                        id
                      </p>
                      <p>
                        {user.id}
                      </p>
                    </div>
                    <div className="vl user_admin">
                      <p className="title">
                        email
                      </p>
                      <p>
                        {user.email}
                      </p>
                    </div>
                    <div className="vl user_admin">
                    <Form
                    value={user.id}
                      onSubmit={this.handleDeleteUser}
                      ref={(c) => {
                        this.form = c;
                      }}
                    >
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Delete User</button>
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
                    <Link to={"/users/" + user.id + "/edit"}>
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Edit User</button>
                      </div>
                    </Link>
                    </div>
                </div>
            )})}
      </div>
    </div>
    </div>
      
    );
  }
}

function mapStateToProps(state) {
  const { message } = state.message;
  return {
    message,
  };
}

export default connect(mapStateToProps)(BoardAdmin);