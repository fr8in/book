export default {
  objSort: (a, b) => {
    const A = a.displayPosition
    const B = b.displayPosition

    return (A > B) ? 1 : -1
  }
}
