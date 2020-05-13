import React from "react";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import {FormContainer,BaseContainer, ButtonContainer, Title} from "../../views/design/General";
import {StartForm, InputField, Label, LogoutContainer} from "../../views/design/PreGameDesign";
import { Button, CreateButton } from "../../views/design/Button";

/**
 * @Class
 */
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            alreadyUsed: false
        };
    }

    register() {
        fetch(`${getDomain()}/users`, {
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
                switch (response.status) {
                    case 409:
                        this.setState({alreadyUsed: true});
                        this.props.history.push(`/register`);
                        break;
                    case 201:
                        this.props.history.push(`/login`);
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

    go_back() {
        this.props.history.push(`/login`);
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
        if (this.state.alreadyUsed) {
            inputAnswer = <p style={{color:'#990000'}}>Username already taken</p>
        } else {
            inputAnswer = <p> </p>
        }
        return (
            <BaseContainer>
                <LogoutContainer/>
                <FormContainer>
                    <Title><h2>Register</h2></Title>
                    <StartForm>
                        <div>{inputAnswer}</div>
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
                            <CreateButton
                                disabled={!this.state.username || !this.state.password}
                                width="150px"
                                onClick={() => {
                                    this.register();
                                }}
                            >
                                Register
                            </CreateButton>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="150px"
                                onClick={() => {
                                    this.go_back();
                                }}
                            >
                                Back
                            </Button>
                        </ButtonContainer>
                    </StartForm>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Register);
