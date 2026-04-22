import Header from '@/components/layout/Header'
import HomeFooter from '@/components/home/HomeFooter'
import AboutPageContent from '@/components/marketing/AboutPageContent'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AboutPageContent />
      <HomeFooter />
    </div>
  )
}
