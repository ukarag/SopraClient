import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { Button,ExitButton,RulesButton } from "../../views/design/Button";
import {Spinner} from "../../views/design/Spinner";
import {Title, ButtonContainer, BaseContainer} from "../../views/design/General";
import {
    OuterContainer,
    Form,
    CardOuterContainer,
    TextContainer,
    PlayerContainer,
    GameContainer,
    GameOuterContainer,
    SpinnerContainer, WorkerContainer, TopButtonContainer
} from "../../views/design/GameDesign";
import "../../views/design/grid.css";
import gods from "../../repos/Gods";
import  worker11 from "../../pictures/buildings/worker11.png";
import  worker21 from "../../pictures/buildings/worker21.png";

const ChooseContainer = styled.div`
  display: inline-table;
  justify-content: center;
  text-align: center;
  background: rgba(3, 129, 152, 0.7);
  border: 5px solid  rgba(0, 39, 52, 1);
  border-radius: 5px;
`;

const ChooseGodContainer = styled(ChooseContainer)`
  height: 480px;
  width: 480px;
`;

const ChooseStarterContainer = styled(ChooseContainer)`
  height: 200px;
  width: 400px;
  margin-top: 50px;
`;

const GodcardTitleContainer = styled.div`
  display: inline-table;
  flex-direction: column;
  justify-content: center;
  margin-top: -10px;
  margin-bottom: -10px;
  font-size: 16px;
  font-weight: 300;
  color: white;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 195px;
  margin-left: 10px;
  margin-right: 10px;
  position: center;
`;

const MiddleCardContainer = styled.div`
  display: flex;
  height: 270px;
  justify-content: center;
  align-content: center;
`;

const MiddleTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 5px;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

class StartGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            player1: null,
            player2: null,
            player1Godcard: null,
            player2Godcard: null,
            withGodcards: false,
            godcards: [],
            myNumber: null
        };
    }

    exit(){
        if (window.confirm("Are you sure you want to exit the game?")) {
            fetch(`${getDomain()}/games`, {
                method: "DELETE",
                headers: {
                    userToken: localStorage.getItem("token")
                }
            })
                .then(response => {
                    switch (response.status) {
                        case 204:
                            this.props.history.push(`/lobby`);
                            break;
                        default:
                            alert(`Unexpected HTTP status: ${response.status}`);
                            this.props.history.push(`/lobby`);
                            break;
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert("Something went wrong fetching the game: " + err);
                });
        }
    }

    start(number){
        fetch(`${getDomain()}/games/starter/${number}`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        })
          .then( response => {
              switch (response.status) {
                  case 404:
                      this.props.history.push(`/lobby`);
                      break;
                  case 204:
                      this.props.history.push(`/game/play`);
                      break;
                  default:
                      alert(`Unexpected HTTP status: ${response.status}`);
                      this.props.history.push(`/lobby`);
                      break;
              }
          })
          .catch(err => {
              console.log(err);
              alert("Something went wrong fetching the game: " + err);
          });
    }

    selectGod(number) {
        let godcard1;
        let godcard2;
        if (this.state.myNumber===1) {
            godcard1 = this.state.godcards[number];
            godcard2 = this.state.godcards[number===0 ? 1 : 0];
        } else {
            godcard1 = this.state.godcards[number===0 ? 1 : 0];
            godcard2 = this.state.godcards[number];
        }
        let resStatus = 0;
        fetch(`${getDomain()}/games/godcards`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                godcard1: godcard1,
                godcard2: godcard2
            })
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then( game => {
                switch (resStatus) {
                    case 404:
                        alert(`Your opponent has left the game. Room is deleted.`);
                        this.props.history.push(`/lobby`);
                        break;
                    case 200:
                        game.players.map(player => {
                            if (player.number === 1) {
                                this.setState({player1Godcard: player.godCard});
                            } else {
                                this.setState({player2Godcard: player.godCard});
                            }
                        });
                        this.setState({withGodcards: game.withGodcards});
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

    componentDidMount() {
        this.interval = setInterval(() => this.getGame(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getGame() {
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
                    case 404:
                        alert(`Your opponent has left the game. Room is deleted.`);
                        this.props.history.push(`/lobby`);
                        break;
                    case 200:
                        switch (game.stage) {
                            case 0: this.props.history.push(`/room/${game.gameId}`);
                                break;
                            case 2: this.props.history.push(`/game/play`);
                                break;
                            default: break;
                        }
                        this.setState({gameName: game.gameName});
                        this.setState({myNumber: game.myNumber});
                        this.setState({godcards: game.godcards});
                        game.players.map(player => {
                            if (player.number === 1) {
                                this.setState({player1: player.user.username});
                                this.setState({player1Godcard: player.godCard});
                            } else {
                                this.setState({player2: player.user.username});
                                this.setState({player2Godcard: player.godCard});
                            }
                        });
                        this.setState({withGodcards: game.withGodcards});
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

    render() {
        const isOne=this.state.myNumber===1;
        const style={display: isOne ? '' : 'none'};
        let important = {
            backgroundImage: 'url(' + require('../../pictures/board.png') + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '611px'
        };
        let cardStyle = {
            backgroundImage: !this.state.player1Godcard ? (
                    <Spinner />) :
                'url(' + gods.getByName(this.state.player1Godcard).image + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '155px',
            marginTop: '-10px'
        };
        let cardStyle2 = {
            backgroundImage: !this.state.player2Godcard ? (
                    <Spinner />) :
                'url(' + gods.getByName(this.state.player2Godcard).image + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '155px',
            marginTop: '-10px'
        };
        return (
            <BaseContainer>
                <TopButtonContainer>
                    <RulesButton
                        width="100px"
                        variant="danger"
                        onClick={() => {
                            this.props.history.push("/rules");
                        }}
                    >
                        Rules
                    </RulesButton>
                    <ExitButton
                        width="100px"
                      variant="danger"
                      onClick={() => {
                          this.exit();
                      }}
                    >
                        Exit
                    </ExitButton>
                </TopButtonContainer>
                <OuterContainer>
                    <PlayerContainer>
                        <WorkerContainer>
                            <img
                                src={worker11}
                                alt=""
                                height={80}
                            />
                        </WorkerContainer>
                        {!this.state.player1 ? (
                            <SpinnerContainer>
                                <Spinner/>
                            </SpinnerContainer>
                        ) : (
                            <div>
                                <h2>{this.state.myNumber === 1 ? "Me": this.state.player1}</h2>
                            </div>
                        )}
                        {
                            this.state.withGodcards && this.state.player1Godcard!=="NOGODCARD" &&
                            [
                                <CardOuterContainer style={cardStyle}/>,
                                <TextContainer>
                                    {gods.getByName(this.state.player1Godcard).description}
                                </TextContainer>
                            ]
                        }
                    </PlayerContainer>
                    <GameOuterContainer style={important}>
                        <GameContainer>
                            {
                                this.state.withGodcards && this.state.player1Godcard==="NOGODCARD" ?
                                    [!isOne ?
                                        [
                                            this.state.godcards.length===0 ?
                                                <ChooseGodContainer>
                                                    <GodcardTitleContainer>
                                                        <Title>
                                                            <h2>Waiting for {this.state.player1} to choose 2 godcards</h2>
                                                        </Title>
                                                    </GodcardTitleContainer>
                                                </ChooseGodContainer>:
                                                <ChooseGodContainer>
                                                    <GodcardTitleContainer>
                                                        <Title>
                                                            <h2>Choose your godcard:</h2>
                                                        </Title>
                                                    </GodcardTitleContainer>
                                                    <ButtonContainer>
                                                        <ImageContainer>
                                                            <MiddleCardContainer>
                                                                <img
                                                                    src={gods.getByName(this.state.godcards[0]).image}
                                                                    alt=""
                                                                    height={270}
                                                                    width={156.5}
                                                                    onClick={() => this.selectGod(0)}
                                                                    style={{cursor: "pointer"}}
                                                                />
                                                            </MiddleCardContainer>
                                                            <MiddleTextContainer>
                                                                {gods.getByName(this.state.godcards[0]).description}
                                                            </MiddleTextContainer>
                                                        </ImageContainer>
                                                        <ImageContainer>
                                                            <MiddleCardContainer>
                                                                <img
                                                                    src={gods.getByName(this.state.godcards[1]).image}
                                                                    alt=""
                                                                    height={270}
                                                                    width={156.5}
                                                                    onClick={() => this.selectGod(1)}
                                                                    style={{cursor: "pointer"}}
                                                                />
                                                            </MiddleCardContainer>
                                                            <MiddleTextContainer>
                                                                {gods.getByName(this.state.godcards[1]).description}
                                                            </MiddleTextContainer>
                                                        </ImageContainer>
                                                    </ButtonContainer>
                                                </ChooseGodContainer>
                                        ] :
                                        <ChooseGodContainer>
                                            <GodcardTitleContainer>
                                                <Title>
                                                    {!this.state.player2 ? (
                                                        <Spinner />
                                                    ) : (
                                                        <h2>{this.state.player2} chooses the godcard</h2>
                                                    )}
                                                </Title>
                                            </GodcardTitleContainer>
                                            <ButtonContainer>
                                                <ImageContainer>
                                                    <MiddleCardContainer>
                                                        <img
                                                            src={gods.getByName(this.state.godcards[0]).image}
                                                            alt=""
                                                            height={270}
                                                            width={156.5}
                                                        />
                                                    </MiddleCardContainer>
                                                    <MiddleTextContainer>
                                                        {gods.getByName(this.state.godcards[0]).description}
                                                    </MiddleTextContainer>
                                                </ImageContainer>
                                                <ImageContainer>
                                                    <MiddleCardContainer>
                                                        <img
                                                            src={gods.getByName(this.state.godcards[1]).image}
                                                            alt=""
                                                            height={270}
                                                            width={156.5}
                                                        />
                                                    </MiddleCardContainer>
                                                    <MiddleTextContainer>
                                                        {gods.getByName(this.state.godcards[1]).description}
                                                    </MiddleTextContainer>
                                                </ImageContainer>
                                            </ButtonContainer>
                                        </ChooseGodContainer>
                                    ] :
                                    <ChooseStarterContainer>
                                        <Form>
                                            <Title>
                                                {!this.state.player2 ? (
                                                    <Spinner />
                                                ) : [isOne ?
                                                    <h2>Choose the start player:</h2> :
                                                    <h2>{this.state.player1} chooses the start player</h2>
                                                ]}
                                            </Title>
                                        </Form>
                                        <ButtonContainer style={style}>
                                            <Button
                                                width="20%"
                                                onClick={() => {
                                                    this.start(1);
                                                }}
                                            >
                                                {this.state.player1}
                                            </Button>
                                            <Button
                                                width="20%"
                                                onClick={() => {
                                                    this.start(2);
                                                }}
                                            >
                                                {this.state.player2}
                                            </Button>
                                        </ButtonContainer>
                                    </ChooseStarterContainer>
                            }
                        </GameContainer>
                    </GameOuterContainer>
                    <PlayerContainer>
                        <WorkerContainer>
                            <img
                                src={worker21}
                                alt=""
                                height={80}
                            />
                        </WorkerContainer>
                        {!this.state.player2 ? (
                            <SpinnerContainer>
                                <Spinner/>
                            </SpinnerContainer>
                        ) : (
                            <div>
                                <h2>{this.state.myNumber === 2 ? "Me": this.state.player2}</h2>
                            </div>
                        )}
                        {
                            this.state.withGodcards && this.state.player2Godcard!=="NOGODCARD" &&
                            [
                                <CardOuterContainer style={cardStyle2}/>,
                                <TextContainer>
                                    {gods.getByName(this.state.player2Godcard).description}
                                </TextContainer>
                            ]
                        }
                    </PlayerContainer>
                </OuterContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(StartGame);
