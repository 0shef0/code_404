import React, { Component } from "react";

import { Link, Navigate } from "react-router-dom";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";

import PostService from "../services/post.service";
import UserService from "../services/user.service";

import { deleteUser } from "../actions/user";

import "../App.css";

import "bootstrap/dist/css/bootstrap.min.css";

class User extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          posts: [],
          user: ""
        };
      }
    
      componentDidMount() {
        PostService.getAll().then(
          response => {
            this.setState({
              posts: response.data,
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
        UserService.getUser(this.props.user_id).then(
            response => {
                this.setState({
                    user: response.data,
                })
            },
            error => {
                this.setState({
                  user:
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString()
                });
              }
        )
      }

      render() {
        const {message} = this.props
        const {user: currentUser} = this.props

        if(this.state.successful === true) {
          return <Navigate to="/admin" />
        }
        return (
          <div className="container">
            <div className="card mb-3" >
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{this.state.user.username}</h5>
                      <p className="card-text"><small className="text-muted">{this.state.user.roles}</small></p>
                  </div>
                </div>
              </div>
              {((currentUser.id !== this.state.user.id) && (currentUser.roles.includes("ROLE_ADMIN"))) && 
            <div className="d-flex">
          </div>}
            </div>
            <div className="post-container">
            <header className="jumbotron">
                {this.state.posts.map((post) => {
                if (post.userId === this.state.user.id){
                   return(
                    <div className ="post" key={post.id}>
                      <Link to={"/posts/" + post.id}>
                        <header className= "jumbotron">
                            <h3>
                                {post.title}
                            </h3>
                            
                        </header>
                        </Link>
                        <p>
                            {post.content}
                        </p>
                        <p>
                            {post.likesCount}
                        </p>
                        <div className="d-flex categories">
                            {post.categories.map(category => {
                            return(
                              <div key={category.id} className="card-categories">
                                <small>
                                  {category.title}
                                </small>
                              </div>
                            )
                            })}
                          </div>
                    </div>
                   )
                  }
                })
              }          
            </header>
            
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
  
  export default connect(mapStateToProps)(User);