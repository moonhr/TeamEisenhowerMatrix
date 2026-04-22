import Header from '@/components/layout/Header'
import HomeFooter from '@/components/home/HomeFooter'
import FeaturesPageContent from '@/components/marketing/FeaturesPageContent'

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <FeaturesPageContent />
      <HomeFooter />
    </div>
  )
}
