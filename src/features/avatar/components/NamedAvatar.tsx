import { Container, Text } from "@pixi/react-animated";
import type React from "react";
import { Avatar } from "./Avatar";

interface NamedAvatarProps extends React.ComponentProps<typeof Avatar> {
  name: string;
}

const NamedAvatar: React.FC<NamedAvatarProps> = ({ name, x, y, ...props }) => {
  return (
    <Container x={x} y={y}>
      <Container>
        <Avatar {...props} />
      </Container>
      <Text
        text={name}
        anchor={{ x: 0.5, y: 0.5 }}
        y={-35}
        style={{
            fontFamily: 'Press Start 2P, sans-serif', // Using a pixelated font
            fontSize: 20,
            fontWeight: "bold",
            fill: "#ffffff", // White color for the text
            stroke: "#000000", // Black outline
            strokeThickness: 4,
            letterSpacing: 1,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 0,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 3,
        }}
      />
    </Container>
  );
};

export default NamedAvatar;
