import React, { Component } from "react";
import { Link } from "react-router-dom";

import UserService from "../services/user.service";

import "../App.css";

export default  class UserList extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          users: [],
          successful: false,
        };
    }

    componentDidMount() {
        UserService.getUsers().then(
          response => {
            this.setState({
              users: response.data
            });
          },
          error => {
            this.setState({
              users:
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
            });
          }
        );
    }

    render() {
        const { message } = this.props;
    
        return (
          <div className="row">
          <div className="col-md-12"> 
          {this.state.users.map((user) => {
                return(
                    <div className ="post" key={user.id}>
                      <Link to={"/users/" + user.id}>
                        <header className= "jumbotron">
                            <h3>
                                {user.username}
                            </h3>
                            
                        </header>
                        </Link>
                        <p>
                            {user.id}
                        </p>
                        <p>
                            {user.email}
                        </p>
                    </div>
                )})}
          </div>
        </div>
        );
      }
}