import EducationManagement from '@/components/education-management'
import AboutMeForm from '@/components/forms/about-me-form'
import ProfilePhotoForm from '@/components/forms/profile-photo-form'
import JobExperienceManagement from '@/components/job-experience-management'
import SkillManagement from '@/components/skill-management'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/authContext'
import Head from 'next/head'

function ProfileSettingPage() {
  const { user } = useAuth()

  return (
    <>
      <Head>
        <title>Profile | JobSeeker</title>
      </Head>
      <main className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pb-10 flex flex-col gap-6">
          <header>
            <div className="text-2xl font-semibold">Profile</div>
          </header>

          <div className="h-px w-full bg-border"></div>

          <div>
            <ProfilePhotoForm />
          </div>

          <div className="h-px w-full bg-border"></div>

          <div>
            <AboutMeForm />
          </div>

          <div className="h-px w-full bg-border"></div>

          <div>
            <SkillManagement id="skills" name="skills" label="Skills" />
          </div>

          <div className="h-px w-full bg-border"></div>

          <div>
            <JobExperienceManagement />
          </div>

          <div className="h-px w-full bg-border"></div>

          <div id="education-management">
            <EducationManagement />
          </div>
        </div>
      </main>
    </>
  )
}

export default ProfileSettingPage
