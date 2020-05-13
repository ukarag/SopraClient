import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 6px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgba(0,70,100,0.8);
  transition: all 0.3s ease;
  box-shadow: 4px 4px 1px #2d2d2d;
`;

export const ExitButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(180,0,0,0.8);
  transition: all 0.3s ease;
  box-shadow: 4px 4px 1px #2d2d2d;
`;

export const ExitCrossButton = styled.button`
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 35px;
  height: 35px;
  border: none;
  cursor: pointer;
  background: rgba(200,0,0,0.8);
  transition: all 0.3s ease;
`;

export const CreateButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(0,180,90,0.8);
  transition: all 0.3s ease;
  box-shadow: 4px 4px 1px #2d2d2d;
`;

export const SettingsButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(0,70,100,0.8);
  transition: all 0.3s ease;
  box-shadow: 4px 4px 1px #2d2d2d;
`;

export const SettingsCreateButton = styled(CreateButton)`
  background: rgba(0,180,90,0.8);
  margin-right: 20px;
`;

export const RulesButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  width: ${props => props.width || null};
  height: 35px;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(240,240,240,0.5);
  transition: all 0.3s ease;
  border: 2px solid black;
  box-shadow: 4px 4px 1px #2d2d2d;
`;

export const BoxButton = styled.div`
  margin: 6px 0;
  width: 300px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  background: rgba(0,70,100,0.8);
  box-shadow: 4px 4px 1px #2d2d2d;
  elevation: revert;
  margin-right: 10px;
`;
