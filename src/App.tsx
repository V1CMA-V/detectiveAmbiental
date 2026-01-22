import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme-provider'
import Routing from './routing'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routing />
        <Toaster />
      </ThemeProvider>
    </>
  )
}

export default App
