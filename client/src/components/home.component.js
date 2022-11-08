import React, { Component } from "react";

import PostService from "../services/post.service";

import "../App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Home extends Component {
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

  render() {
    const {user: currentUser} = this.props

    return (
      <div className="post-container">
            {this.state.posts.map((post) => {
            if(currentUser && currentUser.roles.includes("ROLE_ADMIN"))
            return(
            <div key={post.id} className="card col-8 newblya">
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
                    {post.user.username}
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
            else if (post.status === "inactive")
            return(<div key={post.id}></div>) 
            else 
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
                    {post.user.username}
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
            })}
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

export default connect(mapStateToProps)(Home);