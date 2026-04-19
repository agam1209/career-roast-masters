import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import './styles.css'

const router = getRouter()

hydrateRoot(document.getElementById('root') as HTMLElement, <RouterProvider router={router} />)
