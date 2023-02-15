import React from 'react'

export default function Button({value,onClick}) {
  return (
    <div>
        <input type="button" value ={value} onClick={onClick}></input>

    </div>
  )
}
