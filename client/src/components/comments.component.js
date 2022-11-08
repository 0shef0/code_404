import React, { Component } from "react";

import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";

import CommentComponent from "./comment.component";

import PostService from "../services/post.service";
import CommentService from "../services/comment.service";

import "../App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { deleteComment, deletePost, createComment } from "../actions/post";
import { Link, Navigate } from "react-router-dom";


const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

class Comments extends Component {
  constructor(props) {
    super(props);
    this.handleComment = this.handleComment.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);


    this.state = {
      post: {},
      user: {},
      content: "",
      comments: [],
      loading: false,
      successful: false,
      successfulDelPost: false
    };
  }

  componentDidMount() {
    PostService.getComments(this.props.post_id).then(
      response => {
        console.log(response.data)
        this.setState({
          comments: response.data
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
  

  onChangeComment(e) {
    this.setState({
      content: e.target.value,
    });
  }

  handleComment(e) {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    this.form.validateAll();

    const { dispatch, history } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(createComment(this.state.content, this.props.post_id))
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
    const {message} = this.props
    const { user: currentUser } = this.props

    return (
      <div className="container">

            {currentUser &&   
              <Form
                onSubmit={this.handleComment}
                ref={(c) => {
                this.form = c;
                }}>
            
                {!this.state.loading && (
                  <div >
  
                    <div className="form-group">
                      <h5>Create Comment</h5>
                    </div>
                    <div>
                      <textarea
                        type="text"
                        className="from-control content"
                        name="content"
                        value={this.state.content}
                        onChange={this.onChangeComment}
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
              </Form>}
              
              <div>
                <h4>Comments</h4>
                {this.state.comments.map((comment) => {
                  return(
                  <CommentComponent key={comment.id} post_id={this.props.post_id} comment_id={comment.id} comment_content={comment.content} comment_likesCount={comment.likesComment} comment_userId={comment.userId} comment_username={comment.user.username}/>  
                  )
            })}
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

export default connect(mapStateToProps)(Comments);