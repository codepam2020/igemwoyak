import React from 'react';
import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Modal } from 'react-native';

const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  align-self: flex-end
  background-color: pink;
  border-radius: 30px;
  width: 60px;
  height: 60px;
  margin-right: 10px
  position: absolute
  right: 20px;
  bottom: 30px;
`;

function ModalButton({ onPress }) {
  return (
    <Container delayLongPress={300} onPress={onPress}>
      <FontAwesome5 name="plus" size={20} />
    </Container>
  );
}

export default ModalButton;
