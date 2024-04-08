import React from 'react'
  const today = new Date();
const Footer = () => {
  return (
    <footer className='Footer'>
        <p>Copyright @:{today.getFullYear()}</p>
    </footer>
  )
}

export default Footer