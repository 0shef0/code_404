import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { Navigate } from "react-router-dom";

import { connect } from "react-redux";
import { updateComment } from "../actions/post";
import "../App.css";
import PostService from "../services/post.service";

class EditComment extends Component {
    constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);

    this.state = {
      content: "",
      post_id: "",
      successful: false,
    };
  }

  onChangeContent(e) {
    this.setState({
      content: e.target.value,
    });
  }

  componentDidMount() {
    PostService.getComment(this.props.comment_id).then(
      response => {
        this.setState({
          content: response.data.content,
          post_id: response.data.postId
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
        dispatch(updateComment(this.props.comment_id, this.state.content))
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
        return <Navigate to={"/posts/" + this.state.post_id}/>
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
                    value={this.state.content}
                    onChange={this.onChangeContent}
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

export default connect(mapStateToProps)(EditComment);