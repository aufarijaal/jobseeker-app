import EmailSettingForm from '@/components/forms/email-setting-form'
import NameSettingForm from '@/components/forms/name-setting-form'
import PasswordSettingForm from '@/components/forms/password-setting-form'
import { useAuth } from '@/context/authContext'

function AccountSettingPage() {
  const { user } = useAuth()
  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-10 flex flex-col gap-6">
        <header>
          <div className="text-2xl font-semibold">Account Settings</div>
        </header>

        <div className="h-px w-full bg-border"></div>

        <div id="name-setting">
          <NameSettingForm />
        </div>

        <div className="h-px w-full bg-border"></div>

        <div id="email-setting">
          <EmailSettingForm />
        </div>

        <div className="h-px w-full bg-border"></div>

        <div id="password-setting">
          <PasswordSettingForm />
        </div>
      </div>
    </main>
  )
}

export default AccountSettingPage
