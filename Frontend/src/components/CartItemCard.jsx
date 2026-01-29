import React from 'react'

function CartItemCard(data) {
  return (
    <div className='flex items-center justify-between bg-white p-4 rounded-xl shadow border'>
        <div className='flex items-center gap-4'>
            <img src={data.image} alt={data.name} className='w-20 h-20 object-cover rounded-lg border' />
            <div>
                <h1 className='font-medium text-gray-800'>{data.name}</h1>
            </div>
        </div>
    </div>
  )
}

export default CartItemCard