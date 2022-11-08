import React, { Component } from "react";
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import { Link } from "react-router-dom";
import PostService from "../services/post.service";

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      posts: []
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
          post:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Navigate to="/login" />;
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
                <h5 className="card-title">{currentUser.username}</h5>
                  <p className="card-text">Email: {currentUser.email}</p>
                  <p className="card-text"><small className="text-muted">{currentUser.roles}</small></p>
                  <Link to={"/users/" + currentUser.id + "/edit"} className="btn btn-primary btn-block">
                    Edit Profile
                  </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="post-container">
            {this.state.posts.map((post) => {
            if (post.userId === currentUser.id){
               return(
                <div key={post.id} className="card col-xl-6 newblya">
                  <div className="newblya-header">
                  <Link to={"/posts/" + post.id}>
                    <h2>
                      {post.title}
                    </h2>
                  </Link>
                  <p>
                    {post.likesCount}
                  </p>
                </div>
                <div className="newblya-content">
                  <p>{post.content.slice(1, 150) + "..."}</p>
                </div>
                <div className="newblya-footer">
                  <div>
              
                  </div>
                  <div>
                    {post.status}
                  </div>
                </div>
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
      </div>
  </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Profile);