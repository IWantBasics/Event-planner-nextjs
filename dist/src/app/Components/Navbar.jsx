"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const im_1 = require("react-icons/im");
const link_1 = __importDefault(require("next/link"));
const Navbar = () => {
    return (<nav className="px-60 flex items-center justify-between">
    <div>
    <img src="/logopin.png" className="h-20 w-50 cursor-pointer" alt="logo"/>
    </div>
    <ul className="flex justify-space space-x-14 pr-6">

    <link_1.default href="/login">
    <li className="cursor-pointer font-semibold px-5 py-2 flex items-center mx-auto space-x-2 border border-black rounded-full border-2 select-none">
        <span>Login</span>
        <im_1.ImEllo className="text-xl"/>
    </li>
    </link_1.default>
   
    <link_1.default href="/signup">
    <li className="cursor-pointer font-medium text-white border border-blue-500 px-5 py-2 bg-blue-500 rounded-full flex items-center space-x-2 select-none">
        <span>Sign up</span>
        <im_1.ImEllo className="text-xl"/>
    </li>
    </link_1.default>
    </ul>
    </nav>);
};
exports.default = Navbar;
//# sourceMappingURL=Navbar.jsx.map