import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import {Routes, useParams, Link} from 'react-router-dom'

import { Collapse } from "bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import Post from "./components/post.component";
import User from "./components/users.component"
import UserList from "./components/userList.component";
import EditPost from "./components/edit-post.component"
import EditUser from "./components/edit-user.component"
import EditCategory from "./components/edit-category.component"
import EditComment from "./components/edit-comment.component"
import BoardAdminCategory from "./components/board-admin-category.component";
import BoardAdminPost from "./components/board-admin-post.component";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { createBrowserHistory } from "history";

const history = createBrowserHistory();


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      showUserBoard: false,
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
        showUserBoard: user.roles.includes("ROLE_USER"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    this.props.dispatch(logout());
  }

  render() {
    const { currentUser, showAdminBoard, showUserBoard } = this.state;

    return (
      <Router history={history}>
      <div>
        <nav className="navbar sticky-top navbar-expand-md navbar-dark bg-dark header">
          <div className="container-app">
            
            <Link to={"/"} className="navbar-brand">
              <img
                className="logo-dark"
              />
            </Link>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
              aria-controls="navbarContent" aria-expanded="false">
                <span className="navbar-toggler-icon"></span>
            </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>
              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/createPost"} className="nav-link">
                    CreatePost
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/users"} className="nav-link">
                    Users
                  </Link>
                </li>
              )}
            </ul>
            
            <ul className="navbar-nav mr-auto right">
              {currentUser && (
                <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              )}

              {currentUser && (
                <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
              )}

              {!currentUser && (
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>
              )}

              {!currentUser && (
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                   Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
          <div className="container">
            <Routes>
              <Route exact path="/home" element={<Home/>} />
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/login" element={<Login/>} />
              <Route exact path="/register" element={<Register/>} />
              <Route exact path="/profile" element={<Profile/>} />
              <Route path="/createPost" element={<BoardUser/>} />
              <Route path="/admin" element={<BoardAdmin/>} />
              <Route path="/admin/category" element={<BoardAdminCategory/>} />
              <Route path="/admin/post" element={<BoardAdminPost/>} />
              <Route path="/posts/:post_id" element={<PostById/>} />
              <Route path="/users/:user_id" element={<UserById/>} />
              <Route path="/users" element={<UserList/>} />
              <Route path="/posts/:post_id/edit" element={<EditPostById/>} />
              <Route path="/users/:user_id/edit" element={<EditUserById/>} />
              <Route path="/category/:category_id/edit" element={<EditCategoryById/>} />
              <Route path="/comment/:comment_id/edit" element={<EditCommentById/>} />
            </Routes>
          </div>
          <footer>
          <Link to="/" className=".link">
              Code_404
          </Link>
          <p className="da">© Dshevchenk 2022</p>
        </footer>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

function EditUserById() {
  const userid = useParams()
    console.log(userid)
    return(
      <EditUser user_id={userid.user_id}></EditUser>
    )
}

function UserById() {
  const userid = useParams()
    console.log(userid)
    return(
      <User user_id={userid.user_id}></User>
    )
}

function EditPostById() {
  const postid = useParams()
  console.log(postid)
  return(
    <EditPost post_id={postid.post_id}></EditPost>
  )
}

function PostById() {
  const postid = useParams()
  console.log(postid)
  return(
    <Post post_id={postid.post_id}></Post>
  )
}

function EditCategoryById() {
  const categoryid = useParams()
  console.log(categoryid)
  return(
    <EditCategory category_id={categoryid.category_id}></EditCategory>
  )
}

function EditCommentById() {
  const commentid = useParams()
  console.log(commentid)
  return(
    <EditComment comment_id={commentid.comment_id}></EditComment>
  )
}

export default connect(mapStateToProps)(App);