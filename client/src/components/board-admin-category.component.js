import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { createCategory } from "../actions/category";
import { deleteCategory } from "../actions/category";

import CategoryService from "../services/category.service";
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

class BoardAdminCategory extends Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this)

    this.state = {
        title: "",
        description: "",
        categories: [],
        successful: false,
    };
  }

  componentDidMount() {
    CategoryService.getAll().then(
      response => {
        this.setState({
          categories: response.data
        });
      },
      error => {
        this.setState({
          categories:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  handleDeleteCategory(e) {
    const value = e.target.attributes.value.value
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          deleteCategory(value)
        )
        .then(() => {
          this.setState({
            successfulDelPost: true,
          });
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            successfulDelPost: false,
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
          createCategory(this.state.title, this.state.description)
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
          <Link to={"/admin"} className="nav-link">
              User control
          </Link>
          </li>
          <li className="nav-item">
          <Link to={"/admin/category"} className="nav-link active">
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
                Create Category
            </h3>
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="title">title</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChangeTitle}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">description</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    validations={[required]}
                  />
                </div>


                <div className="form-group">
                  <button className="btn btn-primary btn-block">Create Category</button>
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
      {this.state.categories.map((category) => {
            return(
                <div className ="post d-flex just" key={category.id}>
                    <div className="vl user_admin">
                        <p className="title">
                            title
                        </p>
                    <p>
                            {category.title}
                    </p>
                    </div >
                    <div className="vl user_admin">
                        <p className="title">
                            id
                        </p>
                    <p>
                        {category.id}
                    </p>
                    </div >
                    <div className="vl user_admin">
                        <p className="title">
                            description
                        </p>
                    <p>
                        {category.description}
                    </p>
                    </div>
                    <div className="vl user_admin">
                    <Form
                    value={category.id}
                      onSubmit={this.handleDeleteCategory}
                      ref={(c) => {
                      this.form = c;
                      }}
                    >
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Delete Category</button>
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
                    <Link to={"/category/" + category.id + "/edit"} className="nav-link">
                        <button className="btn btn-primary btn-block">Edit Category</button>
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

export default connect(mapStateToProps)(BoardAdminCategory);