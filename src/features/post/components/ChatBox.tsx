import { useCallback, useState } from "react";
import { toast } from "sonner";

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
    <div className="flex flex-row w-full ">
        <form>
            <label htmlFor="chat" className="sr-only">Your message</label>
            <div className="flex items-center w-full min-w-80 h-20 px-1 py-2 bg-gather dark:bg-gray-700">
                <button type="button"
                        className="inline-flex justify-center p-2 text-yellow-800 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                        onClick={() => toast("Uploads coming soon!")}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
                    <span className="sr-only">Upload image</span>
                </button>
                <button type="button"
                        className="inline-flex justify-center p-2 text-yellow-800 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                        onClick={() => toast("Reactions coming soon!")}>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"/>
                    </svg>
                    <span className="sr-only">Add emoji</span>
                </button>
                <input id="chat"
                          className="block mx-2 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg  outline-gatherstrong"
                          placeholder="Your message..."
                          type="text"
                          onChange={(e) => setText(e.target.value)}
                          value={text}
                          autoFocus
                ></input>
                <button type="submit"
                        className="inline-flex justify-center p-2 text-yellow-800 rounded-full cursor-pointer hover:bg-white dark:text-blue-500 dark:hover:bg-gray-600"
                        onClick={() => onSubmit()} disabled={text.length === 0}
                >
                    <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                        <path
                            d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                    </svg>
                    <span className="sr-only">Send message</span>
                </button>
            </div>
        </form>

    </div>
  );
};
