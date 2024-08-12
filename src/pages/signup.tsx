import Link from 'next/link';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ImEllo } from 'react-icons/im';
import Input from '../app/Components/Input';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const Signup = () => {
  const [signupState, setSignupState] = useState({
    fullname: '', 
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorState, setErrorState] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupState((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { fullname: '', email: '', password: '', confirmPassword: '' };

    if (!signupState.fullname) {
      newErrors.fullname = 'Please Enter Full Name';
      valid = false;
    }

    if (!signupState.email) {
      newErrors.email = 'Please Enter Email';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupState.email)) {
      newErrors.email = 'Please Enter a Valid Email';
      valid = false;
    }

    if (!signupState.password) {
      newErrors.password = 'Please Enter Password';
      valid = false;
    }

    if (signupState.confirmPassword !== signupState.password) {
      newErrors.confirmPassword = "Passwords don't match";
      valid = false;
    }
    setErrorState(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, signupState, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Signed up successfully, redirecting to dashboard!', {
            onClose: () => router.push('/dashboard'),
            className: 'toast-success'
          });
        } else {
          console.error('Signup failed');
          toast.error('Signup failed. Please try again.');
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error('An error occurred', axiosError);
        if (axiosError.response && axiosError.response.data && (axiosError.response.data as any).message) {
          toast.error((axiosError.response.data as any).message);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            name="fullname"
            label="Full Name"
            value={signupState.fullname}
            onChange={handleChange}
            type="text"
            required
            className="w-full"
            placeholder="Full Name"
            wrapperClass="mb-4"
            error={errorState.fullname}
          />
          <Input
            name="email"
            label="Email"
            value={signupState.email}
            onChange={handleChange}
            type="email"
            required
            className="w-full"
            placeholder="Email"
            wrapperClass="mb-4"
            error={errorState.email}
          />
          <Input
            name="password"
            label="Password"
            value={signupState.password}
            onChange={handleChange}
            type="password"
            required
            className="w-full"
            placeholder="Password"
            wrapperClass="mb-4"
            error={errorState.password}
          />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            value={signupState.confirmPassword}
            onChange={handleChange}
            type="password"
            required
            className="w-full"
            placeholder="Confirm Password"
            wrapperClass="mb-4"
            error={errorState.confirmPassword}
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <span>Sign up</span>
            <ImEllo className="ml-2 text-xl" />
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;