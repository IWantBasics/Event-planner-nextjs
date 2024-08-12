import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ImEllo } from 'react-icons/im';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../app/Components/Input';
import Link from 'next/link';

const Login = () => {
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
  });

  const [errorState, setErrorState] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginState((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!loginState.email) {
      newErrors.email = 'Please enter your email';
      valid = false;
    }

    if (!loginState.password) {
      newErrors.password = 'Please enter your password';
      valid = false;
    }

    setErrorState(newErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, loginState, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          console.log('User data:', response.data.user);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Login successful!');
          router.push('/dashboard');
        } else {
          console.error('Login failed');
          toast.error('Login failed. Please try again.');
        }
      } catch (error: any) {
        console.error('An error occurred', error);
        toast.error(`An error occurred: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Login to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            name="email"
            label="Email"
            value={loginState.email}
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
            value={loginState.password}
            onChange={handleChange}
            type="password"
            required
            className="w-full"
            placeholder="Password"
            wrapperClass="mb-4"
            error={errorState.password}
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <span>Login</span>
            <ImEllo className="ml-2 text-xl" />
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;