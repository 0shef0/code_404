import React, { Component } from "react";

import PostService from "../services/post.service";
import { connect } from "react-redux";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { deletePost } from "../actions/post";

import "../App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";

class BoardAdminPost extends Component {
  constructor(props) {
    super(props);
    this.handleDeletePost = this.handleDeletePost.bind(this)

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    PostService.getAll().then(
      response => {
        this.setState({
          posts: response.data
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

  handleDeletePost(e) {
    const value = e.target.attributes.value.value
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          deletePost(value)
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

  render() {
    const {message} = this.props

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
          <Link to={"/admin/category"} className="nav-link">
              Category control
          </Link>
          </li>
          <li className="nav-item">
          <Link to={"/admin/post"} className="nav-link active">
              Post control
          </Link>
          </li>
        </ul>
      </div>
      <div className="post-container">
            {this.state.posts.map((post) => {
            return(
                <div className ="post d-flex space" key={post.id}>
                    <div className="vl post_admin">
                    <p className="title">
                        title
                    </p>
                    <Link to={"/posts/" + post.id}>
                        {post.title}
                    </Link>
                    </div>
                    <div className="vl post_admin">
                    <p className="title">
                        content
                      </p>
                    <p>
                        {post.content.slice(1, 100) + "..."}
                    </p>
                    </div>
                    <div className="vl post_admin">
                    <p className="title">
                        likes count
                      </p>
                    <p>
                        {post.likesCount}
                    </p>
                    </div>
                    <div className="vl post_admin">
                    <p className="title">
                       author
                      </p>
                    <p>
                      {post.user.username}
                    </p>
                    </div>
                    <div className="vl post_admin">
                    <p className="title">
                        status
                      </p>
                    <p>
                      {post.status}
                    </p>
                    </div>
                    <div className="vl post_admin">
                    <p className="title">
                        categories
                      </p>
                        {post.categories.map(category => {
                        return(
                          <div key={category.id}>
                              {category.title + ", "}
                          </div>
                        )
                        })}
                    </div>
                    <div className="vl post_admin">
                    <Form 
                    value={post.id}
                      onSubmit={this.handleDeletePost}
                      ref={(c) => {
                      this.form = c;
                      }}
                    >
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Delete Post</button>
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
                    <Link to={"/posts/" + post.id + "/edit"} className="nav-link">
                        <button className="btn btn-primary btn-block">Edit Post</button>
                    </Link>
                  </div>
                  
                </div>
            )
            })}
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
  
export default connect(mapStateToProps)(BoardAdminPost);