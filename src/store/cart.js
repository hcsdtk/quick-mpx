import { createStore } from '@mpxjs/store'

const CartStore = createStore({
  state: {
    list: []
  },
  getters: {
    cartInfo: state => {
      const info = {
        price: 0,
        num: 0
      }
      state.list.forEach(item => {
        info.price = Math.round(info.price * 100 + item.price * item.num * 100) / 100
        info.num = Math.round(info.num * 100 + item.num * 100) / 100
      })
      return info
    }
  },
  mutations: {
    add (state, payload) {
      const goods = payload && payload.goods
      if (!goods) {
        return false
      }

      const index = payload.index === undefined
        ? state.list.findIndex(item => item.id === goods.id)
        : payload.index

      if (goods.num <= 0) {
        if (index > -1) state.list.splice(index, 1)
        return false
      }
      if (index === -1) {
        state.list.push(goods)
      } else {
        const cartObject = JSON.parse(JSON.stringify(state.list))
        cartObject[index].num = goods.num
        state.list = cartObject
      }
    }
  },
  actions: {
    addCart ({ commit }, payload) {
      commit('add', payload)
    }
  }
})

export default CartStore
