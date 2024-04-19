import React from "react";
import { Container, Text } from "@pixi/react-animated";
import { Avatar } from "./Avatar";

interface NamedAvatarProps extends React.ComponentProps<typeof Avatar> {
	name: string;
}

const NamedAvatar: React.FC<NamedAvatarProps> = ({ name, ...props }) => {
	return (
		<Container anchor={{ x: 0.5, y: 0.5 }}>
			<Text text={name} anchor={{ x: 0.5, y: 1.5 }} />
			<Container y={10}>
				<Avatar {...props} />
			</Container>
		</Container>
	);
};

export default NamedAvatar;
