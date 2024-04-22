import { AoRtcProvider } from "@/lib/services/ao-rtc";
import { useEffect, useState } from "react";

const defaultRtcProvider = new AoRtcProvider();

export default function useAoRtc() {
    const [rtc, setRtc] = useState(defaultRtcProvider);

    useEffect(() => {
        // starts the rtc provider when the component mounts
        window.arweaveWallet.connect([
            "ACCESS_ADDRESS",
            "ACCESS_PUBLIC_KEY",
            "SIGN_TRANSACTION",
            "ENCRYPT",
            "DECRYPT",
            "SIGNATURE",
            "ACCESS_ARWEAVE_CONFIG",
        ]).then(() => {
        rtc.register({
            // TODO: add user id here
        });
        }).then(()=>{
         rtc.start();
        })


        return () => {
          //  rtc.stop()
        };
    }, []);
  return {
    rtc,
    setRtc,
  };
}