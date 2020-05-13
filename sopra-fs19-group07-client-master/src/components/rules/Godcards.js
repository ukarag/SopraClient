import React from "react";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import {Container,BaseContainer,GodForm,Title,ButtonContainer,Filler} from "../../views/design/General";
import { Button,ExitCrossButton } from "../../views/design/Button";
import gods from '../../repos/Gods';
import styled from "styled-components";

export const GodcardTopButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1053px;
  margin-bottom: 34px;
`;

class Godcards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGod: null,
        };
    }

    /**
     * Selects the new god by the given name
     *
     * @param {string} name Name of the new god
     */
    selectGod = (name) => {
        this.setState({
            selectedGod: gods.getByName(name),
        });
    };

    goBack() {
        let resStatus = 0;
        fetch(`${getDomain()}/games/mine`, {
            method: "GET",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json();
            })
            .then(game => {
                switch (resStatus) {
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 200:
                        switch (game.stage) {
                            case 0:
                                this.props.history.push(`/room/${game.id}`);
                                break;
                            case 1:
                                this.props.history.push(`/game/start`);
                                break;
                            case 2:
                                this.props.history.push(`/game/play`);
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/game`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the users: " + err);
            });
        this.props.history.push("/lobby");
    }

    rules() {
        this.props.history.push("/rules");
    }

    /**
     * Set "apollo" as the standard god when this component is rendered initially
     */
    componentDidMount() {
        this.selectGod('APOLLO');
    }

    /**
     * Constructs the component which displays a single god
     *
     * @param {string} name Name of the god to display
     * @returns Table Column
     */
    constructGodComponent(name) {
        const god = gods.getByName(name);

        return (
            <td>
                <img
                    src={god.image}
                    alt=""
                    height={220}
                    onMouseOver={() => this.selectGod(name)}
                />
            </td>
        )
    }

    /**
     * Constructs the component which displays the currently selected god
     *
     * @returns Table Column
     */
    constructSelectedGod() {
        const { selectedGod } = this.state;
        if (!selectedGod){
            return <p>no god selected</p>
        }

        return (
            <td
                rowSpan="2"
                width="20%"
            >
                <div className="selected-god-container">
                    <img
                        src={selectedGod.image}
                        alt=""
                    />
                    <div className="selected-god-description">
                        {selectedGod.title}
                        {selectedGod.description}
                    </div>
                </div>
            </td>
        );
    }

    render() {
        const firstRowGods = ['APOLLO', 'ARTEMIS', 'ATHENA', 'ATLAS', 'DEMETER'];
        const secondRowGods = ['HEPHAESTUS', 'HERMES', 'MINOTAUR', 'PAN', 'PROMETHEUS'];

        return (
            <BaseContainer>
                <Container>
                    <GodForm>
                        <GodcardTopButtonContainer>
                            <Filler/>
                            <Title>
                                <h2>GODCARDS</h2>
                            </Title>
                            <ExitCrossButton
                              width="50%"
                              onClick={() => {
                                  this.goBack();
                              }}
                            >
                                X
                            </ExitCrossButton>
                        </GodcardTopButtonContainer>
                        <table>
                            <tr>
                                {firstRowGods.map(name => this.constructGodComponent(name))}
                                {this.constructSelectedGod()}
                            </tr>
                            <tr>
                                {secondRowGods.map(name => this.constructGodComponent(name))}
                            </tr>
                        </table>

                        <ButtonContainer>
                            <Button
                                width="150px"
                                onClick={() => {
                                    this.rules();
                                }}
                            >
                                Rules
                            </Button>
                        </ButtonContainer>
                    </GodForm>
                </Container>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Godcards);
