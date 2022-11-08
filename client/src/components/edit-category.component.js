import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { Navigate } from "react-router-dom";

import { connect } from "react-redux";
import { updateCategory } from "../actions/category";
import "../App.css";
import CategoryService from "../services/category.service";

class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);

    this.state = {
      title: "",
      description: "",
      successful: false,
    };
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

  componentDidMount() {
    CategoryService.getCategory(this.props.category_id).then(
      response => {
        this.setState({
          title: response.data.title,
          description: response.data.description,
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
        dispatch(updateCategory(this.props.category_id, this.state.title, this.state.description))
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
    
    if(this.state.successful === true) {
      return <Navigate to="/admin/category"/>
    }

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <Form
            onSubmit={this.handleEdit}
            ref={(c) => {
              this.form = c;
            }}
          >
              <div>
                <div className="form-group">
                  <label htmlFor="title">title</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChangeTitle}
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
  return {
    message,
  };
}

export default connect(mapStateToProps)(EditCategory);