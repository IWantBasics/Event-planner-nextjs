"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const link_1 = __importDefault(require("next/link"));
const im_1 = require("react-icons/im");
const axios_1 = __importDefault(require("axios"));
const DashboardNavbar = () => {
    const router = (0, router_1.useRouter)();
    const handleLogout = async () => {
        console.log('Logout button clicked');
        try {
            const response = await axios_1.default.post('http://localhost:3000/api/logout', {}, {
                withCredentials: true
            });
            console.log('Logout response:', response);
            if (response.status === 200) {
                localStorage.removeItem('token');
                console.log('Token removed from localStorage');
                router.push('/login');
            }
            else {
                console.error('Logout failed');
            }
        }
        catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (<nav className="px-60 flex items-center justify-between">
      <link_1.default href="/dashboard">
        <img src="/logopin.png" className="h-20 w-50 cursor-pointer" alt="EventConnect logo" title="Return to Dashboard"/>
      </link_1.default>
      <ul className="flex justify-space space-x-14 pr-6">
        <li onClick={handleLogout} className="cursor-pointer font-medium text-white border border-red-500 px-5 py-2 bg-red-500 rounded-full flex items-center space-x-2 select-none">
          <span>Logout</span>
          <im_1.ImEllo className="text-2xl"/>
        </li>
      </ul>
    </nav>);
};
exports.default = DashboardNavbar;
//# sourceMappingURL=DashboardNavbar.jsx.map