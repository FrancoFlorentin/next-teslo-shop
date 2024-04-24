'use client';
 
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;

  onQuantityChanged: (quantity: number) => void;
}

export function QuantitySelector({ quantity, onQuantityChanged }: Props) {


  return (
    <div className="flex">
      <button
        onClick={() => onQuantityChanged(quantity - 1)}
      >
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-slate-200 text-center rounded">
        {quantity}
      </span>

      <button
        onClick={() => onQuantityChanged(quantity + 1)}
      >
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  )
}
