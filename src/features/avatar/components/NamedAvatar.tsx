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
        // style={{
        // 	dropShadow: true,
        // 	dropShadowColor: "white",
        // 	dropShadowBlur: 2,
        // 	dropShadowAngle: 45,
        // 	dropShadowDistance: 2,
        // 	fontSize: 18,
        // 	fontWeight: "bold",
        // }}
      />
    </Container>
  );
};

export default NamedAvatar;
