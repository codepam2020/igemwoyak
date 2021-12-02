import React from "react";
import styled from "styled-components";

const Container = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px
  background-color: yellow;
  align-items: center;
  border-radius: 20px;
  width: 100px;
  padding: 10px;
`;
const Title = styled.Text`
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  color: red;
`;

const ResetButton = ({ title, onPress, disabled }) => {
  return (
    <Container onPress={onPress} disabled={disabled}>
      <Title>{title}</Title>
    </Container>
  );
};

export default ResetButton;
