import styled from "styled-components";

export const Field = styled.button`
  display: flex;
  width: 96px;
  height: 96px;
  justify-content: center;
  align-items: center;
  cursor: ${props => (props.disabled == null || props.disabled ? "default" : "pointer")};
  background: ${props => (props.disabled == null || props.disabled ? "rgba(240,255,240,0.0)" : "radial-gradient(rgba(240,255,240,0.2), rgba(240,255,240,0.9))")};
`;

export const SelectedField = styled.div`
  display: flex;
  width: 96px;
  height: 96px;
  justify-content: center;
  align-items: center;
  background: radial-gradient(rgba(0,100,0,0.0), rgba(0,100,0,0.8)) ;
`;

export const Worker = styled.button`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.marginTop};
  margin-left: ${props => props.marginLeft};
  width: 96px;
  height: 96px;
  position: absolute;
  background-color: rgb(1, 1, 1, 0);
  border: rgb(1, 1, 1, 0);
  cursor: ${props => (props.disabled == null || props.disabled ? "default" : "pointer")};
`;

export const Level = styled.button`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.marginTop};
  width: 96px;
  height: 96px;
  position: absolute;
  background-color: rgb(1, 1, 1, 0);
  border: rgb(1, 1, 1, 0);
  cursor: ${props => (props.disabled == null || props.disabled ? "default" : "pointer")};
`;
