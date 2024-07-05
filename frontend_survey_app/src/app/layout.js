import { Nunito } from 'next/font/google'
import '@/app/global.css'

// import { siteMetadata } from './metadata'

// export const siteMetadata = siteMetadata

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
