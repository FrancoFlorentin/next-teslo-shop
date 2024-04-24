'use client';

import { login, registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form'

type FormInputs = {
  name: string;
  email: string;
  password: string;
}


export function RegisterForm() {

  const [errorMessage, setErrorMessage] = useState('')
  const { register, handleSubmit, formState: {errors} } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage('')
    const { name, email, password } = data;
    
    // Server action
    const res = await registerUser(name, email, password);
    if (!res.ok) {
      setErrorMessage(res.message as any)
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace('/')

  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

      {/* {
        errors.name?.type === 'required' && (
          <span className="text-red-500 ">* El nombre es obligatorio</span>
        )
      } */}

        <label htmlFor="name">Nombre Completo</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': !!errors.name
              }
            )
          }
          type="text" 
          autoFocus
          {...register('name', {required: true})}
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': !!errors.email
              }
            )
          }
          type="email" 
          {...register('email', {required: true, pattern: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i})}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': !!errors.password
              }
            )
          }
          type="password" 
          {...register('password', {required: true, minLength: 6})}
        />

        
        <span className="text-red-500 ">{errorMessage}</span>

        <button
          
          className="btn-primary">
          Registrarse
        </button>


        {/* divisor l ine */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link
          href="/auth/login" 
          className="btn-secondary text-center">
          Ingresar
        </Link>

      </form>
  )
}
