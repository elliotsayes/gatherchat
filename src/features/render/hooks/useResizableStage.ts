import { useCallback, useEffect, useState } from "react";

const stageSizeFallback = {
    width: 800,
    height: 600,
};

export function useResizableStage(
    parentRef: React.RefObject<HTMLDivElement>,
    lastResized: number,
) {
    const [stageSize, setStageSize] = useState(stageSizeFallback);

    const resizeStage = useCallback(() => {
        if (parentRef.current) {
            const { clientWidth, clientHeight } = parentRef.current;
            console.log("resizeStage", clientWidth, clientHeight);
            setStageSize({
                width: clientWidth,
                height: clientHeight,
            });
        }
    }, [parentRef.current]);

    useEffect(() => {
        console.log({ lastResized });
        resizeStage();
        window.addEventListener("resize", resizeStage);
        return () => {
            window.removeEventListener("resize", resizeStage);
        };
    }, [resizeStage, lastResized]);

    return stageSize;
}
