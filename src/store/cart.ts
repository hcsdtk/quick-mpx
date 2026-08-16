import { computed, ref } from '@mpxjs/core'
import { defineStore } from '@mpxjs/pinia'

export interface CartGoods {
  id: string | number
  price: number
  num: number
  [key: string]: unknown
}

export interface AddCartPayload {
  goods?: CartGoods
  index?: number
}

export interface CartInfo {
  price: number
  num: number
}

export const useCartStore = defineStore('cart', () => {
  const list = ref<CartGoods[]>([])

  const cartInfo = computed<CartInfo>(() => {
    return list.value.reduce<CartInfo>((info, item) => ({
      price: Math.round((info.price + item.price * item.num) * 100) / 100,
      num: Math.round((info.num + item.num) * 100) / 100
    }), { price: 0, num: 0 })
  })

  function addCart (payload: AddCartPayload = {}): void {
    const goods = payload.goods
    if (!goods) {
      return
    }

    const index = payload.index === undefined
      ? list.value.findIndex(item => item.id === goods.id)
      : payload.index

    if (goods.num <= 0) {
      if (index > -1) list.value.splice(index, 1)
      return
    }
    if (index === -1) {
      list.value.push(goods)
      return
    }

    list.value[index] = { ...list.value[index], num: goods.num }
  }

  return { list, cartInfo, addCart }
})

export default useCartStore
