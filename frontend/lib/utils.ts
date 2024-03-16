import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { cookies } from 'next/headers'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLastActive(lastActiveString: string) {
  // Parse the lastActive string into a Date object
  const lastActiveDate = new Date(lastActiveString)

  // Get the current date and time
  const currentDate = new Date()

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate.valueOf() - lastActiveDate.valueOf()

  // Convert the time difference to seconds
  const secondsDifference = Math.floor(timeDifference / 1000)

  // Define time intervals in seconds
  const minute = 60
  const hour = 60 * minute
  const day = 24 * hour

  // Determine the appropriate time unit and value
  if (secondsDifference < minute) {
    return `${secondsDifference} seconds ago`
  } else if (secondsDifference < hour) {
    const minutes = Math.floor(secondsDifference / minute)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (secondsDifference < day) {
    const hours = Math.floor(secondsDifference / hour)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    // You can add more detailed handling for longer time spans if needed
    return lastActiveDate.toLocaleDateString() // Fallback to full date if it's a longer duration
  }
}

export function generateCompanyLogoUrl(logo: string) {
  return `${process.env.NEXT_PUBLIC_SERVER_HOST}/company-logos/${logo}`
}

export function generatePhotoProfileUrl(photo: string) {
  return `${process.env.NEXT_PUBLIC_SERVER_HOST}/photo-profiles/${photo}`
}

export function parseEducationLevel(level: string) {
  let parsed = ''

  switch (level) {
    case 'DIPLOMA_1':
      parsed = 'D3'
      break
    case 'DIPLOMA_2':
      parsed = 'D2'
      break
    case 'DIPLOMA_3':
      parsed = 'D3'
      break
    case 'DIPLOMA_4':
      parsed = 'D4'
      break
    case 'SARJANA':
      parsed = 'S1'
      break
    case 'MAGISTER':
      parsed = 'S2'
      break
    case 'DOKTOR':
      parsed = 'S3'
      break
    case 'SD':
    case 'SMP':
    case 'SMA':
    default:
      break
  }

  return parsed
}
