const index = ({ className = '', ...rest }) => {
  return <input {...rest} className={`duration-normal rounded-lg w-full p-2 bg-lightBackground border-[1px] border-lightBorder text-primary focus:outline-none ${className}`} />
}

export default index
