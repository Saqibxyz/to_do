import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
            <div className="p-8 bg-white rounded-xl shadow-lg">
                <SignIn />
            </div>
        </div>

    )
}

export default SignInPage;