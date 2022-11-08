import React, { Component } from "react";

import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";

import CommentsComponent from "./comments.component";

import PostService from "../services/post.service";
import CommentService from "../services/comment.service";

import "../App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { deleteComment, deletePost, createComment } from "../actions/post";
import { Link, Navigate } from "react-router-dom";

import { createLike, deleteLike } from "../actions/post";
import { createLikeComment, deleteLikeComment } from "../actions/comment";


const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

class Post extends Component {
  constructor(props) {
    super(props);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.addDislike = this.addDislike.bind(this)
    this.addLike = this.addLike.bind(this)
    this.deleteReaction = this.deleteReaction.bind(this)

    this.state = {
      post: {},
      user: {},
      content: "",
      likesPost: [],
      loading: false,
      successful: false,
      successfulDelPost: false
    };
  }

  componentDidMount() {
    PostService.getPost(this.props.post_id).then(
      response => {
        this.setState({
          post: response.data,
          user: response.data.user
        });
      },
      error => {
        this.setState({
          post:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
    PostService.getLikes(this.props.post_id).then(
      response => {
        this.setState({
          likesPost: response.data
        })
      },
      error => {
        this.setState({
          post:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    )
  }

  addLike(e) {
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          createLike(this.props.post_id, "like")
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

  addDislike(e) {
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          createLike(this.props.post_id, "dislike")
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

  deleteReaction(e) {
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          deleteLike(this.props.post_id)
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
  


  handleDeletePost(e) {
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          deletePost(this.props.post_id)
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
    const {user: currentUser } = this.props

    let exist = false 
    this.state.likesPost.forEach(like => {
      if(like.userId === currentUser.id){
        exist = true
      }
    })
    
    if(this.state.successfulDelPost=== true) {
      return <Navigate to={"/posts/" + this.state.post.id}/>
    }


    return (
      <div className="container" >
        <div className="card col-xl-12 newblya">
          <div className="newblya-header">
            <h2>
              {this.state.post.title}
            </h2>
            <p>
              {this.state.post.likesCount}
            </p>
          </div>
          <div className="newblya-content">
            <p>{this.state.post.content}</p>
          </div>
          <div className="newblya-footer">
            <div>
              {this.state.user.username}
            </div>
            <div>
              {this.state.post.status}
            </div>
          </div>
          <div className="newblya-footer">
            <div className="control">
            {currentUser &&
                (currentUser.id === this.state.user.id) && 
                  <div>
                    <Form
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
                  </div>
                }
              <div>
              {currentUser && (currentUser.id === this.state.user.id) && 
              <Link to={"/posts/" + this.state.post.id + "/edit"} className="nav-link">
                <button className="btn btn-primary btn-block">Edit Post</button>
              </Link>
              }
              </div>
            </div>
            <div className="likes">
            {!exist && 
            <div>
            <Form action="" onSubmit={this.addLike}
              ref={(c) => {
                this.form = c;
              }}>             
                <button className="btn btn-primary btn-block">👍</button>
              <CheckButton style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            <Form action="" onSubmit={this.addDislike}
              ref={(c) => {
                this.form = c;
              }}>
                <button className="btn btn-primary btn-block">👎</button>
              <CheckButton style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            </div>}
            {exist && <div>
              <Form action="" onSubmit={this.deleteReaction}
              ref={(c) => {
                this.form = c;
              }}>
                <button className="btn btn-primary btn-block">Delete Reaction</button>

              <CheckButton style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            </div>}
            </div>
          </div>
        </div>
          <CommentsComponent post_id={this.props.post_id}/>
      </div>
    )
  }
}


function mapStateToProps(state) {
  const { message } = state.message;
  const { user } = state.auth;
  return {
    message,
    user
  };
}

export default connect(mapStateToProps)(Post);