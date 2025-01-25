import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link';

const PricingComponent = () => {
  return (
    <div className="bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="max-w-7xl mx-auto text-center relative z-10  mt-20">
        <h1 className="text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Pricing Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <Card className="bg-gradient-to-b from-gray-900 to-black border-gray-800 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 hover:translate-y-[-4px]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-4">Free</CardTitle>
              <p className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                $0
                <span className="text-lg font-normal text-gray-500"> / month</span>
              </p>
              <p className='text-gray-200'>
                For hobbyists and beginners who want to experiment with Kuiper 1.5 Bee
              </p>
            </CardHeader>
            <CardContent>
              <ul className="mb-8 text-left space-y-2">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Assistance with test writing & more
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Limited access to Kuiper 1.5 Bee
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Limited access to file, idl upload and more
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Output & input token limits
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Customer support in less than 72 hours 
                </li>
              </ul>
              <Link href={"/sign-in"}>
              <Button 
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Get Started
              </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-900 to-black border-gray-800 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 hover:translate-y-[-4px]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-4">Plus</CardTitle>
              <p className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                $19
                <span className="text-lg font-normal text-gray-500"> / month</span>
              </p>
              <p className='text-gray-200'>
                For daily users who want to thier efficeincy & testing experience
              </p>
            </CardHeader>
            <CardContent>
              <ul className="mb-8 text-left space-y-2">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to Kuiper 1.5 Bee
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Limited access to Kuiper 2.5 Optimus
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Increased access to file, idl upload and more
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Increased output & input token limits
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Customer support in less than 24 hours
                </li>
              </ul>
              <Button 
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-gray-900 to-black border-gray-800 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 hover:translate-y-[-4px]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-4">Enterprise</CardTitle>
              <p className="text-3xl font-semibold text-gray-500">
                Contact Sales
              </p>
              <p className='text-gray-200 mt-16'>
                For hobbyists and beginners who want to experiment with Kuiper 1.5 Bee
              </p>
            </CardHeader>
            <CardContent>
              <ul className="mb-8 text-left space-y-2">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to Kuiper 1.5 Bee
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to Kuiper 1.5 Optimus
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited file upload, idl upload and more
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  No limits on output & input token
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Customer support in less than 12 hours
                </li>
              </ul>
              <Button 
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;

