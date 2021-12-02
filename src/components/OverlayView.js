import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  top: 0
  bottom: 0;
  left: 0;
  right: 0;
`;
const UnfocusedContainer = styled.View`
  flex: 2;
  background-color: rgba(0, 0, 0, 0.8);
`;

const MiddleContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const FocusedContainer = styled.View`
  flex: 3;
`;

const OverlayView = () => {
  return (
    <Container>
      <UnfocusedContainer></UnfocusedContainer>
      <MiddleContainer>
        <UnfocusedContainer></UnfocusedContainer>
        <FocusedContainer></FocusedContainer>
        <UnfocusedContainer></UnfocusedContainer>
      </MiddleContainer>
      <UnfocusedContainer></UnfocusedContainer>
    </Container>
  );
};

export default OverlayView;
