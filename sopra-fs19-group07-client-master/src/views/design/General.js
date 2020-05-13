import styled from "styled-components";

export const BaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  max-width: 1160px;
`;
const BasicForm = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  color: white;
  background: rgba(3, 129, 152, 0.7);
  border: 5px solid  rgba(0, 39, 52, 1);
`;
export const FormContainer = styled(BasicForm)`
  align-items: center;
  height: 420px;
  width: 678px;
  margin-top: 2em;
`;
export const Form = styled(BasicForm)`
  justify-content: center;
  height: 630px;
  width: 1100px;
  padding-bottom: 37px;
`;
export const GodForm = styled(BasicForm)`
  justify-content: center;
  height: 630px;
  width: 1100px;
  padding-bottom: 37px;
 `;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
export const Title = styled.label`
  height: 25px;
  color: white;
  text-transform: uppercase;
  text-align: center;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const Filler = styled.div`
  height: 35px;
  width: 35px;
`;