import React from "react";
import {getDomain} from "../../helpers/getDomain";
import {withRouter} from "react-router-dom";
import {BaseContainer,Container,Form,Title,ButtonContainer} from "../../views/design/General";
import {Button} from "../../views/design/Button";
import gods from '../../repos/Gods';

class ChooseGodcards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGod: null,
            gameId: null
        };
    }

    /**
     * Selects the new god by the given name
     *
     * @param {string} name Name of the new god
     */
    godInfo = (name) => {
        this.setState({
            selectedGod: gods.getByName(name),
        });
    };

    selectGod = (name) => {
        if (this.state.godcard1===name) {
            this.setState({godcard1: null});
        } else if (this.state.godcard2===name) {
            this.setState({godcard2: null});
        } else if (this.state.godcard1==null) {
            this.setState({godcard1: name});
        } else {
            this.setState({godcard2: name});
        }
    };

    confirm() {
        fetch(`${getDomain()}/games/selectGodcards`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                godcard1: this.state.godcard1,
                godcard2: this.state.godcard2
            })
        })
            .then(response => {
                switch (response.status) {
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 204:
                        this.props.history.push(`/room/${this.state.gameId}`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${response.status}`);
                        this.props.history.push(`/lobby`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the users: " + err);
            });
    }

    /**
     * Set "apollo" as the standard god when this component is rendered initially
     */
    componentDidMount() {
        let resStatus = 0;
        fetch(`${getDomain()}/games/mine`, {
            method: "GET",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then( game => {
                switch (resStatus) {
                    case 200:
                        if (game.myNumber===1 && game.withGodcards) {
                            this.godInfo('APOLLO');
                            this.setState({gameId: game.id})
                        } else {
                            this.props.history.push(`/lobby`);
                        }
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/lobby`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the users: " + err);
            });
    }

    /**
     * Constructs the component which displays a single god
     * @param {string} name Name of the god to display
     * @returns Table Column
     */
    constructGodComponent(name) {
        const god = gods.getByName(name);
        const godcardStyle = {
            cursor: "pointer",
            border: name===this.state.godcard1 || name===this.state.godcard2 ? "5px solid #21548F" : "5px solid rgba(1,1,1,0)"
        };

        return (
            <td>
                <img
                    src={god.image}
                    alt=""
                    height={220}
                    onMouseOver={() => this.godInfo(name)}
                    onClick={() => this.selectGod(name)}
                    style={godcardStyle}
                />
            </td>
        )
    }

    /**
     * Constructs the component which displays the currently selected god
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
                    <Form>
                        <div>
                            <Title>
                                <h2>GODCARDS</h2>
                            </Title>
                        </div>
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
                                disabled={!this.state.godcard1 || !this.state.godcard2}
                                width="150px"
                                onClick={() => {
                                    this.confirm();
                                }}
                            >
                                Confirm
                            </Button>
                        </ButtonContainer>
                    </Form>
                </Container>
            </BaseContainer>
        );
    }
}

export default withRouter(ChooseGodcards);
