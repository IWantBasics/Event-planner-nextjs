import React, {InputHTMLAttributes} from 'react'

interface Inputprops extends InputHTMLAttributes<HTMLInputElement> {
    name:string;
    label?:string;
    error?:string;
    register?:any;
    className?:string
    wrapperClass?:string;
}


const Input = ({name, label, error, register, className, wrapperClass, type, ...rest}: Inputprops) => {
  return (
    <>
    <div className={wrapperClass}>
        {label && <label htmlFor={name} className="text-bold block text-black font-medium" >{label}</label>}
        <input id={name} name={name} type={type} className={`block px-2  py-2 border border-black rounded-md placeholder-black focus:outline-none sm:text-sm ${className}`}
        aria-invalid={error ? true : undefined}
        {...rest}
        {...(register ? register(name) : {})}
        />
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
    </>
  )
}

export default Input