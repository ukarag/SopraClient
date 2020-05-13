import React from "react";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import {FormContainer,BaseContainer, ButtonContainer, Title} from "../../views/design/General";
import {StartForm, InputField, Label, LogoutContainer} from "../../views/design/PreGameDesign";

/**
 * @Class
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      wrongInput: 0
    };
  }

  login() {
    let resStatus = 0;
    fetch(`${getDomain()}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
        .then(response => {
          resStatus = response.status;
          return response.text();
        })
        .then( res => {
          switch (resStatus) {
            case 404:
              this.setState( {wrongInput: 1});
              this.props.history.push(`/login`);
              break;
            case 403:
              this.setState( {wrongInput: 2});
              this.props.history.push(`/login`);
              break;
            case 409:
              this.setState( {wrongInput: 3});
              this.props.history.push(`/login`);
              break;
            case 200:
              localStorage.setItem("token", res);
              this.props.history.push(`/game`);
              break;
            default:
              alert(`Unexpected HTTP status: ${resStatus}`);
              this.props.history.push(`/login`);
              break;
          }
        })
        .catch(err => {
          console.log(err);
          alert("Something went wrong fetching the users: " + err);
        });
  }

  register() {
    this.props.history.push("/register");
  }

  devRegister() {
    fetch(`${getDomain()}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "a",
        password: "a"
      })
    })
        .then(response => {
          switch (response.status) {
            case 409:
              this.props.history.push(`/register`);
              break;
            case 201:
              break;
            default:
              alert(`Unexpected HTTP status: ${response.status}`);
              this.props.history.push(`/register`);
              break;
          }
        })
        .catch(err => {
          if (err.message.match(/Failed to fetch/)) {
            alert("The server cannot be reached. Did you start it?");
          } else {
            alert(`Something went wrong during the register: ${err.message}`);
          }
        });
    fetch(`${getDomain()}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "b",
        password: "b"
      })
    })
        .then(response => {
          switch (response.status) {
            case 409:
              this.props.history.push(`/register`);
              break;
            case 201:
              break;
            default:
              alert(`Unexpected HTTP status: ${response.status}`);
              this.props.history.push(`/register`);
              break;
          }
        })
        .catch(err => {
          if (err.message.match(/Failed to fetch/)) {
            alert("The server cannot be reached. Did you start it?");
          } else {
            alert(`Something went wrong during the register: ${err.message}`);
          }
        });
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    let inputAnswer = null;
    switch(this.state.wrongInput) {
      case 1:
        inputAnswer = "Invalid username";
      break;
      case 2:
        inputAnswer = "Invalid password";
      break;
      case 3:
        inputAnswer = "User already logged in";
        break;
      default:
        inputAnswer = " "
    }
    return (
      <BaseContainer>
        <LogoutContainer/>
        <FormContainer>
          <Title><h2>Login</h2></Title>
          <StartForm>
            <div> <p style={{color:'#990000'}}>{inputAnswer}</p></div>
            <Label>Username</Label>
            <InputField
                placeholder="Enter here.."
                onChange={e => {
                  this.handleInputChange("username", e.target.value);
                }}
            />
            <Label>Password</Label>
            <InputField
                placeholder="Enter here.."
                type="password"
                onChange={e => {
                  this.handleInputChange("password", e.target.value);
                }}
            />
            <ButtonContainer>
              <Button
                  disabled={!this.state.username || !this.state.password}
                  width="150px"
                  onClick={() => {
                    this.login();
                  }}
              >
                Login
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button
                  width="150px"
                  onClick={() => {
                    this.register();
                  }}
              >
                Register
              </Button>
              <Button
                  width="150px"
                  onClick={() => {
                    this.devRegister();
                  }}
              >
                Dev Register
              </Button>
            </ButtonContainer>
          </StartForm>
        </FormContainer>
      </BaseContainer>
    );
  }
}

export default withRouter(Login);
