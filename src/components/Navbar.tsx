import { ConnectButton } from "@mysten/dapp-kit";
import React from "react";
import logo from "../images/gmfi.jpg";

export const Navbar = () => {
  return (
    <div>
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <a href="/" className="">
            <img src={logo} width={50} alt="" className="rounded-xl " />
          </a>
        </div>
        <div className="flex-none">
          {" "}
          <ConnectButton className="btn btn-primary font-bold uppercase text-base-content hover:text-secondary" />
          {/* <button className="btn btn-primary font-bold uppercase text-base-content hover:text-secondary">
            Connect Wallet
          </button> */}
        </div>
      </div>
    </div>
  );
};
