import styled from "styled-components";

export const Form = styled.div`
  display: inline-table;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  font-weight: 300;
  color: white;
`;
export const CardOuterContainer = styled.div`
  display: inline-table;
  justify-content: center;
  align-content: center;
  height: 269px;
  width: 158px;
  margin-left: 10px;
  margin-right: 10px;
`;
export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 200px;
  text-align: center;
  padding: 5px;
  color: white;
  font-weight: bold;
  font-size: 15px;
`;
export const PlayerContainer = styled.div`
  display: inline-table;
  flex-direction: column;
  text-align: center;
  width: 188px;
  height: 617px;
  background: rgba(3, 129, 152, 0.7);
  border: 5px solid  rgba(0, 39, 52, 1);
  border-radius: 5px;
  color: white;
  margin-left: 16px;
  margin-right: 16px;
  justify-content: center;
`;
export const GameOuterContainer = styled.div`
  flex-direction: column;
  height: 550px;
  width: 550px;
  padding: 28px;
`;
const MiddleContainer = styled.div`
  display: inline-table;
  justify-content: center;
  text-align: center;
  height: 490px;
  width: 490px;
  margin-top: 3px;
`;
const WithoutBoardContainer = styled(MiddleContainer)`
  background: rgba(3, 129, 152, 0.7);
  border: 5px solid  rgba(0, 39, 52, 1);
  border-radius: 5px;
`;
export const GameContainer = styled(MiddleContainer)`
  border: 5px solid rgba(30, 124, 186, 0.0);
`;
export const RoomContainer = styled(WithoutBoardContainer)`
  margin: 28px;
  padding: 20px;
  background: rgba(3, 129, 152, 0.7);
  border: 5px solid  rgba(0, 39, 52, 1);
  border-radius: 5px;
`;
export const EndPageContainer = styled(WithoutBoardContainer)`
  margin: 30px;
  background: rgba(3, 129, 152, 0.7);
  border: 5px solid  rgba(0, 39, 52, 1);
  border-radius: 5px;
`;
export const OuterContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 617px;
  width: 1020px;
  margin-top: 30px;
`;
export const TopButtonContainer = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  width: 1020px;
  margin-top: -60px; 
`;
export const WorkerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: -15px;
`;
export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-left: -20px;
`;