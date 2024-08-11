"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input = ({ name, label, error, register, className, wrapperClass, type, ...rest }) => {
    return (<>
    <div className={wrapperClass}>
        {label && <label htmlFor={name} className="text-bold block text-black font-medium">{label}</label>}
        <input id={name} name={name} type={type} className={`block px-2  py-2 border border-black rounded-md placeholder-black focus:outline-none sm:text-sm ${className}`} aria-invalid={error ? true : undefined} {...rest} {...(register ? register(name) : {})}/>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
    </>);
};
exports.default = Input;
//# sourceMappingURL=Input.jsx.map