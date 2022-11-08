import React, { Component } from "react";

import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";

import CommentService from "../services/comment.service";

import "../App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { deleteComment} from "../actions/post";
import { Link, Navigate } from "react-router-dom";

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

class Comment extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.addDislikeComment = this.addDislikeComment.bind(this)
    this.addLikeComment = this.addLikeComment.bind(this)
    this.deleteReaction = this.deleteReaction.bind(this)

    this.state = {
      likesComment: [],
      loading: false,
      successful: false,
      successfulDelPost: false
    };
  }

  componentDidMount() {
    CommentService.getLikes(this.props.comment_id).then(
      response => {
        console.log(response.data)
        this.setState({
          likesComment: response.data
        })
      },
      error => {
        this.setState({
          likesComment:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    )
  }

  addLikeComment(e) {
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          createLikeComment(this.props.comment_id, "like")
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

  addDislikeComment(e) {
    e.preventDefault();

    this.setState({
      successfulDelPost: true,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          createLikeComment(this.props.comment_id, "dislike")
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
          deleteLikeComment(this.props.comment_id)
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



  handleDeleteComment(e) {
    console.log(e)
    let id = e.target.attributes.value.value
    e.preventDefault();

    this.setState({
      successful: false,
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.props
        .dispatch(
          deleteComment(id)
        )
        .then(() => {
          window.location.reload()
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

  render() {
    const {message} = this.props
    const { user: currentUser } = this.props

    let exist = false 
    this.state.likesComment.forEach(like => {
      if(like.userId === currentUser.id){
        exist = true
      }
    })

    return (
      <div className="container">
        <div className ="card col-xl-12 newblya" key={this.props.comment_id}>
          <div className="newblya-content">
            <p>{this.props.comment_content}</p>
          </div>
          <div className="newblya-footer">
            <div>
            {this.props.comment_username}
            </div>
          </div>
          <div className="newblya-footer">
            <div className="control">
            {currentUser && (currentUser.id === this.props.comment_userId) && 
                          <div>
                            <Form
                              onSubmit={this.handleDeleteComment}
                              value={this.props.comment_id}
                              ref={(c) => {
                              this.form = c;
                              }}
                            >
                              <div className="form-group">
                                <button className="btn btn-primary btn-block">Delete Comment</button>
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
            {currentUser && (currentUser.id === this.props.comment_userId) &&       
                            <div>
                              <Link to={"/comment/" + this.props.comment_id + "/edit"} className="nav-link">
                                <button className="btn btn-primary btn-block">Edit Post</button>
                              </Link>
                            </div>
            }
                          
            </div>
            <div className="likes">
                    {currentUser && !exist && 
                            <div>
                                <Form action="" onSubmit={this.addLikeComment}
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
                                <Form action="" onSubmit={this.addDislikeComment}
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
                        {currentUser && exist && <div>
                                <Form action="" onSubmit={this.deleteReaction}
                                    ref={(c) => {
                                        this.form = c;
                                    }}
                                >
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

export default connect(mapStateToProps)(Comment);