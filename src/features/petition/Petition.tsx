import React from "react";

import { AoGatherProvider } from "@/features/ao/lib/ao-gather";

import { createDataItemSigner, dryrun, message } from "@permaweb/aoconnect";

import "./styles.css";

type MessageType = {
  id: string;
  text: string;
  type: "sent" | "received";
  timestamp: number;
};

const SEND_PROCESS = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc";
const SECRETARY = "_NaJSxuC_Zca_HcrKYc4E-dvteokk1iYm9INNhYuSOo";

function getTagValue(
  list: { [key: string]: any }[],
  name: string
): string | null {
  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      if (list[i]!.name === name) {
        return list[i]!.value as string;
      }
    }
  }
  return null;
}

export default function Petition() {
  const aoGather = new AoGatherProvider({});

  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
  const [text, setText] = React.useState<string>("");

  const [feeAmount, setFeeAmount] = React.useState<number>(0);
  const [amount, setAmount] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(false);

  // const [messageLog, setMessageLog] = React.useState<MessageType[]>([
  //   { text: "Send your petition", type: "received" },
  // ]);

  const [messageLog, setMessageLog] = React.useState<MessageType[]>([]);

  async function handleConnect() {
    if (!walletAddress) {
      if (window.arweaveWallet) {
        try {
          await global.window?.arweaveWallet?.connect([
            "ACCESS_ADDRESS",
            "ACCESS_PUBLIC_KEY",
            "SIGN_TRANSACTION",
            "DISPATCH",
            "SIGNATURE",
          ] as any);
          setWalletAddress(
            await global.window.arweaveWallet.getActiveAddress()
          );
        } catch (e: any) {
          console.error(e);
        }
      }
    }
  }

  React.useEffect(() => {
    (async function () {
      await handleConnect();
    })();

    window.addEventListener("arweaveWalletLoaded", handleConnect);

    return () => {
      window.removeEventListener("arweaveWalletLoaded", handleConnect);
    };
  }, []);

  React.useEffect(() => {
    (async function () {
      const response = await dryrun({
        process: SECRETARY,
        tags: [{ name: "Action", value: "Get-Priority-Fee" }],
      });

      if (response && response.Messages) {
        let fee: any = getTagValue(response.Messages[0].Tags, "Current-Fee");

        if (fee) {
          fee = parseInt(fee) / 1000;
          setFeeAmount(fee);
          setAmount(fee);
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    async function pollData() {
      if (walletAddress) {
        const response = await aoGather.getPosts({ dm: walletAddress });

        const fetchedMessages = Object.entries(response).map(
          ([id, message]) => ({
            id: id,
            text: message.textOrTxId,
            type: message.author === walletAddress ? "sent" : "received",
            timestamp: message.created,
          })
        );

        fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);

        setMessageLog((prevMessages: any) => {
          const existingIds = new Set(prevMessages.map((msg: any) => msg.id));

          const newMessages = fetchedMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );

          return [...prevMessages, ...newMessages].sort(
            (a, b) => a.timestamp - b.timestamp
          );
        });
      }
    }

    const intervalId = setInterval(pollData, 1000);
    return () => clearInterval(intervalId);
  }, [walletAddress]);

  async function handleSubmit() {
    setLoading(true);

    // setMessageLog((prevMessageLog) => [
    //   ...prevMessageLog,
    //   { text: text, type: "sent" },
    // ]);

    // setMessageLog((prevMessageLog) => [
    //   ...prevMessageLog,
    //   { text: "Hmm...", type: "received" },
    // ]);

    const messageId = await message({
      process: SEND_PROCESS,
      signer: createDataItemSigner(global.window.arweaveWallet),
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "X-Petition", value: text },
        { name: "Recipient", value: SECRETARY },
        { name: "Quantity", value: amount.toString() },
      ],
    });

    console.log(messageId);

    setLoading(false);
    setText("");
  }

  return (
    <div className={"petition-wrapper"}>
      <div className={"messages-wrapper"}>
        {messageLog.map((message: MessageType, index: number) => {
          return (
            <div key={index} className={`message ${message.type}-message`}>
              <p className="message-text">{message.text}</p>
            </div>
          );
        })}
      </div>
      <div className={"action-wrapper"}>
        <span>{`Prompt`}</span>
        <textarea
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          className={"prompt-input"}
        />

        <span>{`Current fee: ${feeAmount} ${feeAmount.toString() === "1" ? "token" : "tokens"}`}</span>
        <input
          type={"number"}
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          className={"amount-input"}
        />

        <div className={"submit-wrapper"}>
          <button
            className="submit"
            onClick={handleSubmit}
            disabled={loading || amount <= 0 || amount < feeAmount}
          >
            {loading
              ? "Sending..."
              : `Send ${amount} ${amount.toString() === "1" ? "token" : "tokens"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
