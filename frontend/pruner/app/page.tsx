'use client'

import { useState, useEffect } from 'react'
import { FImage } from '@/components/common/fallback-image'
import { useTheme } from 'next-themes'
import { Copy, Edit, Trash2 } from 'lucide-react'
import { CustomButton } from "@/components/ui/custom-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomSwitch } from "@/components/ui/custom-switch"
import Header from '@/components/shared/header'
import GradientText from '@/components/shared/gradient-text'
import PruneInput from '@/components/common/prune-input'
import { shortenUrl } from '@/api/url-shotener'
import { ValidateRegex, VALIDATORS } from '@/utils/inputs'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [url, setUrl] = useState('')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ first_name: 'Nasirullah' });
  const [shortenedLinks, setShortenedLinks] = useState([
    { short: 'https://prunely.com/Bn41aC0lnq', original: 'https://www.twitter.com/tweets/8ereiColhu/', qr: '/placeholder.svg?height=50&width=50', clicks: 1313, status: 'Active', date: 'Oct - 10 - 2023' },
    { short: 'https://prunely.com/Bn41aC0lnq', original: 'https://www.youtube.com/watch?v=8J7ZmH0iXuk', qr: '/placeholder.svg?height=50&width=50', clicks: 4313, status: 'Inactive', date: 'Oct - 08 - 2023' },
    { short: 'https://prunely.com/Bn41aC0lnq', original: 'https://www.adventuresinwanderlust.com/', qr: '/placeholder.svg?height=50&width=50', clicks: 1013, status: 'Active', date: 'Oct - 01 - 2023' },
  ])
  const MAX_UNAUTH_LINKS = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShorten = async () => {
    const isValid = ValidateRegex[VALIDATORS.URL].test(url);
    if (!isValid) return alert('Invalid URL')
    setIsLoading(false);
    const response = await shortenUrl(url);
    setIsLoading(false);
    console.log(response)
    // if (response) {
    //   setShortenedLinks([...shortenedLinks, response.data])
    // }
    setUrl('');
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0F1117] text-white' : 'bg-white text-black'}`}>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} theme={theme} />

      <main className="container mx-auto px-4 py-8">
        <GradientText as="h2" className="text-5xl font-bold text-center mb-2">
          Shorten Your Loooong Links :)
        </GradientText>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Prunely is an efficient and easy-to-use URL shortening service that streamlines your online experience.
        </p>

        <PruneInput
          value={url}
          onChange={setUrl}
          actionHandler={handleShorten}
          buttonText="Prune Now!"
          isLoading={isLoading}
        />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center bg-[#1A1D26] rounded-full p-1">
            <span className={`text-sm px-3 py-1 rounded-full transition-colors ${theme === 'light' ? 'bg-white text-black' : 'text-white'}`}>Light</span>
            <CustomSwitch checked={theme === 'dark'} onCheckedChange={toggleTheme} className="mx-2" />
            <span className={`text-sm px-3 py-1 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'text-white'}`}>Dark</span>
          </div>
          <div className="flex items-center">
            <CustomSwitch className="mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto Paste from Clipboard</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          You can prune <span className="text-pink-500">{isAuthenticated ? `unlimited` : MAX_UNAUTH_LINKS - shortenedLinks?.length ||`05`}</span> more links. {isAuthenticated ? 'Enjoy Unlimited usage' : <CustomButton variant="link" className="text-blue-600 p-0" onClick={() => setIsAuthenticated(true)}>Register Now</CustomButton>} to enjoy Unlimited usage
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pruned Link</TableHead>
              <TableHead>Original Link</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortenedLinks.map((link, index) => (
              <TableRow key={index} className={theme === 'dark' ? 'bg-[#1A1D26] border-gray-700' : 'bg-gray-100 border-gray-200'}>
                <TableCell>{link.short}</TableCell>
                <TableCell>{link.original}</TableCell>
                <TableCell><FImage alt="QR Code" className="w-8 h-8" /></TableCell>
                <TableCell>{link.clicks}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    link.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {link.status}
                  </span>
                </TableCell>
                <TableCell>{link.date}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <CustomButton variant="ghost" size="icon"><Copy className="h-4 w-4" /></CustomButton>
                    <CustomButton variant="ghost" size="icon"><Edit className="h-4 w-4" /></CustomButton>
                    <CustomButton variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></CustomButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}