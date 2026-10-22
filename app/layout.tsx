import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'FAMMA Cleaner | Operations',description:'FAMMA Cleaner Company LLC — bookings, teams and business performance in one workspace.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
