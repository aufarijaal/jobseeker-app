import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/context/authContext'

function MePage() {
  const {user} = useAuth()
  return (
    <main className="pt-20">
      <div className="max-w-7xl mx-auto px-4 pb-10 grid lg:grid-cols-[auto_450px] md:grid-cols-1 gap-10">
        {JSON.stringify(user)}
      </div>
    </main>
  )
}

export default MePage
