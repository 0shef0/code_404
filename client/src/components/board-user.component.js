import React, { Component } from "react";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";


import Categoty from "../services/category.service"

import { connect } from "react-redux";
import { create } from "../actions/post";
import "../App.css";

import { Navigate } from "react-router-dom";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

Array.prototype.remove = function(value) {
  var index = this.indexOf(value)
  if(index !== -1) {
    this.splice(index, 1)
  }
}

class BoardUser extends Component {
  constructor(props) {
    super(props);
    this.handlePost = this.handlePost.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);

    this.state = {
      content: "",
      title: "",
      allCategories: [],
      checked: [],
      loading: false
    };
  }

  onChangeContent(e) {
    this.setState({
      content: e.target.value,
    });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeCategory(e) {
    const target = e.target
    let arr = this.state.checked

    if(target.checked) {
      arr = [...this.state.checked, target.name]
    } else {
      arr.remove(target.name)
    }
    this.setState({
      checked: arr
    });
  }

  componentDidMount() {
    Categoty.getAll().then(
      response => {
        console.log(response.data)
        this.setState({
          allCategories: response.data
        });
      },
      error => {
        this.setState({
          allCategories:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  handlePost(e) {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    this.form.validateAll();

    const { dispatch} = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(create(this.state.title, this.state.content, this.state.checked))
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            loading: false
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { message } = this.props;
    console.log(this.state.allCategories)
    
    if (this.state.loading === true) {
      return <Navigate to="/home" />;
    }
    return (
      <div className="col-md-12">
        <div className="card">

          <Form
            onSubmit={this.handlePost}
            ref={(c) => {
              this.form = c;
            }}
          >
            {!this.state.loading && (
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
                  <label htmlFor="content">content</label>
                  <textarea
                    type="textarea"
                    className="form-control content"
                    name="content"
                    value={this.state.content}
                    onChange={this.onChangeContent}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Categories</label>
                  <div className="checkbox-block">
                    {this.state.allCategories.map(
                      category => 
                        
                        <div className="box" key={category.id}>
                          <label>{category.title}</label>
                          <Input
                            type="checkbox"
                          
                            name={category.title}
                            value={category.title}
                            onChange={this.onChangeCategory}
                          />
                        </div>
                        
                      
                    )}
                  </div>

                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Create</button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div className={ this.state.loading ? "alert alert-success" : "alert alert-danger" } role="alert">
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

export default connect(mapStateToProps)(BoardUser);