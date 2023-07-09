import '../styles/globals.css'

const layout = ({ children }) => {
  return (
    <html lang="en">
      <div>
        <main>{children}</main>
      </div>
    </html>
  )
}

export default layout