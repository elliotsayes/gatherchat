import { useCallback, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

interface ChatBoxProps {
  onSubmit: (text: string) => void;
}

export const ChatBox = ({ onSubmit: onSubmitProp }: ChatBoxProps) => {
  const [text, setText] = useState("");

  const onSubmit = useCallback(() => {
    onSubmitProp(text);
    setText("");
  }, [onSubmitProp, text]);

  return (
    <div className="flex flex-row gap-2">
      <Input
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <Button onClick={() => onSubmit()} disabled={text.length === 0}>
        Send
      </Button>
    </div>
  );
};
