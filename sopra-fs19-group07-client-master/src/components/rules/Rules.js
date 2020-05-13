import React from "react";
import styled from "styled-components";
import {withRouter} from "react-router-dom";
import {getDomain} from "../../helpers/getDomain";
import {BaseContainer, Filler, Title} from "../../views/design/General";
import {ProfileOuterContainer} from "../../views/design/PreGameDesign";
import {Button, ExitCrossButton} from "../../views/design/Button";

const RulesOuterContainer = styled(ProfileOuterContainer)`
  height: 625px;
`;

const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 555px;
  width: 100%;
  color: white;
`;

const RulesList = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 600px;
  margin-bottom: 20px;
  padding-left: 37px;
  padding-right: 37px;
  padding-top: 425px;
  list-style: none;
  overflow-y: scroll;
  color: white;
`;

const GodcardButtonContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  height: 60px;
  width: 100%;
  margin-bottom: 20px;
`;
const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 70px;
  width: 668px;
`;

/**
 * @Class
 */
class Rules extends React.Component {

  getBack() {
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

  godcards() {
    this.props.history.push("/godcards");
  }

  render() {
    return (
      <BaseContainer>
        <RulesOuterContainer>
          <TopContainer>
            <Filler/>
            <Title><h2>GAME RULES</h2></Title>
            <ExitCrossButton
                onClick={() => {
                  this.getBack();
                }}
            >
              x
            </ExitCrossButton>
          </TopContainer>
          <RulesContainer>
              <RulesList>
                  <div>
                      <h4>Set Up</h4>
                      The Start Player starts his turn with placing his Workers.
                  </div>
                  <div>

                      <h4>Choose a Worker</h4>
                      On your turn, select one of your Workers.
                      You must move and then build with the selected Worker.
                  </div>
                  <div>
                      <h4>Move</h4>
                      Move your selected Worker into one of the eight neighboring spaces.
                      A Worker can move up one level higher, move down any number of levels or move on the same level.
                      But a Worker may not move up more than one level.
                      The space your Worker moves into must be unoccupied (not containing a Worker or Dome).
                  </div>
                  <div>
                      <h4>Build</h4>
                      Build a block or dome on an unoccupied space neighboring the moved Worker.
                      You can build onto a level of any height, the correct shape of block or dome is shown after clicking on the space.
                      A tower with 3 blocks and a dome is considered a “Complete Tower”.
                  </div>
                  <div>
                      <h4>End of game</h4>
                      If one of your Workers moves up on top of level 3 during your turn, you instantly win!
                      You must always perform a move then build on your turn. If you are unable to, you lose.
                  </div>
                  <div>
                      <h4>Using God Powers</h4>
                      Domes are not blocks: If the God
                      Power description states it affects blocks, it
                      does not affect domes.
                  </div>
                  <div>
                      Forced is not moved: With some God Power you can be
                      forced by your opponent into another space. In this case
                      your Worker is not considered to have moved. For example if
                      your Worker is forced onto the third level, you do not win the game.
                  </div>
                  <div>
                      <h4>Additional Rules</h4>
                      You must move and the build with the selected Worker.
                  </div>
              </RulesList>
              <GodcardButtonContainer>
                <Button
                    width="150px"
                    onClick={() => {
                      this.godcards();
                    }}
                >
                  Godcards
                </Button>
              </GodcardButtonContainer>
          </RulesContainer>
        </RulesOuterContainer>
      </BaseContainer>
    );
  }
}

export default withRouter(Rules);
