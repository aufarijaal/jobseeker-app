import React from 'react'

function HomepageHero() {
  return (
    <div id="hero" className="mt-16 flex flex-col items-center gap-4">
      <img src="/jobseeker_logo.svg" width="32" height="32" alt="brand logo" />
      <h1 className="font-bold text-6xl text-center">
        Start reach your success!
      </h1>
      <h5 className="text-xl text-gray-400 text-center max-w-[600px]">
        The best job seeking platform providing various job vacancies to help
        you start reach your career path.
      </h5>
    </div>
  )
}

export default HomepageHero
