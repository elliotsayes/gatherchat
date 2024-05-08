import { Spring } from "@react-spring/web";
import type React from "react";
import { useState } from "react";
import NamedAvatar from "./NamedAvatar";

interface InteractableToonProps
    extends Omit<React.ComponentProps<typeof NamedAvatar>, "scale"> {
    scale: number;
}

const InteractableToon: React.FC<InteractableToonProps> = (
    props: InteractableToonProps,
) => {
    const { scale, ...namedAvatarProps } = props;

    const [emphasis, setEmphasis] = useState(false);

    return (
        <Spring to={{ scale: emphasis ? scale * 1.2 : scale }}>
            {(springProps) => (
                <NamedAvatar
                    onmouseenter={() => setEmphasis(true)}
                    onmouseleave={() => setEmphasis(false)}
                    eventMode={"dynamic"}
                    {...namedAvatarProps}
                    {...springProps}
                />
            )}
        </Spring>
    );
};

export default InteractableToon;
