import Avatar from 'react-avatar'

// eslint-disable-next-line react/prop-types
const Client = ( { username } ) => {
  return (
    <div className='client flex items-center flex-col font-bold flex-1'>
      <Avatar name={username} size={50} round="14px" />
      <span>{username}</span>
    </div>
  )
}

export default Client
