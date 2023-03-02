const index = () => {
  return (
    <div className='w-full h-[150px] bg-zinc-200 rounded-lg'>
      <div className='flex flex-col text-center justify-center'>
        <div className='flex justify-center mt-3'>
          <div className='flex'>
            <svg width='48' height='48' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='17' cy='17' r='17' fill='#141414' />
              <circle cx='17' cy='17' r='14.96' fill='#303030' />
              <circle cx='17' cy='17' r='13.6' fill='#141414' />
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M22.6849 13.9937L25.16 11.4567C24.06 9.99091 20.6389 7.32988 15.7548 8.41234C10.8707 9.49479 9.20964 13.7118 8.98963 15.6851C8.60462 17.9402 8.72562 22.8563 12.2897 24.48V17.2073C12.4547 15.5159 13.6427 12.0656 17.0748 11.795C20.5069 11.5244 22.2449 13.1481 22.6849 13.9937ZM17.2782 13.6203V22.7868C18.2123 23.1141 20.571 23.1796 22.5327 20.8225L25.16 23.2778C23.7004 25.0784 19.345 28.0575 13.6 25.5695V16.894C13.7168 15.6937 14.6159 13.3584 17.2782 13.6203Z'
                fill='#303030'
              />
            </svg>
          </div>
        </div>
        <p className='text-gray-500 mt-2'>ვერ მოიძებნა</p>
      </div>
    </div>
  )
}

export default index
