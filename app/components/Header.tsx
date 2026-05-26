"use client";

import { Menu, User } from "lucide-react";

type HeaderProps = {
  toggleSidebar: () => void;
  username: string;
};

export default function Header({
  toggleSidebar,
  username,
}: HeaderProps) {
  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar}>
          <Menu />
        </button>

        <h1 className="text-xl font-bold">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <User />
        <span>{username}</span>
      </div>
    </div>
  );
}